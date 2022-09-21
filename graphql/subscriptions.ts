import { gql } from 'graphql-request'

export const ADDRESS_ACTIVITY_SUBSCRIPTION = gql`
  subscription Subscription($input: AddressSubscriptionInput!) {
    addressUpdated(input: $input) {
      event
      fromAddress
      toAddress
    }
  }
`
