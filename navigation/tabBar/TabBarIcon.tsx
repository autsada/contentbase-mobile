import { Image, View, StyleSheet } from 'react-native'
import { SimpleLineIcons, Ionicons } from '@expo/vector-icons'

import { useAuth } from '../../store/hooks/useAuth'
import { useRoutes } from '../../store/hooks/useRoutes'
import { theme } from '../../styles/theme'
import type { MainTabScreenProps } from '../MainTab'
import type { MainStackParamList } from '../MainStack'

export const stackRoutes: (keyof MainStackParamList)[] = [
  'Videos',
  'Posts',
  'Following',
  'Bookmarks',
]

interface Props
  extends MainTabScreenProps<
    'Home' | 'Collections' | 'Upload' | 'Wallet' | 'Profile' | 'MainStack'
  > {
  focused: boolean
  color: string
  size: number
}

export default function TabBarIcon({ route, focused }: Props) {
  const name = route.name

  const { isAuthenticated, loggedInProfile } = useAuth()
  const { currentRoute, previousRoute } = useRoutes()
  const isDrawerOpened = stackRoutes.includes(currentRoute as any)

  switch (name) {
    case 'Home':
      return (
        <SimpleLineIcons
          name='home'
          size={24}
          color={
            focused || (isDrawerOpened && name === previousRoute)
              ? theme.colors.black
              : theme.colors.gray
          }
        />
      )

    case 'Collections':
      return (
        <Ionicons
          name='layers-outline'
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
          size={24}
          color={
            focused || (isDrawerOpened && name === previousRoute)
              ? theme.colors.black
              : theme.colors.gray
          }
        />
      )

    case 'Profile':
      return isAuthenticated ? (
        !!loggedInProfile && loggedInProfile.imageURI ? (
          <View
            style={[
              styles.avatarContainer,
              {
                opacity:
                  focused || (isDrawerOpened && name === previousRoute)
                    ? 1
                    : 0.6,
              },
            ]}
          >
            <Image
              source={{ uri: loggedInProfile.imageURI }}
              style={styles.avatar}
            />
          </View>
        ) : (
          <View style={styles.avatarContainer}>
            <Ionicons
              name={'person-circle-sharp'}
              size={30}
              color={
                focused || (isDrawerOpened && name === previousRoute)
                  ? theme.colors.black
                  : theme.colors.lightGray
              }
            />
          </View>
        )
      ) : (
        <Ionicons
          name={'ios-person-outline'}
          size={24}
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

const styles = StyleSheet.create({
  avatarContainer: {
    width: 35,
    height: 35,
    borderRadius: 999,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  avatar: {
    width: 25,
    height: 25,
    resizeMode: 'cover',
  },
})
