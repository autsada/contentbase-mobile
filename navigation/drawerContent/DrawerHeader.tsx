import { View, StyleSheet, Image, Platform, Pressable } from 'react-native'
import type { DrawerNavigationHelpers } from '@react-navigation/drawer/lib/typescript/src/types'

import CloseIcon from '../../components/icons/CloseIcon'
import { TextLight, TextHeader5 } from '../../components/shared/Texts'
import RegularButton from '../../components/shared/RegularButton'
import { useAuth } from '../../store/hooks'
import { useAddressInfo } from '../../store/hooks'
import { useAppOverlay } from '../../store/hooks'
import { useCreateProfileModal } from '../../store/hooks/useCreateProfileModal'
import { theme } from './../../styles/theme'
import { Ionicons } from '@expo/vector-icons'

interface Props {
  navigation: DrawerNavigationHelpers
}

const OS = Platform.OS

export default function DrawerHeader({ navigation }: Props) {
  const { isAuthenticated, loggedInProfile } = useAuth()
  const { hasProfile } = useAddressInfo()
  const { openCreateProfileModal } = useCreateProfileModal()
  const { applyAppBackdrop } = useAppOverlay()

  function onRequestToCreateProfile() {
    if (!navigation) return

    applyAppBackdrop(true)
    // set profile modal state to show with the title
    openCreateProfileModal('Create My First Profile')
    // Navigate to profile screen
    navigation.navigate('AppStack', {
      screen: 'MainTab',
      params: {
        screen: 'MainStack',
        params: {
          screen: 'Profile',
        },
      },
    })
  }

  if (!isAuthenticated) return null

  return (
    <View style={styles.container}>
      {/* Use image url from cloud storage - imageURL */}
      {loggedInProfile && loggedInProfile.imageURI ? (
        <Image
          source={{ uri: loggedInProfile.imageURI }}
          style={styles.avatar}
        />
      ) : (
        <Ionicons
          name='person-circle-sharp'
          size={80}
          color={theme.colors.darkBlue}
        />
      )}

      <View
        style={{
          marginTop: 5,
          paddingLeft: 5,
        }}
      >
        {!hasProfile ? (
          <TextLight style={styles.handle}>You don't have profile.</TextLight>
        ) : loggedInProfile ? (
          <TextHeader5
            style={[
              styles.handle,
              { fontSize: theme.fontSize.base, color: theme.colors.black },
            ]}
          >
            @{loggedInProfile.handle}
          </TextHeader5>
        ) : (
          <TextLight style={styles.handle}>Please select a profile.</TextLight>
        )}
      </View>

      {!hasProfile && (
        <RegularButton
          title='Create Profile'
          containerStyle={styles.button}
          titleStyle={{ color: theme.colors.gray }}
          onPress={onRequestToCreateProfile}
        />
      )}

      {OS === 'android' && (
        <Pressable
          hitSlop={20}
          style={{ position: 'absolute', right: 10, top: 10 }}
          onPress={() => navigation.closeDrawer()}
        >
          <CloseIcon size={35} />
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.veryLightGray,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 999,
    resizeMode: 'cover',
  },
  handle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray,
  },
  button: {
    marginTop: 20,
    width: 150,
    height: 40,
    borderRadius: theme.radius['2xl'],
    backgroundColor: theme.colors.yellow,
  },
})
