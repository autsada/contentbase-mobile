import { useState, useEffect } from 'react'

export function useCreateProfile(
  focused: boolean,
  isAuthenticated: boolean,
  hasProfile: boolean
) {
  const [showCreateProfileModal, setShowCreateProfileModal] = useState(false)
  // Show create profile modal if user doesn't have profile yet
  useEffect(() => {
    if (!focused) {
      if (showCreateProfileModal) setShowCreateProfileModal(false)
    } else {
      if (isAuthenticated && !hasProfile) {
        setShowCreateProfileModal(true)
      }
    }
  }, [isAuthenticated, hasProfile, focused])

  function closeCreateProfileModal() {
    setShowCreateProfileModal(false)
  }

  return { showCreateProfileModal, closeCreateProfileModal }
}
