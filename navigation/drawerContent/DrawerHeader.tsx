import { View, StyleSheet } from 'react-native'

import { TextHeader5 } from '../../components/shared/Texts'
import { theme } from '../../styles/theme'

interface Props {}

export default function DrawerHeader({}: Props) {
  return (
    <View style={styles.container}>
      <TextHeader5
        style={{
          color: theme.colors.black,
        }}
      >
        Sevana
      </TextHeader5>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 120,
    padding: 20,
  },
})
