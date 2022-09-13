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
import { useAuth } from '../../store/hooks/useAuth'
import { createProfileNft, verifyHandle } from '../../graphql'
import { takeProfileImage, pickProfileImage } from '../../utils/media'
import { generateBoxShadow, getBottomBarColor } from '../../utils/helpers'
import { theme } from '../../styles/theme'

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

export default function CreateProfileModal({
  visible,
  closeModal,
  title = 'Create New Profile',
}: Props) {
  const [selectedImage, setSelectedImage] = useState<PickedImage | undefined>()
  const [showUploadActions, setShowUploadActions] = useState(false)
  const [isHandleUnique, setIsHandleUnique] = useState<boolean>()
  const [processing, setProcessing] = useState(false)

  const { signInProvider } = useAuth()
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

  // Android- change navigation bar color
  useEffect(() => {
    if (OS === 'android') {
      if (visible) {
        getBottomBarColor(theme.colors.transparentBlack, 'light')
      } else {
        getBottomBarColor('#fff', 'dark')
      }
    }

    return () => {
      if (OS === 'android') {
        getBottomBarColor('#fff', 'dark')
      }
    }
  }, [visible])

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
    closeModal()
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

      // Ask user if they want to also save the image
      Alert.alert(
        '',
        'Do you want to save this image to the gallery as well?',
        [
          {
            text: 'NOT SAVE',
            style: 'destructive',
          },
          {
            text: 'SAVE',
            onPress: saveProfileImage.bind(undefined, image),
          },
        ]
      )
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
      await ImagePicker.cleanSingle(selectedImage.path)
    } catch (error) {
      console.log('clean up error: ', error.code)
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
        // Save image to media library
        await MediaLibrary.createAssetAsync(image.path)
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
    _.debounce(handleValidateHandle, 400),
    [values.handle]
  )

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
   */
  async function handleCreateProfile(values: { handle: string }) {
    try {
      if (signInProvider === 'custom') {
        // User signs in with wallet
      } else {
        // User signs in with traditional methods (phone, email, google)
        setProcessing(true)

        // If user uploads profile image, save the image to nft.storage first
        if (selectedImage) {
        }

        await createProfileNft({ handle: values.handle, imageURI: '' })

        setProcessing(false)
        Alert.alert(
          'Profile Created',
          'Your profile has been successfully created.',
          [
            {
              text: 'CLOSE',
              onPress: handleCloseModal,
            },
          ]
        )
      }
    } catch (error) {
      console.log('error -->', error)
      setProcessing(false)
      Alert.alert(
        'Create Profile Failed',
        'Please make sure you have some ethers in your wallet to pay gas fee (at least 0.0000000000003 ETH).',
        [{ text: 'CLOSE' }]
      )
    }
  }

  return (
    <Modal
      visible={visible}
      presentationStyle='overFullScreen'
      transparent={true}
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
                        style={{ position: 'absolute', bottom: 10, right: 20 }}
                      />
                    </>
                  ) : (
                    <CameraIcon size={34} style={{ position: 'absolute' }} />
                  )}
                </View>

                {/* Upload actions modal */}
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
                    <TextBase style={{ marginLeft: 5 }}>Select Photo</TextBase>
                  </Pressable>
                  <Pressable
                    style={styles.uploadAction}
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
    backgroundColor: theme.colors.transparentBlack,
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
    overflow: 'hidden',
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
