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
  const hasProfile = account && account.profiles && account.profiles.length > 0
  const hasWallet = account && !!account.address
  const loggedInProfile =
    account && account.profiles && account.profiles.length > 0
      ? account.profiles.find(
          (profile) =>
            profile.profileId === account.loggedInProfile || profile.isDefault
        ) || account.profiles[0]
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

  function setUserAccount(account: AuthState['account']) {
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
      setUserAccount,
      loggedInProfile,
      hasWallet,
      hasProfile,
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
    ]
  )
}
