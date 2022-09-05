import { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import CountryPicker, {
  Country,
  CountryCode,
} from 'react-native-country-picker-modal'

import type { AuthStackScreenProps } from './AuthStack'
import { useAuthStackContext } from './auth-stack-context'

interface Props extends AuthStackScreenProps<'CountryPicker'> {}

export default function CountryPickerScreen({ navigation }: Props) {
  const { countryCode, setCountryCode, setCallingCode } = useAuthStackContext()

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
        // onOpen={() => {}}
        // onClose={() => {}}
        withCountryNameButton={true}
        withCloseButton={false}
        withFilter={true}
        // visible={true}
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
