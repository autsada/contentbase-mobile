import React from 'react'
import { StyleSheet, Pressable, View, Platform, ColorValue } from 'react-native'
import type { ViewStyle, TextStyle, Insets } from 'react-native'

import Spinner from './Spinner'
import { TextBase } from './Texts'
import { generateBoxShadow } from '../../utils/helpers'
import { theme } from '../../styles/theme'

interface Props {
  title: string
  titleStyle?: TextStyle
  titleContainerStyle?: ViewStyle
  containerStyle?: ViewStyle
  icon?: () => React.ReactNode
  onPress?: () => void
  disabled?: boolean
  hitSlop?: number | Insets
  loading?: boolean
  withSpinner?: boolean
  spinnerColor?: ColorValue
}

const OS = Platform.OS

export default function RegularButton({
  title,
  titleStyle = {},
  titleContainerStyle = {},
  containerStyle = {},
  icon,
  onPress,
  disabled = false,
  hitSlop = 20,
  loading,
  withSpinner = false,
  spinnerColor,
}: Props) {
  return (
    <Pressable
      hitSlop={hitSlop}
      disabled={disabled}
      style={[
        styles.container,
        generateBoxShadow({
          OS,
          xOffset: 2,
          yOffset: 2,
          shadowColor: theme.colors.gray,
          shadowRadius: 2,
          elevation: 3,
          shadowOpacity: 0.2,
        }),
        containerStyle,
        { opacity: disabled ? 0.3 : 1 },
      ]}
      onPress={onPress}
    >
      {icon ? icon() : null}
      <View style={titleContainerStyle}>
        {withSpinner && loading ? (
          <Spinner color={spinnerColor} />
        ) : (
          <TextBase style={titleStyle}>{title}</TextBase>
        )}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
