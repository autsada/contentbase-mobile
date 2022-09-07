import { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import CountryPicker, {
  Country,
  CountryCode,
} from 'react-native-country-picker-modal'

import { useAuth } from '../../store/hooks/useAuth'
import { useAuthStackContext } from './auth-stack-context'
import type { AuthStackScreenProps } from './AuthStack'

interface Props extends AuthStackScreenProps<'CountryPicker'> {}

export default function CountryPickerScreen({ navigation }: Props) {
  const { isAuthenticated } = useAuth()
  const { countryCode, setCountryCode, setCallingCode } = useAuthStackContext()
  const isFocused = useIsFocused()

  // When user is authenticatated and the screen is focused, pop the screen out
  useEffect(() => {
    if (isAuthenticated && isFocused) {
      navigation.pop()
    }
  }, [isAuthenticated, navigation, isFocused])

  function onSelectCountry(c: Country) {
    setCountryCode(c.cca2)
    setCallingCode(c.callingCode[0])
    goBack()
  }

  function goBack() {
    navigation.navigate('Phone')
  }

  return (
    <View style={styles.container}>
      <CountryPicker
        withFlag={true}
        withModal={false}
        countryCode={countryCode as CountryCode}
        onSelect={onSelectCountry}
        withCallingCode={true}
        withAlphaFilter={true}
        withCountryNameButton={true}
        withCloseButton={false}
        withFilter={true}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
})
