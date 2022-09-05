import { Image, StyleSheet, Pressable } from 'react-native'

import type { AppDrawerScreenProps } from '..'
import type { MainTabScreenProps } from '../MainTab'

interface Props {
  navigation: MainTabScreenProps<
    'Home' | 'Collections' | 'Upload' | 'Wallet' | 'Profile' | 'MainStack'
  >['navigation']
}

export default function HeaderLeft({ navigation }: Props) {
  const drawerNavigator =
    navigation.getParent() as AppDrawerScreenProps<'AppStack'>['navigation']

  return (
    <Pressable
      style={styles.container}
      onPress={() => drawerNavigator.toggleDrawer()}
    >
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
      />
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
