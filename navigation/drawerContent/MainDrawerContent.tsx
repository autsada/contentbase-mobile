import { View, StyleSheet } from 'react-native'
import { DrawerContentScrollView } from '@react-navigation/drawer'
import type { DrawerContentComponentProps } from '@react-navigation/drawer'
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons'

import CustomDrawerItem from './CustomDrawerItem'
import DrawerHeader from './DrawerHeader'
import { theme } from '../../styles/theme'
import type { MainStackParamList } from '../MainStack'

interface Props extends DrawerContentComponentProps {}

export default function MainDrawerContent(props: Props) {
  const navigation = props.navigation

  function navigate(name: keyof MainStackParamList) {
    navigation.navigate('AppStack', {
      screen: 'MainTab',
      params: {
        screen: 'MainStack',
        params: {
          screen: name,
        },
      },
    })
  }

  return (
    <DrawerContentScrollView {...props}>
      <DrawerHeader navigation={navigation} />
      <CustomDrawerItem
        label='Profiles'
        icon={() => (
          <View style={styles.icon}>
            <Ionicons
              name='person-outline'
              size={24}
              color={theme.colors.black}
            />
          </View>
        )}
        onPress={() => navigate('Profiles')}
      />
      <CustomDrawerItem
        label='Collections'
        icon={() => (
          <View style={styles.icon}>
            <SimpleLineIcons
              name='layers'
              size={20}
              color={theme.colors.black}
            />
          </View>
        )}
        onPress={() => navigate('Collections')}
      />
      <CustomDrawerItem
        label='Bookmarks'
        icon={() => (
          <View style={styles.icon}>
            <Ionicons
              name='bookmark-outline'
              size={24}
              color={theme.colors.black}
            />
          </View>
        )}
        onPress={() => navigate('Bookmarks')}
      />
      <CustomDrawerItem
        label='Likes'
        icon={() => (
          <View style={styles.icon}>
            <SimpleLineIcons name='like' size={20} color={theme.colors.black} />
          </View>
        )}
        onPress={() => navigate('Likes')}
      />
    </DrawerContentScrollView>
  )
}

const styles = StyleSheet.create({
  icon: {
    width: 30,
    alignItems: 'center',
  },
})
