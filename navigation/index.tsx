import { useState, useEffect, useCallback } from 'react'
import {
  NavigationContainer,
  NavigatorScreenParams,
} from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import type { DrawerScreenProps } from '@react-navigation/drawer'
import auth from '@react-native-firebase/auth'

import MainDrawerContent from './drawerContent/MainDrawerContent'
import AppStack from './AppStack'
import { useAuth, useAddressInfo } from '../store/hooks'
import {
  accountsCollection,
  activitiesCollection,
  listenToDocUpdate,
  updateDocById,
} from '../firebase'
import { httpClient, getBalance, getMyProfiles } from '../graphql'
import type { AppStackParamList } from './AppStack'
import type { NexusGenObjects } from '../gentypes/typegen'

export type AppDrawerParamList = {
  AppStack: NavigatorScreenParams<AppStackParamList>
}

export type AppDrawerScreenProps<T extends keyof AppDrawerParamList> =
  DrawerScreenProps<AppDrawerParamList, T, 'MainDrawer'>

const MainDrawer = createDrawerNavigator<AppDrawerParamList>()

export default function Navigation() {
  const [activity, setActivity] = useState<
    NexusGenObjects['AddressActivity'] | undefined
  >()
  const { user, setUserAccount, setCredentials, account, signInProvider } =
    useAuth()
  const userId = user && user.uid
  const address = account && account.address
  const { updateBalance, updateProfiles } = useAddressInfo()

  // Listen to user's auth state
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      try {
        if (user) {
          const claims = await user.getIdTokenResult()
          const token = await user.getIdToken(true)
          setCredentials({
            user,
            token,
            signInProvider: claims.signInProvider as any,
          })

          // Set header to the request client
          if (httpClient)
            httpClient.setHeader('authorization', `Bearer ${token}`)
        } else {
          setCredentials({ user: null, token: null })
        }
      } catch (error) {
        console.log('auth error: ', error)
      }
    })

    return unsubscribe
  }, [httpClient])

  // Listen to account doc in Firestore when user is authenticated (current user is available)
  useEffect(() => {
    if (!userId) return

    const unsubscribe = listenToDocUpdate<NexusGenObjects['Account'] | null>({
      collectionName: accountsCollection,
      docId: userId,
      setterFn: setUserAccount,
      initialState: null,
    })

    return unsubscribe
  }, [userId])

  // Fetch address's balance and profiles for the first time
  useEffect(() => {
    if (!address) return
    queryBalance(address)

    // Call backend to query profile for traditional accounts
    if (signInProvider !== 'custom') {
      queryMyProfiles()
    } else {
      // For wallet accounts, connect to the blockchain directly
    }
  }, [address, signInProvider])

  // Listen to activities collection when user is authenticated
  useEffect(() => {
    if (!userId) return

    const unsubcribe = listenToDocUpdate({
      collectionName: activitiesCollection,
      docId: userId,
      setterFn: setActivity,
      initialState: undefined,
    })

    return unsubcribe
  }, [userId])

  // Fetch address's balance when activity occurred
  // For profiles, will listen to an event emitted from the blockchain before perform querying
  useEffect(() => {
    if (!address || !activity) return

    // Perform fetch only if the activity is not acknowledged yet
    if (!activity.isAcknowledged) {
      queryBalance(address)

      // If event is "token", query profiles
      if (activity.event === 'token') {
        // For traditional accounts call backend api to query profiles
        if (signInProvider !== 'custom') {
          queryMyProfiles()
        } else {
          // For wallet accounts, connect to the blockchain directly
        }
      }

      // Acknowledge the activity
      updateDocById<Partial<NexusGenObjects['AddressActivity']>>({
        collectionName: activitiesCollection,
        docId: activity.id,
        data: {
          isAcknowledged: true,
        },
      })
    }
  }, [address, activity, signInProvider])

  // Call backend api to query balance
  const queryBalance = useCallback(
    async (address: string) => {
      try {
        const result = await getBalance(address)
        updateBalance(result)
      } catch (error) {
        console.log('fetch balance error: ', error)
      }
    },
    [address]
  )

  // Call backend api to query profiles
  const queryMyProfiles = useCallback(async () => {
    try {
      const result = await getMyProfiles()
      updateProfiles(result)
    } catch (error) {
      updateProfiles([])
    }
  }, [])

  return (
    <NavigationContainer>
      <MainDrawer.Navigator
        id='MainDrawer'
        useLegacyImplementation
        screenOptions={() => ({
          drawerPosition: 'left',
          headerShown: false,
        })}
        drawerContent={(props) => <MainDrawerContent {...props} />}
      >
        <MainDrawer.Screen name='AppStack' component={AppStack} />
      </MainDrawer.Navigator>
    </NavigationContainer>
  )
}
