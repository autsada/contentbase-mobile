import { configureStore } from '@reduxjs/toolkit'

import authReducer from './features/auth/authSlice'
import routesReducer from './features/routes/routesSlice'
import overlayReducer from './features/app-overlay/overlaySlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    routes: routesReducer,
    overlay: overlayReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type AppDispatch = typeof store.dispatch
export type AppState = ReturnType<typeof store.getState>
