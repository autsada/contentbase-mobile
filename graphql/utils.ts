import { client } from './client'

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
} from './types'

export async function verifyHandle(handle: string) {
  if (handle && handle.length < 3) return

  return client.request<
    QueryReturnType<'isHandleUnique'>,
    QueryArgsType<'isHandleUnique'>
  >(VALIDATE_HANDLE_QUERY, { handle })
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
