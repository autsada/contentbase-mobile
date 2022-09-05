import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { AppStackParamList } from '../../../navigation/AppStack'
import type { MainTabParamList } from '../../../navigation/MainTab'
import type { MainStackParamList } from '../../../navigation/MainStack'

export type AppParamList = AppStackParamList &
  MainTabParamList &
  MainStackParamList

type RoutesState = {
  currentRoute: keyof AppParamList
  previousRoute?: keyof AppParamList
}

const initialState: RoutesState = {
  currentRoute: 'Home',
  previousRoute: undefined,
}

const routesSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentRoute: (
      state: RoutesState,
      action: PayloadAction<{
        current: keyof AppParamList
      }>
    ) => {
      const { current } = action.payload
      state.currentRoute = current
    },
    setPreviousRoute: (
      state: RoutesState,
      action: PayloadAction<{
        previous: keyof AppParamList
      }>
    ) => {
      const { previous } = action.payload
      state.previousRoute = previous
    },
  },
})

export const { setCurrentRoute, setPreviousRoute } = routesSlice.actions
export default routesSlice.reducer
