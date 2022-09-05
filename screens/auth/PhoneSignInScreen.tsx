import { useState, useEffect } from 'react'
import { View, StyleSheet, TextInput, Pressable, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as Localization from 'expo-localization'
import {
  getCountryCallingCode,
  CountryCode,
  isValidPhoneNumber,
} from 'libphonenumber-js/mobile'
import auth from '@react-native-firebase/auth'
import axios from 'axios'
import Constants from 'expo-constants'

import type { AuthStackScreenProps } from './AuthStack'
import SafeAreaContainer from '../../components/shared/SafeAreaContainer'
import CustomKeyboardAvoidingView from '../../components/shared/CustomKeyboardAvoidingView'
import {
  TextHeader5,
  TextBase,
  TextLight,
  TextBaseItalic,
} from '../../components/shared/Texts'
import RegularButton from '../../components/shared/RegularButton'
import { useAuthStackContext } from './auth-stack-context'
import { useAppOverlay } from '../../store/hooks/useOverlay'
import { theme } from '../../styles/theme'

interface Props extends AuthStackScreenProps<'Phone'> {}

// Get region of the device (country code)
const region = Localization.region as CountryCode

export default function PhoneSignInScreen({ navigation, route }: Props) {
  const [text, setText] = useState('')
  // const [isNumberValid, setIsNumberValid] = useState(false)

  const {
    phoneNumber,
    setPhoneNumber,
    isPhoneValid,
    setIsPhoneValid,
    callingCode,
    setCallingCode,
    countryCode,
    setCountryCode,
    setConfirmation,
  } = useAuthStackContext()
  const { applyOverlay } = useAppOverlay()

  // Get calling code from the default region
  useEffect(() => {
    if (!region) {
      setCallingCode('1')
      setCountryCode('US')
    } else {
      const callingCode = getCountryCallingCode(region)
      setCallingCode(callingCode)
      setCountryCode(region)
    }
  }, [region])

  // Validate phone number
  useEffect(() => {
    const num = `+${callingCode}${text}`
    const isValid = isValidPhoneNumber(num)
    setIsPhoneValid(isValid)
    if (isValid) {
      setPhoneNumber(num)
    } else {
      setPhoneNumber('')
    }
  }, [text, callingCode, countryCode])

  function openCountryPicker() {
    navigation.navigate('CountryPicker')
  }

  function onNumberChange(text: string) {
    if (!callingCode) return

    setText(text)
  }

  /**
   * @dev There are 2 steps to verify the phone number.
   * @dev 1. Send user a verification code after they have given a valid number and clicked Next. Use signInWithPhoneNumber here.
   * @dev 2. Verify if the code that user entered is correct.
   */

  /** This is the first step */
  async function onGetCode() {
    try {
      if (!phoneNumber) return

      applyOverlay(true)
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber)

      setConfirmation(confirmation)
      applyOverlay(false)
      navigation.navigate('ConfirmCode')
    } catch (error) {
      console.log('error 1 -->', error)
      applyOverlay(false)
      Alert.alert('', 'Something not right, please try again.')
    }
  }

  return (
    <SafeAreaContainer>
      <CustomKeyboardAvoidingView>
        <View style={styles.form}>
          {/* <View style={styles.icon}>
            <Ionicons
              name='phone-portrait'
              size={100}
              color={theme.colors.secondaryText}
            />
          </View> */}

          <TextHeader5 style={styles.header}>
            Enter your Phone Number
          </TextHeader5>
          <TextLight style={styles.description}>
            We will send you the 6-digit verification code
          </TextLight>

          {/* Phone number input */}
          <View style={styles.inputContainer}>
            <Pressable
              onPress={openCountryPicker}
              style={styles.countryContainer}
            >
              <View style={styles.cca2Container}>
                <TextBase style={[styles.inputText]}>
                  {countryCode || ''}
                </TextBase>
              </View>
              <View style={styles.caret}>
                <Ionicons
                  name='ios-caret-down'
                  size={20}
                  color={theme.colors.gray}
                />
              </View>
            </Pressable>
            <View style={styles.numberContainer}>
              <TextBase style={styles.inputText}>+{callingCode}</TextBase>
              <View style={styles.number}>
                <TextInput
                  keyboardType='phone-pad'
                  onChangeText={onNumberChange}
                  style={[styles.inputText, { marginLeft: 8 }]}
                  value={text}
                  maxLength={20}
                />
              </View>
              {!!text && (
                <TextBaseItalic
                  style={[
                    styles.validate,
                    {
                      color: isPhoneValid
                        ? theme.colors.approve
                        : theme.colors.error,
                    },
                  ]}
                >
                  {isPhoneValid ? 'valid' : 'invalid'}
                </TextBaseItalic>
              )}
            </View>
          </View>

          <RegularButton
            title='GET CODE'
            disabled={!isPhoneValid}
            containerStyle={styles.button}
            titleStyle={styles.buttonText}
            onPress={onGetCode}
          />
        </View>
      </CustomKeyboardAvoidingView>
    </SafeAreaContainer>
  )
}

const styles = StyleSheet.create({
  form: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  icon: {
    height: 200,
    width: 200,
    borderRadius: 999,
    backgroundColor: theme.colors.lightBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  header: {
    fontSize: theme.fontSize.base,
  },
  description: {
    color: theme.colors.gray,
    marginTop: 10,
  },
  inputContainer: {
    marginVertical: 30,
    width: '100%',
    height: 60,
    borderRadius: theme.radius.base,
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
    flexDirection: 'row',
  },
  countryContainer: {
    width: 80,
    borderRightWidth: 1,
    borderRightColor: theme.colors.veryLightGray,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cca2Container: {
    flexGrow: 1,
    height: '100%',
    alignItems: 'flex-end',
    paddingRight: 6,
    justifyContent: 'center',
  },
  inputText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.darkBlue,
  },
  caret: {
    width: 24,
    height: '100%',
    justifyContent: 'center',
  },
  numberContainer: {
    flexGrow: 1,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  number: {
    flexGrow: 1,
  },
  validate: {
    position: 'absolute',
    right: 3,
    bottom: 0,
    fontSize: theme.fontSize.sm,
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
