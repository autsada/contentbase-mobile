import React, { useEffect } from 'react'
import { Platform, useWindowDimensions, StyleSheet } from 'react-native'
import type {
  NavigatorScreenParams,
  CompositeScreenProps,
} from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import type { DrawerScreenProps } from '@react-navigation/drawer'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import * as NavigationBar from 'expo-navigation-bar'

import type { AppStackParamList } from './AppStack'
import HeaderLeft from './headers/HeaderLeft'
import StackHeaderLeft from './headers/StackHeaderLeft'
import HeaderTitle from './headers/HeaderTitle'
import TabBarIcon from './tabBar/TabBarIcon'
import TabBarLabel from './tabBar/TabBarLabel'
import { TextHeader4 } from '../components/shared/Texts'
import HomeScreen from '../screens/HomeScreen'
import CollectionsScreen from '../screens/CollectionsScreen'
import UploadScreen from '../screens/UploadScreen'
import WalletScreen from '../screens/WalletScreen'
import ProfileScreen from '../screens/ProfileScreen'
import MainStack from './MainStack'
import type { MainStackParamList } from './MainStack'
import type { AppDrawerParamList } from '.'
import { useRoutes } from '../store/hooks/useRoutes'
import { theme } from '../styles/theme'
import { getBottomBarColor, getMainStackHeaderTitle } from '../utils/helpers'

export type MainTabParamList = {
  Home: undefined
  Collections: undefined
  Upload: undefined
  Wallet: undefined
  Profile: undefined
  MainStack: NavigatorScreenParams<MainStackParamList>
}

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    CompositeScreenProps<
      NativeStackScreenProps<AppStackParamList>,
      DrawerScreenProps<AppDrawerParamList>
    >
  >

interface Props {}

const Tab = createBottomTabNavigator<MainTabParamList>()
const OS = Platform.OS

export default function MainTab({}: Props) {
  const { height, width } = useWindowDimensions()
  const { setActiveRoute, setPreviousActiveRoute } = useRoutes()

  useEffect(() => {
    if (OS === 'android') {
      getBottomBarColor('#fff', 'dark')
    }
  }, [])

  return (
    <Tab.Navigator
      id='MainTab'
      screenOptions={() => ({
        tabBarStyle: {
          // Hide tabbar on medium/large screens of web platform
          display: OS === 'web' && width >= 768 ? 'none' : 'flex',
          height: OS !== 'web' ? (OS === 'android' ? 60 : 90) : undefined,
        },
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: theme.colors.white,
          height:
            OS === 'web'
              ? 60
              : height > width
              ? OS === 'android'
                ? 100
                : 120
              : 60,
        },
        headerTitleContainerStyle: {
          alignSelf: OS === 'web' ? 'center' : undefined,
        },
      })}
      backBehavior='history'
    >
      <Tab.Group
        screenOptions={(
          props: MainTabScreenProps<
            | 'Home'
            | 'Collections'
            | 'Upload'
            | 'Wallet'
            | 'Profile'
            | 'MainStack'
          >
        ) => ({
          headerLeft: () => <HeaderLeft navigation={props.navigation} />,
          headerTitle: () =>
            props.route.name === 'Home' ? (
              <HeaderTitle {...props} />
            ) : (
              <TextHeader4 style={styles.header}>
                {props.route.name}
              </TextHeader4>
            ),
          tabBarIcon: (labeProps) => <TabBarIcon {...props} {...labeProps} />,
          tabBarLabel: (labeProps) => <TabBarLabel {...props} {...labeProps} />,
        })}
      >
        <Tab.Screen
          name='Home'
          component={HomeScreen}
          listeners={({ route }) => ({
            focus: () => {
              setActiveRoute(route.name)
            },
            blur: () => {
              setPreviousActiveRoute(route.name)
            },
          })}
        />
        <Tab.Screen
          name='Collections'
          component={CollectionsScreen}
          listeners={({ route }) => ({
            focus: () => {
              setActiveRoute(route.name)
            },
            blur: () => {
              setPreviousActiveRoute(route.name)
            },
          })}
        />
        <Tab.Screen
          name='Upload'
          component={UploadScreen}
          listeners={({ route }) => ({
            focus: () => {
              setActiveRoute(route.name)
            },
            blur: () => {
              setPreviousActiveRoute(route.name)
            },
          })}
        />
        <Tab.Screen
          name='Wallet'
          component={WalletScreen}
          listeners={({ route }) => ({
            focus: () => {
              setActiveRoute(route.name)
            },
            blur: () => {
              setPreviousActiveRoute(route.name)
            },
          })}
        />
        <Tab.Screen
          name='Profile'
          component={ProfileScreen}
          listeners={({ route }) => ({
            focus: () => {
              setActiveRoute(route.name)
            },
            blur: () => {
              setPreviousActiveRoute(route.name)
            },
          })}
        />
      </Tab.Group>
      <Tab.Group
        screenOptions={() => ({
          tabBarButton: () => null,
        })}
      >
        <Tab.Screen
          name='MainStack'
          component={MainStack}
          options={(props) => ({
            headerLeft: () => <StackHeaderLeft {...(props as any)} />,
            headerTitle: () => (
              <TextHeader4 style={styles.header}>
                {getMainStackHeaderTitle(props.route as any)}
              </TextHeader4>
            ),
          })}
        />
      </Tab.Group>
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  header: {
    color: theme.colors.darkBlue,
  },
})
