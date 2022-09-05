import {
  View,
  StyleSheet,
  ColorValue,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native'
import EvilIcons from '@expo/vector-icons/EvilIcons'

import CloseIcon from '../icons/CloseIcon'
import { theme } from '../../styles/theme'

interface Props {
  size?: number
  color?: ColorValue
  containerStyle?: StyleProp<ViewStyle>
  iconStyle?: StyleProp<TextStyle>
}

export default function CloseButton({
  size = 24,
  color = theme.colors.gray,
  containerStyle = {},
  iconStyle = {},
}: Props) {
  return (
    <View style={[styles.container, containerStyle]}>
      <CloseIcon size={size} color={color} style={iconStyle} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
  },
})
