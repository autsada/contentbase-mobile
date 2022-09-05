import { GraphQLClient } from 'graphql-request'
import Constants from 'expo-constants'

const apiBaseUrl = Constants.manifest.extra?.apiEndpoint

export const client = new GraphQLClient(`${apiBaseUrl}/graphql`)
