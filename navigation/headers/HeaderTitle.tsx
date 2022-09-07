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
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 999,
    resizeMode: 'contain',
  },
})
