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
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: true,
  account: null,
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
  },
})

export const { setAuth, setAccount } = authSlice.actions
export default authSlice.reducer
