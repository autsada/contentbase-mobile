import { GraphQLClient } from 'graphql-request'
import Constants from 'expo-constants'

// const apiBaseUrl = Constants.manifest.extra?.apiEndpoint
const apiBaseUrl = 'http://172.20.10.2:4000'

export const client = new GraphQLClient(`${apiBaseUrl}/graphql`)
