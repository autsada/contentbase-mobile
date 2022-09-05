import {
  View,
  StyleSheet,
  ViewStyle,
  Pressable,
  TextStyle,
  StyleProp,
} from 'react-native'

import SafeAreaContainer from './SafeAreaContainer'
import Spinner from './Spinner'
import { TextBase } from './Texts'
import { theme } from '../../styles/theme'

interface Props {
  onPressOverlay?: () => void
  containerStyle?: StyleProp<ViewStyle>
  withSpinner?: boolean
  spinnerSize?: number | 'small' | 'large'
  withInfo?: boolean
  info?: string
  infoStyle?: StyleProp<TextStyle>
  infoContainerStyle?: StyleProp<ViewStyle>
  backgroundOpacity?: number
}

export default function Overlay({
  onPressOverlay,
  containerStyle = {},
  withSpinner = true,
  withInfo = false,
  info = '',
  infoStyle = {},
  infoContainerStyle = {},
  backgroundOpacity = 1,
}: Props) {
  return (
    <View
      style={[styles.container, containerStyle, { opacity: backgroundOpacity }]}
    >
      <SafeAreaContainer containerStyle={{ backgroundColor: 'transparent' }}>
        <Pressable style={styles.inner} onPress={onPressOverlay}>
          {withSpinner && <Spinner size='large' />}

          <View style={[styles.infoContainer, infoContainerStyle]}>
            {withInfo && (
              <TextBase style={[styles.info, infoStyle]}>{info}</TextBase>
            )}
          </View>
        </Pressable>
      </SafeAreaContainer>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1000,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.transparentYellow,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  infoContainer: {
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
  },
  info: {
    color: theme.colors.blue,
    fontSize: theme.fontSize.md,
    textAlign: 'center',
  },
})
