import { GraphQLClient } from 'graphql-request'
import Constants from 'expo-constants'

const httpApiEndpoint = Constants.manifest.extra?.httpApiEndpoint

// Http client
export const httpClient = new GraphQLClient(`${httpApiEndpoint}/graphql`)
