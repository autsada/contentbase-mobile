import { Client, createClient } from 'graphql-ws'

class WsClient {
  public client: Client | undefined

  constructor() {}

  public startWsClient(token: string) {
    const client = createClient({
      url: `ws://localhost:4000/graphql`,
      // url: `ws://contentbase-server-qyh5hhru7q-uc.a.run.app/graphql`,
      connectionParams: {
        authorization: `Bearer ${token}`,
      },
    })
    this.client = client
  }
}

export const wsClient = new WsClient()
