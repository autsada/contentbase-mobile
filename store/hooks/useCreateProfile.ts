import { useState, useEffect, useCallback } from 'react'

export function useCreateProfile(
  focused: boolean,
  isAuthenticated: boolean,
  hasProfile: boolean
) {
  const [showCreateProfileModal, setShowCreateProfileModal] = useState(false)
  // Show create profile modal if user doesn't have profile yet
  useEffect(() => {
    if (!focused) return

    if (isAuthenticated && !hasProfile) {
      setShowCreateProfileModal(true)
    }
  }, [isAuthenticated, hasProfile, focused])

  const closeCreateProfileModal = useCallback(() => {
    setShowCreateProfileModal(false)
  }, [])

  return { showCreateProfileModal, closeCreateProfileModal }
}
