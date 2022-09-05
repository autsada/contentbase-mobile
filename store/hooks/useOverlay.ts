import { useMemo } from 'react'

import { useAppSelector, useAppDispatch } from '.'
import { setOverlay } from '../features/app-overlay/overlaySlice'

export function useAppOverlay() {
  const isOverlayOpened = useAppSelector((state) => state.overlay.showOverlay)

  const dispatch = useAppDispatch()

  function applyOverlay(show: boolean) {
    dispatch(setOverlay({ show }))
  }

  return useMemo(
    () => ({ isOverlayOpened, applyOverlay }),
    [isOverlayOpened, applyOverlay]
  )
}
