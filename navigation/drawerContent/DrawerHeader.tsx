import { View, StyleSheet, Image, Platform, Pressable } from 'react-native'
import type { DrawerNavigationHelpers } from '@react-navigation/drawer/lib/typescript/src/types'

import CloseIcon from '../../components/icons/CloseIcon'

interface Props {
  navigation: DrawerNavigationHelpers
}

const OS = Platform.OS

export default function DrawerHeader({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
        />
      </View>

      {OS === 'android' && (
        <Pressable
          hitSlop={20}
          style={{ position: 'absolute', right: 10, top: 10 }}
          onPress={() => navigation.closeDrawer()}
        >
          <CloseIcon size={35} />
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingTop: 20,
    marginBottom: 20,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 999,
    overflow: 'hidden',
    alignSelf: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
})
