import React from 'react'
import { StyleSheet, StyleProp, ViewStyle, SafeAreaView } from 'react-native'

interface Props {
  children?: React.ReactNode
  containerStyle?: StyleProp<ViewStyle>
}

export default function SafeAreaContainer({
  children,
  containerStyle = {},
}: Props) {
  return (
    <SafeAreaView style={[styles.container, containerStyle]}>
      {children}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    backgroundColor: 'white',
    // backgroundColor: globalSyles.colors.secondaryBackground,
    margin: 0,
    padding: 0,
  },
})
