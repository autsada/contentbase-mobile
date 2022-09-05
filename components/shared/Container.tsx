import React from 'react'
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native'

interface Props {
  children: React.ReactNode
  containerStyle?: StyleProp<ViewStyle>
}

export default function Container({ children, containerStyle = {} }: Props) {
  return <View style={[styles.container, containerStyle]}>{children}</View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
})
