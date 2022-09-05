import { View, StyleSheet, Text } from 'react-native'

import SafeAreaContainer from '../components/shared/SafeAreaContainer'
import Container from '../components/shared/Container'

export default function HomeScreen() {
  return (
    <SafeAreaContainer>
      <Container>
        <Text>Home</Text>
      </Container>
    </SafeAreaContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
})
