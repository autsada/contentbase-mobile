import { StyleProp, TextStyle, OpaqueColorValue } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { theme } from '../../styles/theme'

interface Props {
  color?: string | OpaqueColorValue
  size?: number
  style?: StyleProp<TextStyle>
}

export default function CheckIcon({
  color = theme.colors.approve,
  size = 24,
  style = {},
}: Props) {
  return (
    <Ionicons name='md-checkmark' size={size} color={color} style={style} />
  )
}
