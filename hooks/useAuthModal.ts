import { useEffect } from 'react'

import type { MainTabScreenProps } from '../navigation/MainTab'
import type { AppStackScreenProps } from '../navigation/AppStack'

export function useAuthModal(
  isAuthenticated: boolean,
  navigation: MainTabScreenProps<
    'Home' | 'Posts' | 'Upload' | 'Notifications' | 'Wallet' | 'MainStack'
  >['navigation'],
  screenFocused: boolean,
  title: string
) {
  useEffect(() => {
    if (screenFocused && !isAuthenticated) {
      const appStackNavigator = navigation.getParent() as AppStackScreenProps<
        'AuthStack' | 'MainTab'
      >['navigation']
      if (appStackNavigator) {
        appStackNavigator.navigate('AuthStack', {
          screen: 'Auth',
          params: { title },
        })
      }
    }
  }, [screenFocused, isAuthenticated, navigation])

  return null
}
