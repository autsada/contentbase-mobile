import { useState, useEffect } from 'react'
import { Text, StyleSheet } from 'react-native'
import { useIsFocused } from '@react-navigation/native'

import SafeAreaContainer from '../components/shared/SafeAreaContainer'
import Container from '../components/shared/Container'
import CreateProfileModal from '../components/profile/CreateProfileModal'
import { useAuthModal } from '../hooks/useAuthModal'
import { useAuth } from '../store/hooks/useAuth'
import { useCreateProfileModal } from '../store/hooks/useCreateProfileModal'
import { useListenToAddress } from '../hooks/useListenToAddress'
import type { MainTabScreenProps } from '../navigation/MainTab'

import RegularButton from '../components/shared/RegularButton'
import { createWallet, subscribeToAddressUpdated } from '../graphql'

interface Props extends MainTabScreenProps<any> {}

export default function ProfilesScreen({ navigation }: Props) {
  const [processing, setProcessing] = useState(false)

  const { isAuthenticated, hasWallet, account } = useAuth()
  const focused = useIsFocused()
  const address = account && account.address
  const { showProfileModal, title, closeCreateProfileModal } =
    useCreateProfileModal()

  // Auth modal will be poped up if user is not authenticated
  const authTitle = 'Sign in to view your profiles'
  useAuthModal(isAuthenticated, navigation, focused, authTitle)

  useEffect(() => {
    if (address) {
      subscribeToAddressUpdated(address)
    }
  }, [address])

  async function handleCreateWallet() {
    try {
      setProcessing(true)
      const result = await createWallet()
      setProcessing(false)
    } catch (error) {
      setProcessing(false)
    }
  }

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

          <Text>Profiles</Text>
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
