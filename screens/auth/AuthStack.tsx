import React from 'react'
import { useWindowDimensions, StyleSheet, Platform } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { CompositeScreenProps } from '@react-navigation/native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { DrawerScreenProps } from '@react-navigation/drawer'
import type { CountryCode } from 'libphonenumber-js/mobile'

import type { AppStackParamList } from '../../navigation/AppStack'
import type { AppDrawerParamList } from '../../navigation/index'
import type { AppStackScreenProps } from '../../navigation/AppStack'
import AuthStackContextProvider from './auth-stack-context'
import AuthStackHeaderLeft from '../../navigation/headers/AuthStackHeaderLeft'
import { TextHeader5 } from '../../components/shared/Texts'
import AuthModalScreen from './AuthModalScreen'
import PhoneSignInScreen from './PhoneSignInScreen'
import EmailSignInScreen from './EmailSignInScreen'
import CountryPickerScreen from './CountryPickerScreen'
import ConfirmCodeScreen from './ConfirmCodeScreen'
import Overlay from '../../components/shared/Overlay'
import { useAppOverlay } from '../../store/hooks/useOverlay'
import { getAuthStackHeaderTitle } from '../../utils/helpers'
import { theme } from '../../styles/theme'

export type AuthStackParamList = {
  Auth: { title: string }
  Phone: { countryCode: CountryCode | string; callingCode: string }
  Email: undefined
  CountryPicker: undefined
  ConfirmCode: undefined
}

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, T, 'AuthStack'>,
    CompositeScreenProps<
      NativeStackScreenProps<
        AppStackParamList,
        keyof AppStackParamList,
        'AppStack'
      >,
      DrawerScreenProps<
        AppDrawerParamList,
        keyof AppDrawerParamList,
        'AppDrawer'
      >
    >
  >

interface Props extends AppStackScreenProps<'AuthStack'> {}

const Stack = createNativeStackNavigator<AuthStackParamList>()
const OS = Platform.OS

export default function AuthStack({}: Props) {
  const { height, width } = useWindowDimensions()
  const { isOverlayOpened } = useAppOverlay()

  return (
    <AuthStackContextProvider>
      <Stack.Navigator
        id='AuthStack'
        initialRouteName='Auth'
        screenOptions={{ orientation: 'portrait' }}
      >
        <Stack.Group>
          <Stack.Screen
            name='Auth'
            component={AuthModalScreen}
            options={{
              presentation: 'transparentModal',
              headerShown: false,
            }}
          />
        </Stack.Group>

        <Stack.Group
          screenOptions={(
            props: AuthStackScreenProps<
              'Auth' | 'Phone' | 'Email' | 'CountryPicker'
            >
          ) => ({
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: theme.colors.white,
              height: OS === 'web' ? 60 : height > width ? 100 : 60,
            },
            headerTitleContainerStyle: {
              alignSelf: OS === 'web' ? 'center' : undefined,
            },
            headerLeft: () => <AuthStackHeaderLeft {...props} />,
            headerTitle: () => (
              <TextHeader5 style={styles.header}>
                {getAuthStackHeaderTitle(props.route)}
              </TextHeader5>
            ),
            headerBackVisible: false,
            presentation: 'card',
            animation: 'slide_from_right',
          })}
        >
          <Stack.Screen
            name='Phone'
            component={PhoneSignInScreen}
            initialParams={{
              callingCode: '',
              countryCode: '',
            }}
          />
          <Stack.Screen name='Email' component={EmailSignInScreen} />
          <Stack.Screen name='CountryPicker' component={CountryPickerScreen} />
          <Stack.Screen name='ConfirmCode' component={ConfirmCodeScreen} />
        </Stack.Group>
      </Stack.Navigator>
      {isOverlayOpened && <Overlay backgroundOpacity={0.8} />}
    </AuthStackContextProvider>
  )
}

const styles = StyleSheet.create({
  header: {
    color: theme.colors.darkBlue,
    fontSize: theme.fontSize.md,
  },
})
