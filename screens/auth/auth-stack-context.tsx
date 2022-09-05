import {
  ReactNode,
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from 'react'
import type {
  CallingCode,
  CountryCode as CCA2,
} from 'react-native-country-picker-modal'
import type { CountryCallingCode, CountryCode } from 'libphonenumber-js/mobile'
import type { FirebaseAuthTypes } from '@react-native-firebase/auth'

interface Props {
  children: ReactNode
}

// Context API for use as a global state for AuthStack
type AuthContext = {
  phoneNumber: string
  setPhoneNumber: Dispatch<SetStateAction<string>>
  isPhoneValid: boolean
  setIsPhoneValid: Dispatch<SetStateAction<boolean>>
  countryCode: CountryCode | CCA2 | undefined
  setCountryCode: Dispatch<SetStateAction<CountryCode | CCA2 | undefined>>
  callingCode: CountryCallingCode | CallingCode | ''
  setCallingCode: Dispatch<
    SetStateAction<CountryCallingCode | CallingCode | ''>
  >
  confirmation: FirebaseAuthTypes.ConfirmationResult | undefined
  setConfirmation: Dispatch<
    SetStateAction<FirebaseAuthTypes.ConfirmationResult | undefined>
  >
}

const AuthStackContext = createContext<AuthContext>(undefined)

export default function AuthStackContextProvider({ children }: Props) {
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [isPhoneValid, setIsPhoneValid] = useState<boolean>(false)
  const [callingCode, setCallingCode] = useState<
    CountryCallingCode | CallingCode
  >('')
  const [countryCode, setCountryCode] = useState<CountryCode>()
  const [confirmation, setConfirmation] =
    useState<FirebaseAuthTypes.ConfirmationResult>()

  return (
    <AuthStackContext.Provider
      value={{
        phoneNumber,
        setPhoneNumber,
        isPhoneValid,
        setIsPhoneValid,
        callingCode,
        countryCode,
        setCallingCode,
        setCountryCode,
        confirmation,
        setConfirmation,
      }}
    >
      {children}
    </AuthStackContext.Provider>
  )
}

export function useAuthStackContext() {
  const context = useContext(AuthStackContext)

  if (context === undefined)
    throw new Error(
      'useAuthStackContext must be used within AuthStackContext Provider.'
    )

  return context
}
