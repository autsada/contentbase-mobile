import type { CompositeScreenProps } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import type { DrawerScreenProps } from '@react-navigation/drawer'

import type { AppDrawerParamList } from '.'
import type { AppStackParamList } from './AppStack'
import type { MainTabParamList, MainTabScreenProps } from './MainTab'
import ProfilesScreen from '../screens/ProfilesScreen'
import CollectionsScreen from '../screens/CollectionsScreen'
import LikesScreen from '../screens/LikesScreen'
import BookmarksScreen from '../screens/BookmarksScreen'
import { useRoutes } from '../store/hooks/useRoutes'

export type MainStackParamList = {
  Profiles: undefined
  Collections: undefined
  Likes: undefined
  Bookmarks: undefined
}

export type MainStackScreenProps<T extends keyof MainStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<MainStackParamList, T, 'MainStack'>,
    CompositeScreenProps<
      BottomTabScreenProps<MainTabParamList>,
      CompositeScreenProps<
        NativeStackScreenProps<AppStackParamList>,
        DrawerScreenProps<AppDrawerParamList>
      >
    >
  >

interface Props extends MainTabScreenProps<'MainStack'> {}

const Stack = createNativeStackNavigator<MainStackParamList>()

export default function MainStack({}: Props) {
  const { setActiveRoute, setPreviousActiveRoute } = useRoutes()

  return (
    <Stack.Navigator
      id='MainStack'
      screenOptions={() => ({
        headerShown: false,
      })}
      screenListeners={({ route }) => ({
        focus: () => {
          setActiveRoute(route.name)
        },
        blur: () => {
          setPreviousActiveRoute(route.name)
        },
      })}
    >
      <Stack.Screen name='Profiles' component={ProfilesScreen} />
      <Stack.Screen name='Collections' component={CollectionsScreen} />
      <Stack.Screen name='Likes' component={LikesScreen} />
      <Stack.Screen name='Bookmarks' component={BookmarksScreen} />
    </Stack.Navigator>
  )
}
