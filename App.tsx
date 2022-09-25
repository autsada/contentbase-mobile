import 'react-native-gesture-handler'
import { useLayoutEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import {
  useFonts,
  Rubik_300Light,
  Rubik_300Light_Italic,
  Rubik_400Regular,
  Rubik_400Regular_Italic,
  Rubik_500Medium,
  Rubik_600SemiBold,
  Rubik_800ExtraBold,
  // Rubik_900Black,
} from '@expo-google-fonts/rubik'
import * as SplashScreen from 'expo-splash-screen'
import { Provider } from 'react-redux'

import MainNavigation from './navigation'
import Backdrop from './components/shared/Backdrop'
import { store } from './store'
import { useAppOverlay } from './store/hooks'
import './graphql/client'

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

function AppOverlay() {
  const { isAppBackdropOpened } = useAppOverlay()

  if (!isAppBackdropOpened) return null

  return <Backdrop />
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Rubik_300Light,
    Rubik_300Light_Italic,
    Rubik_400Regular,
    Rubik_400Regular_Italic,
    Rubik_500Medium,
    Rubik_600SemiBold,
    Rubik_800ExtraBold,
    // Rubik_900Black,
  })

  useLayoutEffect(() => {
    const hideSplash = async () => {
      if (fontsLoaded) {
        await SplashScreen.hideAsync()
      }
    }

    hideSplash()
  }, [fontsLoaded])

  if (!fontsLoaded) return null

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <MainNavigation />
        <StatusBar style='auto' />
      </SafeAreaProvider>
      <AppOverlay />
    </Provider>
  )
}
