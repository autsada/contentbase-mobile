import type {
  NavigatorScreenParams,
  CompositeScreenProps,
} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { DrawerScreenProps } from '@react-navigation/drawer'

import MainTab from './MainTab'
import AuthStack from '../screens/auth/AuthStack'
import { useRoutes } from '../store/hooks/useRoutes'
import type { AppDrawerParamList } from './index'
import type { MainTabParamList } from './MainTab'
import type { AuthStackParamList } from '../screens/auth/AuthStack'

export type AppStackParamList = {
  MainTab: NavigatorScreenParams<MainTabParamList>
  AuthStack: NavigatorScreenParams<AuthStackParamList>
}

export type AppStackScreenProps<T extends keyof AppStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<AppStackParamList, T, 'AppStack'>,
    DrawerScreenProps<AppDrawerParamList>
  >

interface Props {}

const Stack = createNativeStackNavigator<AppStackParamList>()

export default function AppStack({}: Props) {
  const { setActiveRoute, setPreviousActiveRoute } = useRoutes()

  return (
    <Stack.Navigator
      id='AppStack'
      screenListeners={({ route }) => ({
        focus: () => {
          setActiveRoute(route.name)
        },
        blur: () => {
          setPreviousActiveRoute(route.name)
        },
      })}
    >
      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen name='MainTab' component={MainTab} />
      </Stack.Group>

      <Stack.Group
        screenOptions={{
          presentation: 'transparentModal',
          headerShown: false,
        }}
      >
        <Stack.Screen name='AuthStack' component={AuthStack} />
      </Stack.Group>
    </Stack.Navigator>
  )
}
