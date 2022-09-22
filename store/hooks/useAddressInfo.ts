import { useMemo } from 'react'

import { useAppSelector, useAppDispatch } from '..'
import {
  setBalance,
  setProfiles,
} from '../features/address-info/addressInfoSlice'
import type { NexusGenObjects } from '../../gentypes/typegen'

export function useAddressInfo() {
  const balance = useAppSelector((state) => state.address.balance)
  const profiles = useAppSelector((state) => state.address.profiles)

  const dispatch = useAppDispatch()

  function updateBalance(balance: string) {
    dispatch(setBalance({ balance }))
  }

  function updateProfiles(profiles: NexusGenObjects['Profile'][]) {
    dispatch(setProfiles({ profiles }))
  }

  return useMemo(
    () => ({
      balance,
      profiles,
      updateBalance,
      updateProfiles,
    }),
    [balance, profiles, updateBalance, updateProfiles]
  )
}
