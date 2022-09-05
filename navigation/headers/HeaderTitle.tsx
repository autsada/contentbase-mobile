import { View, StyleSheet } from 'react-native'

import { TextHeader3 } from '../../components/shared/Texts'
import { theme } from '../../styles/theme'

interface Props {}

export default function HeaderTitle({}: Props) {
  return (
    <View>
      <TextHeader3 style={{ letterSpacing: theme.spacing.xxs }}>
        SEVANA
      </TextHeader3>
    </View>
  )
}

const styles = StyleSheet.create({})
