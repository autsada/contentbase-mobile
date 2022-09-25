import { useMemo } from 'react'

import { useAppSelector, useAppDispatch } from '..'
import {
  setOverlay,
  setAppBackdrop,
} from '../features/app-overlay/overlaySlice'

export function useAppOverlay() {
  const isOverlayOpened = useAppSelector((state) => state.overlay.showOverlay)
  const isAppBackdropOpened = useAppSelector(
    (state) => state.overlay.showAppBackdrop
  )

  const dispatch = useAppDispatch()

  function applyOverlay(show: boolean) {
    dispatch(setOverlay({ show }))
  }

  function applyAppBackdrop(show: boolean) {
    dispatch(setAppBackdrop({ show }))
  }

  return useMemo(
    () => ({
      isOverlayOpened,
      applyOverlay,
      isAppBackdropOpened,
      applyAppBackdrop,
    }),
    [isOverlayOpened, applyOverlay, isAppBackdropOpened, applyAppBackdrop]
  )
}
