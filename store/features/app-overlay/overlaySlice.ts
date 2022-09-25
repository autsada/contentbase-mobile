import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type OverlayState = {
  showOverlay: boolean
  showAppBackdrop: boolean
}

const initialState: OverlayState = {
  showOverlay: false,
  showAppBackdrop: false,
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
    setAppBackdrop: (
      state: OverlayState,
      action: PayloadAction<{ show: boolean }>
    ) => {
      const { show } = action.payload
      state.showAppBackdrop = show
    },
  },
})

export const { setOverlay, setAppBackdrop } = overlaySlice.actions
export default overlaySlice.reducer
