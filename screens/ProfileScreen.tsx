import { Text } from 'react-native'
import { useIsFocused } from '@react-navigation/native'

import SafeAreaContainer from '../components/shared/SafeAreaContainer'
import Container from '../components/shared/Container'
import CreateProfileModal from '../components/profile/CreateProfileModal'
import { useAuthModal } from '../hooks/useAuthModal'
import { useAuth } from '../store/hooks/useAuth'
import { useCreateProfile } from '../hooks/useCreateProfile'
import { checkProfileExist } from '../utils/helpers'
import type { MainTabScreenProps } from '../navigation/MainTab'

interface Props extends MainTabScreenProps<'Profile'> {}

export default function ProfileScreen({ navigation }: Props) {
  const { isAuthenticated, account } = useAuth()
  // const hasProfile = checkProfileExist(account)
  const focused = useIsFocused()
  // const { showCreateProfileModal, closeCreateProfileModal } = useCreateProfile(
  //   focused,
  //   isAuthenticated,
  //   hasProfile
  // )

  // Auth modal will be poped up if user is not authenticated
  const authTitle = 'Sign in to view your profiles'
  useAuthModal(isAuthenticated, navigation, focused, authTitle)

  return (
    <SafeAreaContainer>
      <Container>
        <Text>Profile!!!</Text>
      </Container>

      {/* <CreateProfileModal
        navigation={navigation}
        visible={showCreateProfileModal}
        closeModal={closeCreateProfileModal}
        title={`You need your first profile NFT to view your profile, let's create one`}
      /> */}
    </SafeAreaContainer>
  )
}
