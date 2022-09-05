import { ViewStyle, View, TextStyle, StyleProp } from 'react-native'

import BackIcon from '../icons/BackIcon'
import { theme } from '../../styles/theme'

interface Props {
  containerStyle?: ViewStyle
  size?: number
  color?: string
  iconStyle?: StyleProp<TextStyle>
}

export default function BackButton({
  containerStyle = {},
  size = 30,
  color = theme.colors.gray,
  iconStyle = {},
}: Props) {
  return (
    <View style={containerStyle}>
      <BackIcon size={size} color={color} style={iconStyle} />
    </View>
  )
}
