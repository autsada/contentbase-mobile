import { DrawerContentScrollView } from '@react-navigation/drawer'
import type { DrawerContentComponentProps } from '@react-navigation/drawer'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'

import CustomDrawerItem from './CustomDrawerItem'
import DrawerHeader from './DrawerHeader'
import type { MainStackParamList } from '../MainStack'
import { theme } from '../../styles/theme'

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
        label='Videos'
        icon={() => (
          <MaterialIcons
            name='video-library'
            size={24}
            color={theme.colors.black}
          />
        )}
        onPress={() => navigate('Videos')}
      />
      <CustomDrawerItem
        label='Posts'
        icon={() => (
          <MaterialCommunityIcons
            name='post-outline'
            size={24}
            color={theme.colors.black}
          />
        )}
        onPress={() => navigate('Posts')}
      />
      <CustomDrawerItem
        label='Following'
        icon={() => (
          <MaterialIcons name='favorite' size={24} color={theme.colors.black} />
        )}
        onPress={() => navigate('Following')}
      />
      <CustomDrawerItem
        label='Bookmarks'
        icon={() => (
          <MaterialIcons name='bookmark' size={24} color={theme.colors.black} />
        )}
        onPress={() => navigate('Bookmarks')}
      />
    </DrawerContentScrollView>
  )
}
