import { SubscribePayload } from 'graphql-ws'
import { client } from './client'
import { wsClient } from './wsClient'

import {
  CREATE_WALLET_MUTATION,
  CREATE_PROFILE_NFT_MUTATION,
} from './mutations'
import { VALIDATE_HANDLE_QUERY } from './queries'
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

  const data = await client.request<
    QueryReturnType<'isHandleUnique'>,
    QueryArgsType<'isHandleUnique'>
  >(VALIDATE_HANDLE_QUERY, { handle })

  return data.isHandleUnique
}

// Create wallet requires token to set headers as user just logged in and the app wide header is not available yet
export async function createWallet() {
  return client.request<MutationReturnType<'createWallet'>>(
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
  return client.request<
    MutationReturnType<'createProfileNft'>,
    MutationArgsType<'createProfileNft'>
  >(CREATE_PROFILE_NFT_MUTATION, {
    input: { handle, imageURI },
  })
}

export async function execute<T, U extends Record<string, unknown>>(
  payload: SubscribePayload & { variables: U }
) {
  if (!wsClient || !wsClient.client) return

  return new Promise<T>((resolve, reject) => {
    let result: T
    wsClient.client.subscribe<T>(payload, {
      next: (data) => (result = data as any),
      error: reject,
      complete: () => resolve(result),
    })
  })
}

export async function subscribeToAddressUpdated(address: string) {
  console.log('called -->')
  try {
    if (!address) return

    const result = await execute<
      SubscriptionReturnType<'addressUpdated'>,
      SubscriptionArgsType<'addressUpdated'>
    >({
      query: `subscription Subscription($input: AddressSubscriptionInput!) {
      addressUpdated(input: $input) {
        event {
          fromAddress
          toAddress
          value
          rawContract {
            rawValue
            decimal
          }
        }
      }
     }`,
      variables: { input: { address } },
    })

    console.log('result -->', result)

    return result
  } catch (error) {
    console.log('error -->', error)
  }
}
