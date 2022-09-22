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
  const { user, setUserAccount, setCredentials, account } = useAuth()
  const userId = user && user.uid
  const address = account && account.address
  const { updateBalance, updateProfiles } = useAddressInfo()

  // Listen to user's auth state
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      try {
        if (user) {
          const claims = await user.getIdTokenResult()
          const token = await user.getIdToken()
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
    queryMyProfiles()
  }, [address])

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

  // Fetch address's balance and profiles when activity occurred
  useEffect(() => {
    if (!address || !activity) return

    // Perform fetch only if the activity is not acknowledged yet and when the type is "external" | "internal"
    if (!activity.isAcknowledged) {
      if (
        (activity.event === 'external' || activity.event === 'internal') &&
        activity.value > 0
      ) {
        queryBalance(address)
      }

      if (
        (activity.event === 'external' ||
          activity.event === 'internal' ||
          activity.event === 'token') &&
        activity.value === 0
      ) {
        queryMyProfiles()
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
  }, [address, activity])

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
