import { useState, useEffect } from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field'
import auth from '@react-native-firebase/auth'

import SafeAreaContainer from '../../components/shared/SafeAreaContainer'
import CustomKeyboardAvoidingView from '../../components/shared/CustomKeyboardAvoidingView'
import { TextHeader5, TextLight, TextBase } from '../../components/shared/Texts'
import RegularButton from '../../components/shared/RegularButton'
import CreateProfileModal from '../../components/profile/CreateProfileModal'
import { useAuthStackContext } from './auth-stack-context'
import { useAppOverlay } from '../../store/hooks/useOverlay'
import { useAuth } from '../../store/hooks/useAuth'
import { checkProfileExist } from '../../utils/helpers'
import { theme } from '../../styles/theme'
import type { AuthStackScreenProps } from './AuthStack'
import type { AppStackScreenProps } from '../../navigation/AppStack'

interface Props extends AuthStackScreenProps<'ConfirmCode'> {}

const CELL_COUNT = 6

export default function ConfirmCodeScreen({ navigation }: Props) {
  const [code, setCode] = useState('')
  const [showCreateProfileModal, setShowCreateProfileModal] = useState(false)

  const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT })
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  })

  const { isAuthenticated, account } = useAuth()
  const hasProfile = checkProfileExist(account)
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

  // When user is authenticatated
  useEffect(() => {
    if (isAuthenticated) {
      if (!hasProfile) {
        // If they don't have any profile yet, show create profile modal
        setShowCreateProfileModal(true)
      } else {
        // Otherwise pop the screen out
        navigation.popToTop()
      }
    }
  }, [isAuthenticated, hasProfile, navigation])

  /** This is the second step */
  async function confirmCode() {
    try {
      if (!code || !confirmation) return

      applyOverlay(true)
      const credentials = await confirmation.confirm(code)

      applyOverlay(false)
    } catch (error) {
      applyOverlay(false)
      Alert.alert('Invalid Code')
    }
  }

  /** To resend code */
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

  /** Function to close create profile modal */
  function closeCreateProfileModal() {
    const appStackNavigator = navigation?.getParent() as AppStackScreenProps<
      'AuthStack' | 'MainTab'
    >['navigation']

    if (showCreateProfileModal) setShowCreateProfileModal(false)
    if (appStackNavigator) {
      if (!hasProfile) {
        // No profile created yet, bring user to home
        appStackNavigator.navigate('MainTab', {
          screen: 'Home',
        })
      } else {
        // Just go back to previous screen
        navigation.goBack()
      }
    }
  }

  return (
    <SafeAreaContainer>
      <CustomKeyboardAvoidingView>
        <View style={styles.container}>
          {isAuthenticated ? (
            <TextHeader5 style={styles.header}>
              You are now logged in
            </TextHeader5>
          ) : (
            <>
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
            </>
          )}
        </View>
      </CustomKeyboardAvoidingView>

      <CreateProfileModal
        navigation={navigation.getParent()}
        visible={showCreateProfileModal}
        closeModal={closeCreateProfileModal}
        title={`Let's create your first profile`}
      />
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
