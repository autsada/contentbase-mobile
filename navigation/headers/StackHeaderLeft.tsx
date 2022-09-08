import { StyleSheet, Pressable } from 'react-native'

import type { MainTabScreenProps, MainTabParamList } from '../MainTab'
import BackButton from '../../components/shared/BackButton'
import { useRoutes } from '../../store/hooks/useRoutes'

export default function StackHeaderLeft(
  props: MainTabScreenProps<
    'Home' | 'Posts' | 'Upload' | 'Wallet' | 'Notifications' | 'MainStack'
  >
) {
  const navigation = props.navigation
  const { previousRoute } = useRoutes()

  function goBack() {
    navigation.navigate(previousRoute as keyof MainTabParamList)
  }

  // console.log('state -->', navigation.getState())
  return (
    <Pressable style={styles.container} onPress={goBack}>
      <BackButton />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
  },
})
