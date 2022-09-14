import type { NexusGenFieldTypes, NexusGenArgTypes } from '../gentypes/typegen'

export type QueryReturnType<T extends keyof NexusGenFieldTypes['Query']> = {
  [k in T]: NexusGenFieldTypes['Query'][T]
}
export type QueryArgsType<T extends keyof NexusGenArgTypes['Query']> =
  NexusGenArgTypes['Query'][T]

export type MutationReturnType<T extends keyof NexusGenFieldTypes['Mutation']> =
  {
    [k in T]: NexusGenFieldTypes['Mutation'][T]
  }
export type MutationArgsType<T extends keyof NexusGenArgTypes['Mutation']> =
  NexusGenArgTypes['Mutation'][T]

export type SubscriptionReturnType<
  T extends keyof NexusGenFieldTypes['Subscription']
> = {
  [k in T]: NexusGenFieldTypes['Subscription'][T]
}
export type SubscriptionArgsType<
  T extends keyof NexusGenArgTypes['Subscription']
> = NexusGenArgTypes['Subscription'][T]
