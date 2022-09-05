import { gql } from 'graphql-request'

export const CREATE_PROFILE_NFT_MUTATION = gql`
  mutation CreateProfileNft($input: CreateProfileInput!) {
    createProfileNft(input: $input) {
      profileId
    }
  }
`
