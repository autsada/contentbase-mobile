import { StyleSheet, Pressable, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useDrawerStatus } from '@react-navigation/drawer'

import CloseIcon from '../../components/icons/CloseIcon'
import { theme } from '../../styles/theme'
import type { AppDrawerScreenProps } from '..'
import type { MainTabScreenProps } from '../MainTab'

interface Props {
  navigation: MainTabScreenProps<
    'Home' | 'Collections' | 'Upload' | 'Wallet' | 'Profile' | 'MainStack'
  >['navigation']
}

const OS = Platform.OS

export default function HeaderLeft({ navigation }: Props) {
  const drawerNavigator =
    navigation.getParent() as AppDrawerScreenProps<'AppStack'>['navigation']

  const status = useDrawerStatus()

  return (
    <Pressable
      style={styles.container}
      onPress={() => drawerNavigator.toggleDrawer()}
    >
      {status === 'closed' ? (
        <Ionicons name='menu-outline' size={35} color={theme.colors.black} />
      ) : OS === 'ios' ? (
        <CloseIcon size={35} />
      ) : null}
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
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
})
