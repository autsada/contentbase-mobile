import { StyleSheet, Text } from 'react-native'
import { useIsFocused } from '@react-navigation/native'

import SafeAreaContainer from '../components/shared/SafeAreaContainer'
import Container from '../components/shared/Container'
import CreateProfileModal from '../components/profile/CreateProfileModal'
import { useAuthModal } from '../hooks/useAuthModal'
import { useAuth } from '../store/hooks/useAuth'
import { useCreateProfile } from '../hooks/useCreateProfile'
import { checkProfileExist } from '../utils/helpers'
import type { MainTabScreenProps } from '../navigation/MainTab'

interface Props extends MainTabScreenProps<'Collections'> {}

export default function CollectionsScreen({ navigation }: Props) {
  const { isAuthenticated, account } = useAuth()
  const hasProfile = checkProfileExist(account)
  const focused = useIsFocused()
  const { showCreateProfileModal, closeCreateProfileModal } = useCreateProfile(
    focused,
    isAuthenticated,
    hasProfile
  )

  // Auth modal will be poped up if user is not authenticated
  const authTitle = 'Sign in to access your collections'
  useAuthModal(isAuthenticated, navigation, focused, authTitle)

  return (
    <SafeAreaContainer>
      <Container>
        <Text>Collections</Text>
      </Container>

      <CreateProfileModal
        navigation={navigation}
        visible={showCreateProfileModal}
        closeModal={closeCreateProfileModal}
        title={`You need your first profile NFT to view collections, let's create one`}
      />
    </SafeAreaContainer>
  )
}

const styles = StyleSheet.create({})
