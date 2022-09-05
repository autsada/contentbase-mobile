import { StyleProp, TextStyle, OpaqueColorValue } from 'react-native'
import { AntDesign } from '@expo/vector-icons'

import { theme } from '../../styles/theme'

interface Props {
  color?: string | OpaqueColorValue
  size?: number
  style?: StyleProp<TextStyle>
}

export default function CloseErrorIcon({
  color = theme.colors.error,
  size = 20,
  style = {},
}: Props) {
  return (
    <AntDesign name='closecircle' size={size} color={color} style={style} />
  )
}
