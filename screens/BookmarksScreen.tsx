import { View, StyleSheet, Text } from 'react-native'

import SafeAreaContainer from '../components/shared/SafeAreaContainer'
import Container from '../components/shared/Container'

interface Props {}

export default function BookmarksScreen({}: Props) {
  return (
    <SafeAreaContainer>
      <Container>
        <Text>Bookmarks</Text>
      </Container>
    </SafeAreaContainer>
  )
}

const styles = StyleSheet.create({})
