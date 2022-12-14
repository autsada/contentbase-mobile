import { useEffect, useState, useRef, useCallback } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  Modal,
  Pressable,
  Alert,
  Platform,
  Animated,
  Image,
} from 'react-native'
import ImagePicker from 'react-native-image-crop-picker'
import type { Image as PickedImage } from 'react-native-image-crop-picker'
import * as MediaLibrary from 'expo-media-library'
import { useFormik } from 'formik'
import type { FormikProps } from 'formik'
import * as yup from 'yup'
import _ from 'lodash'
import Constants from 'expo-constants'
import * as FileSystem from 'expo-file-system'

import SafeAreaContainer from '../shared/SafeAreaContainer'
import CustomKeyboardAvoidingView from '../shared/CustomKeyboardAvoidingView'
import CloseButton from '../shared/CloseButton'
import CloseErrorIcon from '../icons/CloseErrorIcon'
import {
  TextHeader5,
  TextBase,
  TextLightItalic,
  TextLight,
} from '../shared/Texts'
import RegularButton from '../shared/RegularButton'
import Overlay from '../shared/Overlay'
import ImageIcon from '../icons/ImageIcon'
import CameraIcon from '../icons/CameraIcon'
import EditIcon from '../icons/EditIcon'
import TrashIcon from '../icons/TrashIcon'
import ErrorMessage from '../shared/ErrorMessage'
import CheckIcon from '../icons/CheckIcon'
import { useLinking } from '../../hooks/useLinking'
import { useAuth, useAppOverlay } from '../../store/hooks'
import { createProfileNft, verifyHandle } from '../../graphql'
import { takeProfileImage, pickProfileImage } from '../../utils/media'
import { generateBoxShadow } from '../../utils/helpers'
import { theme } from '../../styles/theme'
import type { NexusGenObjects } from '../../gentypes/typegen'

interface Props {
  visible: boolean
  title?: string
  closeModal: () => void
}

const OS = Platform.OS
const uploadActionShadow = generateBoxShadow({
  OS,
  xOffset: 2,
  yOffset: 2,
  shadowColor: theme.colors.gray,
  shadowRadius: 2,
  elevation: 3,
  shadowOpacity: 0.2,
})
const httpApiEndpoint = Constants.manifest.extra?.httpApiEndpoint

