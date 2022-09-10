import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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
