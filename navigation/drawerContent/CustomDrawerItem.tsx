import React from 'react'
import { DrawerItem } from '@react-navigation/drawer'

import type { MainStackParamList } from '../MainStack'
import { TextBase } from '../../components/shared/Texts'
import { theme } from '../../styles/theme'

interface Props {
  label: keyof MainStackParamList
  icon: (props: {
    focused: boolean
    size: number
    color: string
  }) => React.ReactNode
  onPress: () => void
}

export default function CustomDrawerItem({ label, icon, onPress }: Props) {
  return (
    <DrawerItem
      label={() => (
        <TextBase style={{ fontSize: theme.fontSize.md }}>{label}</TextBase>
      )}
      icon={icon}
      onPress={onPress}
      activeBackgroundColor={theme.colors.lightBlue}
      pressColor={theme.colors.lightBlue}
    />
  )
}
