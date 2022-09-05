import type { CompositeScreenProps } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import type { DrawerScreenProps } from '@react-navigation/drawer'

import type { AppDrawerParamList } from '.'
import type { AppStackParamList } from './AppStack'
import type { MainTabParamList, MainTabScreenProps } from './MainTab'
import VideosScreen from '../screens/VideosScreen'
import PostsScreen from '../screens/PostsScreen'
import FollowingScreen from '../screens/FollowingScreen'
import BookmarksScreen from '../screens/BookmarksScreen'
import { useRoutes } from '../store/hooks/useRoutes'

export type MainStackParamList = {
  Videos: undefined
  Posts: undefined
  Following: undefined
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
      <Stack.Screen name='Videos' component={VideosScreen} />
      <Stack.Screen name='Posts' component={PostsScreen} />
      <Stack.Screen name='Following' component={FollowingScreen} />
      <Stack.Screen name='Bookmarks' component={BookmarksScreen} />
    </Stack.Navigator>
  )
}
