import { View, StyleSheet, Image } from 'react-native'

interface Props {}

export default function DrawerHeader({}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 120,
    paddingHorizontal: 20,
  },
  logoContainer: {
    width: '40%',
    height: '100%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: '100%',
    resizeMode: 'contain',
  },
})
