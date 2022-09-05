import { useMemo } from 'react'

import { useAppSelector, useAppDispatch } from '.'
import { setAuth, setAccount } from '../features/auth/authSlice'
import type { AuthState } from '../features/auth/authSlice'

export function useAuth() {
  const user = useAppSelector((state) => state.auth.user)
  const isAuthenticated = !!user
  const token = useAppSelector((state) => state.auth.token)
  const signInProvider = useAppSelector((state) => state.auth.signInProvider)
  const account = useAppSelector((state) => state.auth.account)
  const loggedInProfile = account
    ? account.profiles.find(
        (profile) => profile.profileId === account.loggedInProfile
      )
    : null

  const dispatch = useAppDispatch()

  function setCredentials({
    user,
    token,
    signInProvider,
  }: Pick<AuthState, 'user' | 'token' | 'signInProvider'>) {
    dispatch(
      setAuth({
        user,
        token,
        signInProvider,
      })
    )
  }

  function setUserProfile(account: AuthState['account']) {
    dispatch(setAccount({ account }))
  }

  return useMemo(
    () => ({
      user,
      isAuthenticated,
      token,
      signInProvider,
      account,
      setCredentials,
      setUserProfile,
      loggedInProfile,
    }),
    [
      user,
      isAuthenticated,
      token,
      signInProvider,
      account,
      setCredentials,
      setUserProfile,
      loggedInProfile,
    ]
  )
}
