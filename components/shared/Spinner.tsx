import {
  ActivityIndicator,
  ColorValue,
  ViewStyle,
  StyleProp,
} from 'react-native'

import { theme } from '../../styles/theme'

interface Props {
  size?: number | 'small' | 'large'
  color?: ColorValue
  style?: StyleProp<ViewStyle>
}

export default function Spinner({
  size = 'small',
  color = `${theme.colors.lightBlue}`,
  style = {},
}: Props) {
  return <ActivityIndicator size={size} color={color} style={style} />
}
