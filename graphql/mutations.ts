import { gql } from 'graphql-request'

export const CREATE_WALLET_MUTATION = gql`
  mutation CreateWallet {
    createWallet {
      address
    }
  }
`

export const CREATE_PROFILE_NFT_MUTATION = gql`
  mutation CreateProfileNft($input: CreateProfileInput!) {
    createProfileNft(input: $input) {
      profileId
    }
  }
`
