import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import authReducer from './features/auth/authSlice'
import routesReducer from './features/routes/routesSlice'
import overlayReducer from './features/app-overlay/overlaySlice'
import profileModalReducer from './features/profile-modal/profileModalSlice'
import addressInfoSlice from './features/address-info/addressInfoSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    routes: routesReducer,
    overlay: overlayReducer,
    profileModal: profileModalReducer,
    address: addressInfoSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type AppDispatch = typeof store.dispatch
export type AppState = ReturnType<typeof store.getState>

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector
