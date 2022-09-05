import React from 'react'
import { Text, TextStyle, StyleProp } from 'react-native'

import { theme } from '../../styles/theme'

interface Props {
  children: React.ReactNode
  style?: StyleProp<TextStyle>
}

const baseStyle: TextStyle = {
  color: theme.colors.black,
}

export function TextBase({ children, style = {} }: Props) {
  return (
    <Text
      style={[
        baseStyle,
        {
          fontFamily: theme.fonts.base,
          fontSize: theme.fontSize.base,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}

export function TextLight({ children, style = {} }: Props) {
  return (
    <Text
      style={[
        baseStyle,
        {
          fontFamily: theme.fonts.light,
          fontSize: theme.fontSize.base,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}

export function TextBaseItalic({ children, style = {} }: Props) {
  return (
    <Text
      style={[
        baseStyle,
        {
          fontFamily: theme.fonts.baseItalic,
          fontSize: theme.fontSize.base,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}

export function TextLightItalic({ children, style = {} }: Props) {
  return (
    <Text
      style={[
        baseStyle,
        {
          fontFamily: theme.fonts.ligthItalic,
          fontSize: theme.fontSize.base,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}

export function TextHeader5({ children, style = {} }: Props) {
  return (
    <Text
      style={[
        baseStyle,
        {
          fontFamily: theme.fonts.medium,
          fontSize: theme.fontSize.md,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}

export function TextHeader4({ children, style = {} }: Props) {
  return (
    <Text
      style={[
        baseStyle,
        {
          fontFamily: theme.fonts.medium,
          fontSize: theme.fontSize.lg,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}

export function TextHeader3({ children, style = {} }: Props) {
  return (
    <Text
      style={[
        baseStyle,
        {
          fontFamily: theme.fonts.semiBold,
          fontSize: theme.fontSize.xl,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
