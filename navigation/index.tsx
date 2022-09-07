import { useEffect } from 'react'
import {
  NavigationContainer,
  NavigatorScreenParams,
} from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import type { DrawerScreenProps } from '@react-navigation/drawer'
import auth from '@react-native-firebase/auth'

import type { AppStackParamList } from './AppStack'
import type { NexusGenObjects } from '../gentypes/typegen'
import MainDrawerContent from './drawerContent/MainDrawerContent'
import AppStack from './AppStack'
import { useAuth } from '../store/hooks/useAuth'
import { accountsCollection, listenToDocUpdate } from '../firebase'
import { client } from '../graphql'

export type AppDrawerParamList = {
  AppStack: NavigatorScreenParams<AppStackParamList>
}

export type AppDrawerScreenProps<T extends keyof AppDrawerParamList> =
  DrawerScreenProps<AppDrawerParamList, T, 'MainDrawer'>

const MainDrawer = createDrawerNavigator<AppDrawerParamList>()

export default function Navigation() {
  const { user, setUserProfile, setCredentials } = useAuth()

  // Listen to user's auth state
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      console.log('user -->', user)
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
          client.setHeader('authorization', `Bearer ${token}`)
        } else {
          setCredentials({ user: null, token: null })
        }
      } catch (error) {
        console.log('auth error: ', error)
      }
    })

    return unsubscribe
  }, [client])

  // Listen to account doc in Firestore when user is authenticated (current user is available)
  useEffect(() => {
    if (!user) return

    const unsubscribe = listenToDocUpdate<NexusGenObjects['Account'] | null>({
      collectionName: accountsCollection,
      docId: user.uid,
      setterFn: setUserProfile,
      initialState: null,
    })

    return unsubscribe
  }, [user])

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
