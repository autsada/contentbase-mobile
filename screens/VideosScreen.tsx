import React, { useLayoutEffect } from 'react'
import { View, StyleSheet, Text } from 'react-native'

import HeaderLeft from '../navigation/headers/HeaderLeft'
import StackHeaderLeft from '../navigation/headers/StackHeaderLeft'
import SafeAreaContainer from '../components/shared/SafeAreaContainer'
import Container from '../components/shared/Container'
import type { MainTabScreenProps } from '../navigation/MainTab'
import type { MainStackScreenProps } from '../navigation/MainStack'

interface Props extends MainStackScreenProps<'Videos'> {}

export default function VideosScreen({ navigation, route }: Props) {
  return (
    <SafeAreaContainer>
      <Container>
        <Text>Videos</Text>
      </Container>
    </SafeAreaContainer>
  )
}

const styles = StyleSheet.create({})
