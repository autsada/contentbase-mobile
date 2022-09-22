import { useMemo } from 'react'

import { useAppSelector, useAppDispatch } from '..'
import {
  setCurrentRoute,
  setPreviousRoute,
  AppParamList,
} from '../features/routes/routesSlice'

export function useRoutes() {
  const currentRoute = useAppSelector((state) => state.routes.currentRoute)
  const previousRoute = useAppSelector((state) => state.routes.previousRoute)

  const dispatch = useAppDispatch()

  function setActiveRoute(name: keyof AppParamList) {
    dispatch(setCurrentRoute({ current: name }))
  }

  function setPreviousActiveRoute(name: keyof AppParamList) {
    dispatch(setPreviousRoute({ previous: name }))
  }

  return useMemo(
    () => ({
      currentRoute,
      previousRoute,
      setActiveRoute,
      setPreviousActiveRoute,
    }),
    [currentRoute, previousRoute, setActiveRoute, setPreviousActiveRoute]
  )
}
