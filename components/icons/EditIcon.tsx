import { StyleProp, TextStyle, OpaqueColorValue } from 'react-native'
import { AntDesign } from '@expo/vector-icons'

import { theme } from '../../styles/theme'

interface Props {
  color?: string | OpaqueColorValue
  size?: number
  style?: StyleProp<TextStyle>
}

export default function EditIcon({
  color = theme.colors.warning,
  size = 24,
  style = {},
}: Props) {
  return <AntDesign name='edit' size={size} color={color} style={style} />
}
