import { useMemo } from 'react'

import { useAppSelector, useAppDispatch } from '..'
import { setBalance } from '../features/address-info/addressInfoSlice'

export function useAddressInfo() {
  const balance = useAppSelector((state) => state.address.balance)
  const profiles = useAppSelector((state) => state.address.profiles)

  const dispatch = useAppDispatch()

  function updateBalance(balance: string) {
    dispatch(setBalance({ balance }))
  }

  return useMemo(
    () => ({
      balance,
      profiles,
      updateBalance,
    }),
    [balance, profiles, updateBalance]
  )
}
