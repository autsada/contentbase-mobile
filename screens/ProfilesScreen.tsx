import { Text } from 'react-native'
import { useIsFocused } from '@react-navigation/native'

import SafeAreaContainer from '../components/shared/SafeAreaContainer'
import Container from '../components/shared/Container'
import CreateProfileModal from '../components/profile/CreateProfileModal'
import { useAuthModal } from '../hooks/useAuthModal'
import { useAuth } from '../store/hooks/useAuth'
import { useCreateProfileModal } from '../store/hooks/useCreateProfileModal'
import type { MainTabScreenProps } from '../navigation/MainTab'

interface Props extends MainTabScreenProps<any> {}

export default function ProfilesScreen({ navigation }: Props) {
  const { isAuthenticated } = useAuth()
  const focused = useIsFocused()
  const { showProfileModal, title, closeCreateProfileModal } =
    useCreateProfileModal()

  // Auth modal will be poped up if user is not authenticated
  const authTitle = 'Sign in to view your profiles'
  useAuthModal(isAuthenticated, navigation, focused, authTitle)

  return (
    <SafeAreaContainer>
      <Container>
        <Text>Profile!!!</Text>
      </Container>

      <CreateProfileModal
        visible={showProfileModal}
        closeModal={closeCreateProfileModal}
        title={title}
      />
    </SafeAreaContainer>
  )
}
