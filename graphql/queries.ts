import { gql } from 'graphql-request'

export const VALIDATE_HANDLE_QUERY = gql`
  query VALIDATE_HANDLE($handle: String!) {
    isHandleUnique(handle: $handle)
  }
`
