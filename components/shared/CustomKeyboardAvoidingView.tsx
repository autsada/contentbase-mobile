import React from 'react'
import {
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  ViewStyle,
  StyleProp,
} from 'react-native'

interface Props {
  children: React.ReactNode
  containerStyle?: StyleProp<ViewStyle>
  keyboardVerticalOffset?: number
  contentContainerStyle?: StyleProp<ViewStyle>
  showsVerticalScrollIndicator?: boolean
}

const OS = Platform.OS

export default function CustomKeyboardAvoidingView({
  children,
  containerStyle = {},
  keyboardVerticalOffset = 110,
  contentContainerStyle = {},
  showsVerticalScrollIndicator = false,
}: Props) {
  return (
    <KeyboardAvoidingView
      behavior={OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={keyboardVerticalOffset}
      style={containerStyle}
    >
      <ScrollView
        alwaysBounceVertical={false}
        style={contentContainerStyle}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
