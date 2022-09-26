import { StyleSheet, Pressable, Platform, Image, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useDrawerStatus } from '@react-navigation/drawer'

import CloseIcon from '../../components/icons/CloseIcon'
import { theme } from '../../styles/theme'
import { useAuth } from '../../store/hooks'
import type { AppDrawerScreenProps } from '..'
import type { MainTabScreenProps } from '../MainTab'
import BackButton from './../../components/shared/BackButton'

interface Props {
  navigation: MainTabScreenProps<
    'Home' | 'Posts' | 'Upload' | 'Wallet' | 'Notifications' | 'MainStack'
  >['navigation']
}

const OS = Platform.OS

export default function HeaderLeft({ navigation }: Props) {
  const drawerNavigator = navigation.getParent(
    'MainDrawer' as any
  ) as AppDrawerScreenProps<'AppStack'>['navigation']

  const { isAuthenticated, loggedInProfile } = useAuth()
  const status = useDrawerStatus()

  function openAuthStack() {
    const appStackNavigator = navigation.getParent('AppStack' as any)

    if (appStackNavigator) {
      appStackNavigator.navigate('AuthStack', {
        screen: 'Auth',
        params: { title: 'Sign in required' },
      })
    }
  }

  // If user is authenticated show their profile image or default image
  if (isAuthenticated)
    return (
      <Pressable
        style={styles.container}
        onPress={() => drawerNavigator.toggleDrawer()}
      >
        {/* Use image url from cloud storage - imageURL2 */}
        {loggedInProfile && loggedInProfile.imageURI2 ? (
          <Image
            source={{ uri: loggedInProfile.imageURI2 }}
            style={styles.avatar}
          />
        ) : (
          <Ionicons
            name='person-circle-sharp'
            size={40}
            color={theme.colors.black}
          />
        )}

        {status !== 'closed' && OS === 'ios' && (
          <View style={styles.close}>
            <CloseIcon size={35} />
          </View>
        )}
      </Pressable>
    )

  // If not authentication show menu icon which will open auth modal on clicked
  return (
    <Pressable style={styles.container} onPress={openAuthStack}>
      <Ionicons name='menu-outline' size={35} color={theme.colors.black} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
    resizeMode: 'contain',
  },
  close: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  profile: {
    width: 40,
    height: 40,
    borderRadius: 999,
    resizeMode: 'cover',
  },
})
