import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FirebaseAuthTypes } from '@react-native-firebase/auth'

import { NexusGenObjects } from '../../../gentypes/typegen'

export type User = FirebaseAuthTypes.User

export type AuthState = {
  user: User | null
  token: string | null
  loading: boolean
  account: NexusGenObjects['Account'] | null
  signInProvider?: 'phone' | 'password' | 'google.com' | 'custom'
  loggedInProfile: NexusGenObjects['Profile'] | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: true,
  account: null,
  loggedInProfile: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (
      state: AuthState,
      action: PayloadAction<
        Pick<AuthState, 'user' | 'token' | 'signInProvider'>
      >
    ) => {
      const { user, token, signInProvider } = action.payload
      state.user = user
      state.token = token
      state.signInProvider = signInProvider
    },
    setAccount: (
      state: AuthState,
      action: PayloadAction<Pick<AuthState, 'account'>>
    ) => {
      state.account = action.payload.account
    },
    setLoggedInProfile: (
      state: AuthState,
      action: PayloadAction<Pick<AuthState, 'loggedInProfile'>>
    ) => {
      state.loggedInProfile = action.payload.loggedInProfile
    },
  },
})

export const { setAuth, setAccount, setLoggedInProfile } = authSlice.actions
export default authSlice.reducer
