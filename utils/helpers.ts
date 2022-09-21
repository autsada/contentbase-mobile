import { Platform, ColorValue } from 'react-native'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import * as NavigationBar from 'expo-navigation-bar'

import type { MainStackScreenProps } from '../navigation/MainStack'
import type { AuthStackScreenProps } from '../screens/auth/AuthStack'
import { NexusGenObjects } from '../gentypes/typegen'

export function getMainStackHeaderTitle(
  route: MainStackScreenProps<
    'Profiles' | 'Collections' | 'Bookmarks' | 'Likes'
  >['route']
) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Videos'

  return routeName
}

export function getAuthStackHeaderTitle(
  route: AuthStackScreenProps<
    'Auth' | 'CountryPicker' | 'Phone' | 'ConfirmCode' | 'Email'
  >['route']
) {
  switch (route.name) {
    case 'Phone':
      return 'Sign in with Phone 1/2'

    case 'ConfirmCode':
      return 'Sign in with Phone 2/2'

    case 'Email':
      return 'Sign in with Email'

    case 'CountryPicker':
      return 'Select Country'

    default:
      return null
  }
}

type ShowdowConfig = {
  OS: typeof Platform.OS
  xOffset: number
  yOffset: number
  shadowColor: ColorValue
  shadowOpacity: number
  shadowRadius: number
  elevation: number
}
export function generateBoxShadow({
  OS,
  xOffset,
  yOffset,
  shadowColor,
  shadowOpacity,
  shadowRadius,
  elevation,
}: ShowdowConfig) {
  if (OS === 'ios') {
    return {
      shadowOpacity,
      shadowRadius,
      shadowOffset: {
        width: xOffset,
        height: yOffset,
      },
      shadowColor,
    }
  }

  if (OS === 'android') {
    return {
      elevation,
      shadowColor,
    }
  }

  return {
    shadowOpacity,
    shadowRadius,
    shadowOffset: {
      width: xOffset,
      height: yOffset,
    },
    shadowColor,
    elevation,
  }
}

export async function getBottomBarColor(
  color: ColorValue,
  style: NavigationBar.NavigationBarButtonStyle
) {
  try {
    await NavigationBar.setBackgroundColorAsync(color)
    await NavigationBar.setButtonStyleAsync(style)
  } catch (error) {}
}

export function checkProfileExist(account: NexusGenObjects['Account']) {
  if (!account || !account.profiles) return false

  return account.profiles.length > 0
}