export default function CreateProfileModal({
  visible,
  closeModal,
  title = 'Create New Profile',
}: Props) {
  const [selectedImage, setSelectedImage] = useState<PickedImage | undefined>()
  const [showUploadActions, setShowUploadActions] = useState(false)
  const [isHandleUnique, setIsHandleUnique] = useState<boolean>()
  const [processing, setProcessing] = useState(false)

  const { user, signInProvider, token, account } = useAuth()
  const { applyAppBackdrop } = useAppOverlay()
  const fadeAnim = useRef(new Animated.Value(0)).current
  const { openSettings } = useLinking()
  const {
    handleBlur,
    handleChange,
    values,
    errors,
    touched,
    handleSubmit,
    resetForm,
    setErrors,
  }: FormikProps<{ handle: string }> = useFormik({
    initialValues: {
      handle: '',
    },
    validationSchema: yup.object({
      handle: yup
        .string()
        .min(3, 'At least 3 characters.')
        .max(25, 'Maximum 25 characters.')
        .required('You need to specify your handle.'),
    }),
    onSubmit: handleCreateProfile,
  })

  // Clean up temp images
  useEffect(() => {
    const cleanup = async () => {
      await ImagePicker.clean()
    }
    return () => {
      cleanup()
    }
  }, [])

  // Verify handle when user types
  useEffect(() => {
    if (values.handle) {
      validateHandleDebounce(values.handle)
    }
  }, [values.handle])

  function handleCloseModal() {
    // Reset input value
    if (values.handle) {
      resetForm({ values: { handle: '' } })
    }
    // Reset errors
    if (errors.handle) {
      setErrors({})
    }
    // Reset validate handle state
    if (typeof isHandleUnique === 'boolean') setIsHandleUnique(undefined)
    if (showUploadActions) {
      closeUploadActions()
    }
    if (selectedImage) setSelectedImage(undefined)
    closeModal()

    // Close backdrop
    applyAppBackdrop(false)
  }

  function openUploadActions() {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start()
    setShowUploadActions(true)
  }

  function closeUploadActions() {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start()
    setShowUploadActions(false)
  }

  async function onPickProfileImage() {
    try {
      if (!showUploadActions) return
      closeUploadActions()

      const image = await pickProfileImage()
      setSelectedImage(image)
    } catch (error) {
      if (error.code === 'E_NO_LIBRARY_PERMISSION') {
        Alert.alert(
          'Permission Required',
          'SEVANA needs permission to access your media library. You can grant this permission in the app Settings.',
          [
            { text: 'CANCEL', style: 'destructive' },
            {
              text: 'OPEN SETTINGS',
              onPress: openSettings,
            },
          ]
        )
      }
    }
  }

  async function onTakeProfileImage() {
    try {
      if (!showUploadActions) return

      const image = await takeProfileImage()
      setSelectedImage(image)
      closeUploadActions()

      // Save file to the device so we can send it to the backend for further processes
      saveProfileImage(image)
    } catch (error) {
      if (error.code === 'E_NO_CAMERA_PERMISSION') {
        Alert.alert(
          'Permission Required',
          'SEVANA needs permission to use camera. You can grant this permission in the app Settings.',
          [
            { text: 'CANCEL', style: 'destructive' },
            {
              text: 'OPEN SETTINGS',
              onPress: openSettings,
            },
          ]
        )
      }
    }
  }

  async function trashSelectedImage() {
    try {
      if (!selectedImage) return
      // Clear tmp cache
      setSelectedImage(undefined)
      await ImagePicker.clean()
    } catch (error) {
      console.log('clean up error: ', error.message)
    }
  }

  async function saveProfileImage(image: PickedImage) {
    try {
      if (!image) return

      // Check the permission first
      const granted = await getMediaLibraryPermission()

      if (!granted) {
        // Open setting
        Alert.alert(
          'Permission Required',
          'In order to save images, SEVANA needs permission to access your media library. You can grant this permission in the app Settings.',
          [
            { text: 'CANCEL', style: 'destructive' },
            {
              text: 'OPEN SETTINGS',
              onPress: openSettings,
            },
          ]
        )
      } else {
        // Save image to media library and get info to have local uri for use to send to the backend
        const asset = await MediaLibrary.createAssetAsync(image.path)
        const info = await MediaLibrary.getAssetInfoAsync(asset)
        setSelectedImage((prev) => ({
          ...prev,
          sourceURL: info.localUri,
          filename: info.filename,
        }))
      }
    } catch (error) {
      Alert.alert('', 'Error occurred while attempting to save the image.', [
        { text: 'CLOSE' },
      ])
    }
  }

  async function getMediaLibraryPermission() {
    try {
      const { granted, canAskAgain } = await MediaLibrary.getPermissionsAsync()

      if (!granted) {
        if (canAskAgain) {
          // Ask user to grant the permission
          const permission = await MediaLibrary.requestPermissionsAsync()

          return permission.granted
        }

        return granted
      } else {
        return granted
      }
    } catch (error) {
      return false
    }
  }

  const validateHandleDebounce = useCallback(
    _.debounce(handleValidateHandle, 200),
    [values.handle]
  )

  /**
   * @param {string} handle a handle to be validated
   */
  async function handleValidateHandle(handle: string) {
    try {
      if (handle && handle.length < 3) return

      const isUnique = await verifyHandle(handle)
      setIsHandleUnique(isUnique)
    } catch (error) {
      console.log('verify handle error: ', error)
    }
  }

  /**
   * @dev If user signs in with wallet, connect to blockchain directly
   * If user signs in with phone/email/google, connect to the server
   * @param {string} values.handle a handle name given by user
   */
  async function handleCreateProfile(values: { handle: string }) {
    try {
      if (!user || !token) {
        Alert.alert('', 'Please log in to proceed.')
        return
      }

      const handle = values.handle
      if (!handle) {
        Alert.alert('', 'Handle is required.')
        return
      }

      // Start the process
      setProcessing(true)

      // If user uploads profile image, send the image to backend to save to web3.storage and cloud storage and get back URLs that point to the image
      let profileNFT = ''
      let storageImageURL = ''

      if (selectedImage) {
        // console.log('selected image -->', selectedImage)
        const response = await FileSystem.uploadAsync(
          `${httpApiEndpoint}/api/uploads/profile`,
          selectedImage.sourceURL || selectedImage.path,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            fieldName: 'avatar',
            parameters: {
              userId: user.uid,
              handle,
              address: account.address,
              fileName:
                selectedImage.filename ||
                (selectedImage.path &&
                  selectedImage.path.split('/')[
                    selectedImage.path.split('/').length - 1
                  ]) ||
                handle,
              mime: selectedImage.mime,
            },
          }
        )

        const { tokenURI } = JSON.parse(
          response.body
        ) as NexusGenObjects['UploadReturnType']

        console.log('token URI -->', tokenURI)
        profileNFT = tokenURI
      }

      if (signInProvider === 'custom') {
        // User signs in with wallet
      } else {
        // // User signs in with traditional methods (phone, email, google)
        // await createProfileNft({
        //   handle: values.handle,
        //   tokenURI: profileNFT,
        //   imageURI: storageImageURL,
        // })
        // handleCloseModal()
        // Alert.alert(
        //   'Profile Created',
        //   'Your profile has been successfully created.',
        //   [
        //     {
        //       text: 'CLOSE',
        //     },
        //   ]
        // )
      }

      setProcessing(false)
    } catch (error) {
      console.log('error -->', error)
      setProcessing(false)
      Alert.alert(
        'Create Profile Failed',
        'Reasons why creating profile failed - 1. This handle might be already taken. 2. You may have not enough ETH (the balance should be at least 0.0000000000003 ETH). 3. Network error.',
        [{ text: 'CLOSE' }]
      )
    }
  }

  return (
    <Modal
      visible={visible}
      presentationStyle='overFullScreen'
      transparent={true}
      animationType='slide'
    >
      <SafeAreaContainer containerStyle={styles.container}>
        <CustomKeyboardAvoidingView
          containerStyle={styles.content}
          contentContainerStyle={{ width: '100%' }}
          keyboardVerticalOffset={0}
        >
          <View style={styles.form}>
            <Pressable
              hitSlop={20}
              style={{
                alignSelf: 'flex-end',
                marginBottom: 20,
              }}
              onPress={handleCloseModal}
            >
              <CloseButton />
            </Pressable>

            <TextHeader5 style={styles.title}>{title}</TextHeader5>
            <View style={styles.inputContainer}>
              <TextLight style={styles.label}>
                What do you like to be called? e.g. "Abby"
              </TextLight>
              <View style={{ justifyContent: 'center' }}>
                <TextInput
                  placeholder='Your handle*'
                  style={styles.input}
                  // autoFocus={true}
                  onChangeText={handleChange('handle')}
                  onBlur={handleBlur('handle')}
                  value={values.handle}
                />
                {!errors.handle && typeof isHandleUnique === 'boolean' && (
                  <View style={styles.verify}>
                    {isHandleUnique ? <CheckIcon /> : <CloseErrorIcon />}
                  </View>
                )}
              </View>
              <ErrorMessage
                message={
                  touched.handle && errors.handle
                    ? errors.handle
                    : typeof isHandleUnique === 'boolean' && !isHandleUnique
                    ? 'This handle is taken'
                    : ''
                }
                style={{ bottom: -15, left: 5 }}
              />
            </View>
            <View style={[styles.inputContainer]}>
              <TextLight style={styles.label}>
                Profile Image (optional)
              </TextLight>
              <TextLightItalic
                style={[
                  styles.label,
                  {
                    color: theme.colors.lightGray,
                    fontSize: theme.fontSize.sm,
                  },
                ]}
              >
                You can add/update it later.
              </TextLightItalic>
              <Pressable
                style={styles.uploadContainer}
                onPress={
                  showUploadActions ? closeUploadActions : openUploadActions
                }
              >
                <View style={styles.upload}>
                  {!!selectedImage ? (
                    <>
                      <Image
                        source={{
                          uri: selectedImage.path,
                          width: selectedImage.width,
                          height: selectedImage.height,
                        }}
                        style={{ width: '100%', height: '100%' }}
                      />
                      <EditIcon
                        style={{
                          position: 'absolute',
                          bottom: 10,
                          right: 20,
                        }}
                      />
                    </>
                  ) : (
                    <CameraIcon size={34} style={{ position: 'absolute' }} />
                  )}
                </View>

                {/* Upload actions modal */}
                {showUploadActions && (
                  <Animated.View
                    style={[
                      styles.uploadActions,
                      {
                        opacity: fadeAnim,
                        top: !selectedImage ? -70 : -120,
                      },
                      uploadActionShadow,
                    ]}
                  >
                    <Pressable
                      style={styles.uploadAction}
                      onPress={onPickProfileImage}
                    >
                      <View style={styles.uploadIcon}>
                        <ImageIcon size={30} />
                      </View>
                      <TextBase style={{ marginLeft: 5 }}>
                        Select Photo
                      </TextBase>
                    </Pressable>
                    <Pressable
                      style={[
                        styles.uploadAction,
                        { borderBottomWidth: !selectedImage ? 0 : 1 },
                      ]}
                      onPress={onTakeProfileImage}
                    >
                      <View style={styles.uploadIcon}>
                        <CameraIcon size={20} />
                      </View>
                      <TextBase style={{ marginLeft: 5 }}>Take Photo</TextBase>
                    </Pressable>
                    {!!selectedImage && (
                      <Pressable
                        style={[
                          styles.uploadAction,
                          {
                            justifyContent: 'center',
                            height: 40,
                            borderBottomWidth: 0,
                          },
                        ]}
                        onPress={trashSelectedImage}
                      >
                        <TrashIcon size={30} />
                      </Pressable>
                    )}
                  </Animated.View>
                )}
              </Pressable>
            </View>
            <RegularButton
              title='CREATE PROFILE'
              containerStyle={styles.button}
              titleStyle={styles.buttonText}
              disabled={!isHandleUnique || !!errors.handle || processing}
              loading={processing}
              withSpinner={true}
              spinnerColor={theme.colors.lightBlue}
              onPress={handleSubmit}
            />
          </View>
        </CustomKeyboardAvoidingView>
      </SafeAreaContainer>
      {processing && (
        <Overlay
          withInfo={true}
          info='Creating profile, please DO NOT close the app.'
        />
      )}
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    width: '90%',
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.xl,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: theme.fontSize.md,
    textAlign: 'center',
    paddingHorizontal: 5,
  },
  inputContainer: {
    marginTop: 30,
    width: '100%',
  },
  label: {
    color: theme.colors.blue,
    fontSize: theme.fontSize.base,
    paddingLeft: 5,
    marginBottom: 2,
  },
  input: {
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
    borderRadius: 4,
    paddingLeft: 10,
    fontSize: theme.fontSize.md,
    color: theme.colors.darkBlue,
  },
  verify: {
    position: 'absolute',
    right: 5,
  },
  uploadContainer: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upload: {
    width: 120,
    height: 120,
    borderRadius: 999,
    backgroundColor: theme.colors.lightBlue,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  uploadActions: {
    position: 'absolute',
    right: 0,
    backgroundColor: theme.colors.backgroundGray,
    width: '60%',
    borderRadius: theme.radius.lg,
  },
  uploadAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 50,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.veryLightGray,
  },
  uploadIcon: {
    width: 30,
    alignItems: 'center',
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: theme.colors.blue,
    borderRadius: 100,
    marginVertical: 30,
  },
  buttonText: {
    color: theme.colors.white,
    letterSpacing: theme.spacing.default,
  },
})
