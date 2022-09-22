import { useState } from 'react'
import { Text, StyleSheet, Alert } from 'react-native'
import { useIsFocused } from '@react-navigation/native'

import SafeAreaContainer from '../components/shared/SafeAreaContainer'
import Container from '../components/shared/Container'
import CreateProfileModal from '../components/profile/CreateProfileModal'
import { useAuthModal } from '../hooks/useAuthModal'
import { useAuth, useAddressInfo } from '../store/hooks'
import { useCreateProfileModal } from '../store/hooks/useCreateProfileModal'
import RegularButton from '../components/shared/RegularButton'
import { createWallet } from '../graphql'
import type { MainTabScreenProps } from '../navigation/MainTab'

interface Props extends MainTabScreenProps<any> {}

export default function ProfilesScreen({ navigation }: Props) {
  const [processing, setProcessing] = useState(false)

  const { isAuthenticated, hasWallet } = useAuth()
  const { balance, profiles } = useAddressInfo()
  const focused = useIsFocused()
  const { showProfileModal, title, closeCreateProfileModal } =
    useCreateProfileModal()

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
