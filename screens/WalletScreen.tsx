import { useState } from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import { useIsFocused } from '@react-navigation/native'

import SafeAreaContainer from '../components/shared/SafeAreaContainer'
import Container from '../components/shared/Container'
import { TextHeader5 } from '../components/shared/Texts'
import RegularButton from '../components/shared/RegularButton'
import { useAuthModal } from '../hooks/useAuthModal'
import { useAuth } from '../store/hooks/useAuth'
import { createWallet } from '../graphql'
import { theme } from '../styles/theme'
import type { MainTabScreenProps } from '../navigation/MainTab'

interface Props extends MainTabScreenProps<'Wallet'> {}

export default function WalletScreen({ navigation }: Props) {
  const [processing, setProcessing] = useState(false)

  const { isAuthenticated, hasWallet, account } = useAuth()
  const focused = useIsFocused()

  // Auth modal will be poped up if user is not authenticated
  const authTitle = 'Sign in to view your wallet'
  useAuthModal(isAuthenticated, navigation, focused, authTitle)

  async function handleCreateWallet() {
    try {
      setProcessing(true)
      await createWallet()
      setProcessing(false)
    } catch (error) {
      setProcessing(false)
      Alert.alert(
        'Create Wallet Failed',
        'Error occurred while attempting to create wallet. Please try again.',
        [{ text: 'CLOSE' }]
      )
    }
  }

  return (
    <SafeAreaContainer>
      <Container>
        {!hasWallet ? (
          <View style={[styles.container, { justifyContent: 'center' }]}>
            <TextHeader5
              style={{ width: '60%', alignSelf: 'center', textAlign: 'center' }}
            >
              You don't have wallet yet, let's create one.
            </TextHeader5>
            <RegularButton
              title='CREATE WALLET'
              containerStyle={styles.button}
              titleStyle={{ color: theme.colors.gray }}
              withSpinner={true}
              spinnerColor={theme.colors.darkBlue}
              disabled={processing}
              loading={processing}
              onPress={handleCreateWallet}
            />
          </View>
        ) : (
          <View style={[styles.container, { paddingHorizontal: 20 }]}>
            <View style={styles.addressContainer}>
              <TextHeader5 style={styles.address}>
                {account.address}
              </TextHeader5>
            </View>
          </View>
        )}
      </Container>
    </SafeAreaContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    paddingVertical: 20,
    alignItems: 'center',
  },
  button: {
    marginTop: 20,
    width: 180,
    height: 50,
    borderRadius: theme.radius['2xl'],
    backgroundColor: theme.colors.yellow,
  },
  addressContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.veryLightGray,
  },
  address: {
    fontSize: theme.fontSize.xs,
  },
})
