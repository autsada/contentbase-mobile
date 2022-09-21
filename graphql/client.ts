import { GraphQLClient } from 'graphql-request'
import { createClient, Client } from 'graphql-ws'
import Observable from 'zen-observable'
import type { SubscribePayload } from 'graphql-ws'
import Constants from 'expo-constants'

const httpApiEndpoint = Constants.manifest.extra?.httpApiEndpoint
const wsApiEndpoint = Constants.manifest.extra?.wsApiEndpoint

console.log('http -->', httpApiEndpoint)
console.log('ws -->', wsApiEndpoint)
// Http client
export const httpClient = new GraphQLClient(`${httpApiEndpoint}/graphql`)

// Ws client
class WsClient {
  public client: Client | undefined

  constructor() {}

  public startWsClient(token: string) {
    const client = createClient({
      url: `${wsApiEndpoint}/graphql`,
      connectionParams: {
        authorization: `Bearer ${token}`,
      },
    })
    this.client = client
  }

  public async execute<T, U extends Record<string, unknown>>(
    payload: SubscribePayload & { variables?: U }
  ) {
    if (!this.client) return

    return new Promise<T>((resolve, reject) => {
      let result: T
      this.client.subscribe<T>(payload, {
        next: (data) => (result = data as any),
        error: reject,
        complete: () => resolve(result),
      })
    })
  }
}

export const wsClient = new WsClient()
