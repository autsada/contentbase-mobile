import React, { useEffect } from 'react'
import { View, StyleSheet, Platform, Pressable, Image } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import {
  FontAwesome,
  Ionicons,
  Fontisto,
  SimpleLineIcons,
} from '@expo/vector-icons'

import SafeAreaContainer from '../../components/shared/SafeAreaContainer'
import CloseButton from '../../components/shared/CloseButton'
import RegularButton from '../../components/shared/RegularButton'
import { TextHeader3, TextLight } from '../../components/shared/Texts'
import type { AuthStackScreenProps } from './AuthStack'
import { useAuth } from '../../store/hooks/useAuth'
import { theme } from '../../styles/theme'
import { generateBoxShadow } from '../../utils/helpers'

interface Props extends AuthStackScreenProps<'Auth'> {}

const OS = Platform.OS
const buttonShadow = generateBoxShadow({
  OS,
  xOffset: 2,
  yOffset: 2,
  shadowColor: theme.colors.gray,
  shadowRadius: 2,
  elevation: 3,
  shadowOpacity: 0.2,
})

export default function AuthModalScreen({ navigation, route }: Props) {
  const { isAuthenticated } = useAuth()
  const params = route.params

  const isFoucused = useIsFocused()

  // When user is authenticatated and the screen is focused, pop the screen out
  useEffect(() => {
    if (isAuthenticated && isFoucused) {
      navigation.pop()
    }
  }, [isAuthenticated, navigation, isFoucused])

  function closeModal() {
    if (!isAuthenticated) {
      navigation.navigate('MainTab', {
        screen: 'Home',
      })
    } else {
      navigation.pop()
    }
  }

  function openPhoneSignIn() {
    navigation.push('Phone')
  }

  function openEmailSignIn() {
    navigation.push('Email')
  }

  return (
    <SafeAreaContainer containerStyle={styles.container}>
      <Pressable style={styles.close} onPress={closeModal}>
        <CloseButton size={30} />
      </Pressable>
      <View style={styles.content}>
        <View style={styles.brandContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
            />
          </View>
          <TextHeader3
            style={{
              letterSpacing: theme.spacing.xxs,
            }}
          >
            CONTENT BASE
          </TextHeader3>
        </View>

        <View style={styles.actions}>
          <TextLight style={styles.actionHead}>{params.title}</TextLight>
          <RegularButton
            title='Sign in with Phone'
            titleStyle={{ ...styles.buttonText, color: 'white' }}
            titleContainerStyle={styles.buttonTextContainer}
            containerStyle={{
              ...styles.button,
              backgroundColor: theme.colors.darkBlue,
              ...buttonShadow,
            }}
            icon={() => (
              <View style={styles.buttonIcon}>
                <FontAwesome name='mobile-phone' size={28} color='white' />
              </View>
            )}
            onPress={openPhoneSignIn}
          />
          <RegularButton
            title='Sign in with Email'
            titleStyle={styles.buttonText}
            titleContainerStyle={styles.buttonTextContainer}
            containerStyle={{
              ...styles.button,
              backgroundColor: theme.colors.lightBlue,
              ...buttonShadow,
            }}
            icon={() => (
              <View style={styles.buttonIcon}>
                <Fontisto name='email' size={20} color='black' />
              </View>
            )}
            onPress={openEmailSignIn}
          />
          <RegularButton
            title='Sign in with Google'
            titleStyle={{
              ...styles.buttonText,
              color: theme.colors.darkBlue,
            }}
            titleContainerStyle={styles.buttonTextContainer}
            containerStyle={{
              ...styles.button,
              backgroundColor: theme.colors.white,
              ...buttonShadow,
            }}
            icon={() => (
              <View style={styles.buttonIcon}>
                <Ionicons name='logo-google' size={22} color='red' />
              </View>
            )}
          />
          <View style={styles.divider}>
            <View style={styles.line}></View>
            <View style={styles.text}>
              <TextLight
                style={{
                  backgroundColor: theme.colors.transparentYellow,
                  paddingHorizontal: 5,
                  color: theme.colors.gray,
                }}
              >
                Or
              </TextLight>
            </View>
          </View>
          <RegularButton
            title='Connect with Wallet'
            titleStyle={styles.buttonText}
            titleContainerStyle={styles.buttonTextContainer}
            containerStyle={[
              styles.button,
              { backgroundColor: theme.colors.yellow },
              buttonShadow,
            ]}
            icon={() => (
              <View style={styles.buttonIcon}>
                <SimpleLineIcons
                  name='wallet'
                  size={18}
                  color={theme.colors.black}
                />
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.transparentYellow,
  },
  close: {
    padding: 10,
    alignSelf: 'flex-end',
    marginTop: OS === 'android' ? 40 : 10,
    marginRight: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  brandContainer: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 130,
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 10,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  actions: {
    marginTop: 40,
  },
  actionHead: {
    marginBottom: 20,
    color: theme.colors.gray,
    alignSelf: 'center',
  },
  button: {
    height: 50,
    width: 280,
    borderRadius: 40,
    marginBottom: 20,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
  },
  buttonTextContainer: {
    alignItems: 'center',
    flexGrow: 1,
  },
  buttonText: {
    fontSize: theme.fontSize.md,
  },
  buttonIcon: {
    width: 50,
    alignItems: 'center',
  },
  divider: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  line: {
    height: 1,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
    opacity: 0.3,
  },
  text: {
    position: 'absolute',
    backgroundColor: theme.colors.transparentYellow,
    // width: '50%',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
})
