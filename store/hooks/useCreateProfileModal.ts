import { useMemo } from 'react'

import { useAppSelector, useAppDispatch } from '..'
import { setProfileModal } from '../features/profile-modal/profileModalSlice'

export function useCreateProfileModal() {
  const { showProfileModal, title } = useAppSelector(
    (state) => state.profileModal
  )

  const dispatch = useAppDispatch()

  function openCreateProfileModal(title?: string) {
    dispatch(setProfileModal({ show: true, title }))
  }

  function closeCreateProfileModal() {
    dispatch(setProfileModal({ show: false }))
  }

  return useMemo(
    () => ({
      showProfileModal,
      title,
      openCreateProfileModal,
      closeCreateProfileModal,
    }),
    [showProfileModal, title, openCreateProfileModal, closeCreateProfileModal]
  )
}
