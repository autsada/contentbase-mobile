import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ProfileModalState = {
  showProfileModal: boolean
  title?: string
}

const initialState: ProfileModalState = {
  showProfileModal: false,
  title: 'Create Profile',
}

const profileModalSlice = createSlice({
  name: 'profileModal',
  initialState,
  reducers: {
    setProfileModal: (
      state: ProfileModalState,
      action: PayloadAction<{ show: boolean; title?: string }>
    ) => {
      const { show, title } = action.payload
      state.showProfileModal = show
      state.title = title ? title : state.title
    },
  },
})

export const { setProfileModal } = profileModalSlice.actions
export default profileModalSlice.reducer
