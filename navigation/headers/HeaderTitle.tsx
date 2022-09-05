import { View, StyleSheet, Image } from 'react-native'

interface Props {}

export default function HeaderTitle({}: Props) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
  },
  logo: {
    width: 60,
    resizeMode: 'contain',
  },
})
