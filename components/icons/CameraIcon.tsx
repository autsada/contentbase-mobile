import { StyleProp, TextStyle, OpaqueColorValue } from 'react-native'
import { SimpleLineIcons } from '@expo/vector-icons'

import { theme } from '../../styles/theme'

interface Props {
  color?: string | OpaqueColorValue
  size?: number
  style?: StyleProp<TextStyle>
}

export default function CameraIcon({
  color = theme.colors.black,
  size = 24,
  style = {},
}: Props) {
  return (
    <SimpleLineIcons name='camera' size={size} color={color} style={style} />
  )
}
