import { View, StyleSheet } from 'react-native'

import { theme } from '../../styles/theme'

export default function Backdrop() {
  return <View style={styles.container} />
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    backgroundColor: theme.colors.transparentBlack,
  },
})
