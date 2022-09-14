import { Client, createClient } from 'graphql-ws'

class WsClient {
  public client: Client | null

  constructor() {
    this.client = null
  }

  public startWsClient(token: string) {
    const client = createClient({
      url: 'ws://172.20.10.2:4000/graphql',
      connectionParams: {
        authorization: `Bearer ${token}`,
      },
    })

    this.client = client
  }
}

export const wsClient = new WsClient()
