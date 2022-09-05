import { StyleProp, TextStyle, OpaqueColorValue } from 'react-native'
import { EvilIcons } from '@expo/vector-icons'

import { theme } from '../../styles/theme'

interface Props {
  color?: string | OpaqueColorValue
  size?: number
  style?: StyleProp<TextStyle>
}

export default function ImageIcon({
  color = theme.colors.black,
  size = 24,
  style = {},
}: Props) {
  return <EvilIcons name='image' size={size} color={color} style={style} />
}
