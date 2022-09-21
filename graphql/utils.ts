import { httpClient, wsClient } from './client'
import {
  CREATE_WALLET_MUTATION,
  CREATE_PROFILE_NFT_MUTATION,
} from './mutations'
import { VALIDATE_HANDLE_QUERY } from './queries'
import { ADDRESS_ACTIVITY_SUBSCRIPTION } from './subscriptions'
import type {
  QueryReturnType,
  QueryArgsType,
  MutationReturnType,
  MutationArgsType,
  SubscriptionArgsType,
  SubscriptionReturnType,
} from './types'

export async function verifyHandle(handle: string) {
  if (handle && handle.length < 3) return

  const data = await httpClient.request<
    QueryReturnType<'isHandleUnique'>,
    QueryArgsType<'isHandleUnique'>
  >(VALIDATE_HANDLE_QUERY, { handle })

  return data.isHandleUnique
}

// Create wallet requires token to set headers as user just logged in and the app wide header is not available yet
export async function createWallet() {
  return httpClient.request<MutationReturnType<'createWallet'>>(
    CREATE_WALLET_MUTATION
  )
}

export async function createProfileNft({
  handle,
  imageURI = '',
}: {
  handle: string
  imageURI: string
}) {
  return httpClient.request<
    MutationReturnType<'createProfileNft'>,
    MutationArgsType<'createProfileNft'>
  >(CREATE_PROFILE_NFT_MUTATION, {
    input: { handle, imageURI },
  })
}

export async function addressActivitySubscription(address: string) {
  try {
    if (!address || !wsClient) return

    const result = await wsClient.execute<
      SubscriptionReturnType<'addressUpdated'>,
      SubscriptionArgsType<'addressUpdated'>
    >({
      query: ADDRESS_ACTIVITY_SUBSCRIPTION,
      variables: { input: { address } },
    })

    console.log('result -->', result)

    return result
  } catch (error) {
    console.log('error -->', error)
  }
}
