import { StyleProp, TextStyle, OpaqueColorValue } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { theme } from '../../styles/theme'

interface Props {
  color?: string | OpaqueColorValue
  size?: number
  style?: StyleProp<TextStyle>
}

export default function BackIcon({
  color = theme.colors.black,
  size = 24,
  style = {},
}: Props) {
  return (
    <Ionicons
      name='chevron-back-sharp'
      size={size}
      color={color}
      style={style}
    />
  )
}
