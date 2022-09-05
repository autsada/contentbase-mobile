import { useState, useEffect } from 'react'
import { View, StyleSheet, Modal, Alert, SafeAreaView } from 'react-native'
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field'
import auth from '@react-native-firebase/auth'

import type { AuthStackScreenProps } from './AuthStack'
import SafeAreaContainer from '../../components/shared/SafeAreaContainer'
import CustomKeyboardAvoidingView from '../../components/shared/CustomKeyboardAvoidingView'
import { TextHeader5, TextLight, TextBase } from '../../components/shared/Texts'
import RegularButton from '../../components/shared/RegularButton'
import CreateProfile from '../../components/profile/CreateProfileModal'
import { useAuthStackContext } from './auth-stack-context'
import { useAppOverlay } from '../../store/hooks/useOverlay'
import { theme } from '../../styles/theme'

interface Props extends AuthStackScreenProps<'ConfirmCode'> {}

const CELL_COUNT = 6

export default function ConfirmCodeScreen({ navigation }: Props) {
  const [code, setCode] = useState('')
  const [showCreateProfileModal, setShowCreateProfileModal] = useState(true)

  const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT })
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  })

  const { phoneNumber, isPhoneValid, confirmation, setConfirmation } =
    useAuthStackContext()
  const { applyOverlay } = useAppOverlay()

  // Calling confirm code as soon as user enters all code
  useEffect(() => {
    if (!code) return

    if (code.length === 6) {
      confirmCode()
    }
  }, [code])

  /** This is the second step */
  async function confirmCode() {
    try {
      if (!code || !confirmation) return

      applyOverlay(true)
      const credentials = await confirmation.confirm(code)

      applyOverlay(false)

      if (credentials.additionalUserInfo?.isNewUser) {
        // If this is the first time user signs in, we will ask them to provide their handle (username) to create their first NFT profile
      } else {
        // Otherwise call the server to get user's profile
      }

      // Send a request the server to check if user is a new user
      // const body: CheckUserArgsType = {
      //   signInMethod: 'Phone',
      //   uid: credentials.user?.uid,
      // }
      // const res = await axios.get(
      //   `${Constants.manifest?.extra?.serverURI}/user/checkUser`,
      //   {
      //     data: body,
      //   }
      // )

      // console.log('res -->', res)
    } catch (error) {
      applyOverlay(false)
      Alert.alert('Invalid Code')
    }
  }

  /** This is the first step */
  async function resendCode() {
    try {
      if (!phoneNumber) return
      setCode('')
      applyOverlay(true)
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber)
      setConfirmation(confirmation)
      applyOverlay(false)
    } catch (error) {
      applyOverlay(false)
      Alert.alert('', 'Something not right, please try again.')
    }
  }

  return (
    <SafeAreaContainer>
      <CustomKeyboardAvoidingView>
        <View style={styles.container}>
          <TextHeader5 style={styles.header}>
            Enter the Verifcation Code
          </TextHeader5>
          <TextLight style={styles.description}>
            You should receive the code via SMS
          </TextLight>

          <View style={styles.code}>
            <CodeField
              ref={ref}
              {...props}
              value={code}
              onChangeText={setCode}
              cellCount={CELL_COUNT}
              rootStyle={{ marginTop: 10 }}
              keyboardType='number-pad'
              textContentType='oneTimeCode'
              renderCell={({ index, symbol, isFocused }) => (
                <View
                  key={index}
                  style={[styles.cell, isFocused && styles.focusCell]}
                  onLayout={getCellOnLayoutHandler(index)}
                >
                  <TextBase style={styles.cellText}>
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </TextBase>
                </View>
              )}
            />
            <View style={styles.resend}>
              <TextLight style={{ color: theme.colors.gray }}>
                Don't receive the code?
              </TextLight>
              <RegularButton
                title='Resend'
                disabled={!isPhoneValid}
                containerStyle={{ marginLeft: 10 }}
                titleStyle={{ color: theme.colors.warning }}
                onPress={resendCode}
              />
            </View>
          </View>

          <RegularButton
            title='VERIFY'
            disabled={!code}
            containerStyle={styles.button}
            titleStyle={styles.buttonText}
            onPress={confirmCode}
          />
        </View>
      </CustomKeyboardAvoidingView>

      {/* <CreateProfile visible={showCreateProfileModal} /> */}
    </SafeAreaContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: theme.fontSize.base,
  },
  description: {
    color: theme.colors.gray,
    marginTop: 10,
  },
  code: {
    marginVertical: 40,
  },
  cell: {
    width: 50,
    height: 50,
    borderRadius: theme.radius.base,
    borderWidth: 2,
    borderColor: theme.colors.veryLightGray,
    textAlign: 'center',
    marginHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusCell: {
    borderColor: theme.colors.gray,
  },
  cellText: {
    lineHeight: 38,
    fontSize: 24,
    color: theme.colors.darkBlue,
  },
  resend: {
    marginTop: 10,
    paddingVertical: 10,
    flexDirection: 'row',
  },
  button: {
    backgroundColor: theme.colors.yellow,
    width: '100%',
    height: 50,
    borderRadius: theme.radius.base,
  },
  buttonText: {
    fontSize: theme.fontSize.md,
    letterSpacing: theme.spacing.default,
  },
})
