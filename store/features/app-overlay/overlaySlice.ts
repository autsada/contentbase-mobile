import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FirebaseAuthTypes } from '@react-native-firebase/auth'

export type User = FirebaseAuthTypes.User

export type OverlayState = {
  showOverlay: boolean
}

const initialState: OverlayState = {
  showOverlay: false,
}

const overlaySlice = createSlice({
  name: 'overlay',
  initialState,
  reducers: {
    setOverlay: (
      state: OverlayState,
      action: PayloadAction<{ show: boolean }>
    ) => {
      const { show } = action.payload
      state.showOverlay = show
    },
  },
})

export const { setOverlay } = overlaySlice.actions
export default overlaySlice.reducer
