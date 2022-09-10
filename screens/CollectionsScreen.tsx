import { StyleSheet, Text } from 'react-native'

import SafeAreaContainer from '../components/shared/SafeAreaContainer'
import Container from '../components/shared/Container'
import type { MainStackScreenProps } from '../navigation/MainStack'

interface Props extends MainStackScreenProps<'Collections'> {}

export default function CollectionsScreen({ navigation }: Props) {
  return (
    <SafeAreaContainer>
      <Container>
        <Text>Collections</Text>
      </Container>
    </SafeAreaContainer>
  )
}
