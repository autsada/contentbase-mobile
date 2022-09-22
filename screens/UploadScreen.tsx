import { Text } from 'react-native'
import { useIsFocused } from '@react-navigation/native'

import SafeAreaContainer from '../components/shared/SafeAreaContainer'
import Container from '../components/shared/Container'
import { useAuthModal } from '../hooks/useAuthModal'
import { useAuth } from '../store/hooks'
import type { MainTabScreenProps } from '../navigation/MainTab'

interface Props extends MainTabScreenProps<'Upload'> {}

export default function UploadScreen({ navigation }: Props) {
  const { isAuthenticated } = useAuth()
  const focused = useIsFocused()

  // Auth modal will be poped up if user is not authenticated
  const authTitle = 'Sign in to share your content'
  useAuthModal(isAuthenticated, navigation, focused, authTitle)

  return (
    <SafeAreaContainer>
      <Container>
        <Text>Upload</Text>
      </Container>
    </SafeAreaContainer>
  )
}
