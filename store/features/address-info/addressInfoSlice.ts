import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FirebaseAuthTypes } from '@react-native-firebase/auth'

import { NexusGenObjects } from '../../../gentypes/typegen'

export type User = FirebaseAuthTypes.User

export type AddressState = {
  balance: string
  profiles: NexusGenObjects['Profile'][]
}

const initialState: AddressState = {
  balance: '0',
  profiles: [],
}

const addressInfoSlice = createSlice({
  name: 'addressInfo',
  initialState,
  reducers: {
    setBalance: (
      state: AddressState,
      action: PayloadAction<Pick<AddressState, 'balance'>>
    ) => {
      const { balance } = action.payload
      state.balance = balance
    },
  },
})

export const { setBalance } = addressInfoSlice.actions
export default addressInfoSlice.reducer
