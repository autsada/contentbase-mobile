import {
  SimpleLineIcons,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'

import { useRoutes } from '../../store/hooks/useRoutes'
import { theme } from '../../styles/theme'
import type { MainTabScreenProps } from '../MainTab'
import type { MainStackParamList } from '../MainStack'

export const stackRoutes: (keyof MainStackParamList)[] = [
  'Profiles',
  'Collections',
  'Bookmarks',
  'Likes',
]

interface Props
  extends MainTabScreenProps<
    'Home' | 'Posts' | 'Upload' | 'Wallet' | 'Notifications' | 'MainStack'
  > {
  focused: boolean
  color: string
  size: number
}

export default function TabBarIcon({ route, focused }: Props) {
  const name = route.name

  const { currentRoute, previousRoute } = useRoutes()
  const isDrawerOpened = stackRoutes.includes(currentRoute as any)

  switch (name) {
    case 'Home':
      return (
        <SimpleLineIcons
          name='home'
          size={26}
          color={
            focused || (isDrawerOpened && name === previousRoute)
              ? theme.colors.black
              : theme.colors.gray
          }
        />
      )

    case 'Posts':
      return (
        <MaterialCommunityIcons
          name='post-outline'
          size={26}
          color={
            focused || (isDrawerOpened && name === previousRoute)
              ? theme.colors.black
              : theme.colors.gray
          }
        />
      )

    case 'Upload':
      return <Ionicons name='add-circle' size={50} color={theme.colors.blue} />

    case 'Wallet':
      return (
        <SimpleLineIcons
          name='wallet'
          size={22}
          color={
            focused || (isDrawerOpened && name === previousRoute)
              ? theme.colors.black
              : theme.colors.gray
          }
        />
      )

    case 'Notifications':
      return (
        <Ionicons
          name={'notifications-outline'}
          size={30}
          color={
            focused || (isDrawerOpened && name === previousRoute)
              ? theme.colors.black
              : theme.colors.gray
          }
        />
      )

    default:
      return null
  }
}
