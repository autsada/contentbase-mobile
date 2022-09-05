import React from 'react'
import {
  View,
  StyleSheet,
  Modal,
  ViewStyle,
  StyleProp,
  Pressable,
  TextStyle,
} from 'react-native'

import SafeAreaContainer from './SafeAreaContainer'
import BackButton from './BackButton'
import CloseButton from './CloseButton'
import { TextHeader5, TextBase } from './Texts'
import { theme } from '../../styles/theme'

interface Props {
  children: React.ReactNode
  visible: boolean
  closeModal: () => void
  disableClose?: boolean
  animationType?: 'none' | 'fade' | 'slide'
  presentationStyle?:
    | 'fullScreen'
    | 'pageSheet'
    | 'formSheet'
    | 'overFullScreen'
  containerStyle?: StyleProp<ViewStyle>
  headerContainerStyle?: StyleProp<ViewStyle>
  title?: string
  leftButtonType?: 'back' | 'close'
  leftButtonContainerStyle?: StyleProp<ViewStyle>
  leftButtonTextStyle?: StyleProp<TextStyle>
  rightButton?: React.FunctionComponent
  supportedOrientations?: (
    | 'portrait'
    | 'portrait-upside-down'
    | 'landscape'
    | 'landscape-left'
    | 'landscape-right'
  )[]
}

export default function ModalWrapper({
  visible = false,
  closeModal,
  disableClose = false,
  animationType = 'slide',
  presentationStyle = 'overFullScreen',
  containerStyle = {},
  headerContainerStyle = {},
  title = '',
  children,
  leftButtonType = 'back',
  rightButton,
  leftButtonContainerStyle = {},
  leftButtonTextStyle = {},
  supportedOrientations = ['portrait'],
}: Props) {
  const RightButton = rightButton

  return (
    <Modal
      visible={visible}
      animationType={animationType}
      presentationStyle={presentationStyle}
      supportedOrientations={supportedOrientations}
    >
      <View style={[styles.container, containerStyle]}>
        <SafeAreaContainer>
          <View style={[styles.header, headerContainerStyle]}>
            <Pressable
              hitSlop={20}
              disabled={disableClose}
              onPress={closeModal}
              style={[
                styles.side,
                { alignItems: 'flex-start' },
                leftButtonContainerStyle,
              ]}
            >
              {leftButtonType === 'back' ? (
                <BackButton iconStyle={leftButtonTextStyle} />
              ) : (
                <CloseButton iconStyle={leftButtonTextStyle} />
              )}
            </Pressable>
            <View>
              <TextHeader5>{title}</TextHeader5>
            </View>
            <Pressable
              hitSlop={20}
              style={[styles.side, { alignItems: 'flex-end' }]}
            >
              {!rightButton ? null : <RightButton />}
            </Pressable>
          </View>

          {children}
        </SafeAreaContainer>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.veryLightGray,
  },
  side: {
    width: 50,
    height: '100%',
    justifyContent: 'center',
  },
})
