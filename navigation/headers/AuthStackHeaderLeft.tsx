import { StyleSheet, Pressable } from 'react-native'

import type { AuthStackScreenProps } from '../../screens/auth/AuthStack'
import BackButton from '../../components/shared/BackButton'
import { useAuthStackContext } from '../../screens/auth/auth-stack-context'

interface Props
  extends AuthStackScreenProps<
    'Auth' | 'Phone' | 'CountryPicker' | 'ConfirmCode' | 'Email'
  > {}

export default function AuthStackHeaderLeft({ navigation }: Props) {
  function goBack() {
    navigation.pop()
  }

  return (
    <Pressable hitSlop={20} style={styles.container} onPress={goBack}>
      <BackButton />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
})
