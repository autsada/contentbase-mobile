import { gql } from 'graphql-request'

export const VALIDATE_HANDLE_QUERY = gql`
  query VALIDATE_HANDLE($handle: String!) {
    isHandleUnique(handle: $handle)
  }
`

export const GET_BALANCE_QUERY = gql`
  query getMyBalance($address: String!) {
    getMyBalance(address: $address)
  }
`

export const GET_PROFILES_QUERY = gql`
  query {
    getMyProfiles {
      profileId
      uid
      owner
      handle
      tokenURI
      imageURI
      isDefault
    }
  }
`
