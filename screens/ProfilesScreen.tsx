import { useState } from 'react'
import { Text, StyleSheet, Alert } from 'react-native'
import { useIsFocused } from '@react-navigation/native'

import SafeAreaContainer from '../components/shared/SafeAreaContainer'
import Container from '../components/shared/Container'
import CreateProfileModal from '../components/profile/CreateProfileModal'
import { useAuthModal } from '../hooks/useAuthModal'
import {
  useAuth,
  useAddressInfo,
  useCreateProfileModal,
  useAppOverlay,
} from '../store/hooks'
import RegularButton from '../components/shared/RegularButton'
import { createWallet } from '../graphql'
import type { MainTabScreenProps } from '../navigation/MainTab'

interface Props extends MainTabScreenProps<any> {}

export default function ProfilesScreen({ navigation }: Props) {
  const [processing, setProcessing] = useState(false)

  const { isAuthenticated, hasWallet } = useAuth()
  const { balance, profiles } = useAddressInfo()
  const focused = useIsFocused()
  const {
    showProfileModal,
    title,
    closeCreateProfileModal,
    openCreateProfileModal,
  } = useCreateProfileModal()
  const { applyAppBackdrop } = useAppOverlay()

  // Auth modal will be poped up if user is not authenticated
  const authTitle = 'Sign in to view your profiles'
  useAuthModal(isAuthenticated, navigation, focused, authTitle)

  async function handleCreateWallet() {
    try {
      setProcessing(true)
      await createWallet()
      setProcessing(false)
    } catch (error) {
      setProcessing(false)
      Alert.alert('Create wallet failed', '')
    }
  }

  function handleOpenCreateProfileModal() {
    applyAppBackdrop(true)
    openCreateProfileModal('Create New Profile')
  }

  console.log('profiles -->', profiles)
  return (
    <>
      <SafeAreaContainer>
        <Container>
          {!hasWallet && (
            <RegularButton
              title='Create Wallet'
              containerStyle={styles.button}
              disabled={processing}
              withSpinner={true}
              loading={processing}
              onPress={handleCreateWallet}
            />
          )}

          <Text>Balance: {balance}</Text>
          <RegularButton
            title='Create Profile'
            containerStyle={styles.button}
            onPress={handleOpenCreateProfileModal}
          />
        </Container>
      </SafeAreaContainer>

      <CreateProfileModal
        visible={showProfileModal}
        closeModal={closeCreateProfileModal}
        title={title}
      />
    </>
  )
}

const styles = StyleSheet.create({
  button: {
    width: 200,
    height: 50,
    backgroundColor: 'yellow',
  },
})
