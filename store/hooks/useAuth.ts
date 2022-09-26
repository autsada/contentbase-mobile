import { useMemo } from 'react'

import { useAppSelector, useAppDispatch } from '..'
import {
  setAuth,
  setAccount,
  setLoggedInProfile,
} from '../features/auth/authSlice'
import type { AuthState } from '../features/auth/authSlice'

export function useAuth() {
  const { user, token, account, signInProvider, loggedInProfile } =
    useAppSelector((state) => state.auth)
  const isAuthenticated = !!user
  const hasProfile = account && account.profiles && account.profiles.length > 0
  const hasWallet = account && !!account.address

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

  function setUserAccount(account: AuthState['account']) {
    dispatch(setAccount({ account }))
  }

  function updateLoggedInProfile(profile: AuthState['loggedInProfile']) {
    dispatch(setLoggedInProfile({ loggedInProfile: profile }))
  }

  return useMemo(
    () => ({
      user,
      isAuthenticated,
      token,
      signInProvider,
      account,
      setCredentials,
      setUserAccount,
      loggedInProfile,
      hasWallet,
      hasProfile,
      updateLoggedInProfile,
    }),
    [
      user,
      isAuthenticated,
      token,
      signInProvider,
      account,
      setCredentials,
      setUserAccount,
      loggedInProfile,
      hasWallet,
      hasProfile,
      updateLoggedInProfile,
    ]
  )
}
