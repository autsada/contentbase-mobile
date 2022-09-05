import { StyleSheet, StyleProp, TextStyle } from 'react-native'

import { TextLight } from './Texts'
import { theme } from '../../styles/theme'

interface Props {
  message: string
  style?: StyleProp<TextStyle>
}

export default function ErrorMessage({ message, style = {} }: Props) {
  return <TextLight style={[styles.error, style]}>{message}</TextLight>
}

const styles = StyleSheet.create({
  error: {
    position: 'absolute',
    color: theme.colors.error,
    fontSize: theme.fontSize.xs,
  },
})
