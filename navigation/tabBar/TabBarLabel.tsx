import { StyleSheet } from 'react-native'
import { LabelPosition } from '@react-navigation/bottom-tabs/lib/typescript/src/types'

import { MainTabScreenProps } from '../MainTab'
import { TextBase, TextHeader5 } from '../../components/shared/Texts'
import { useRoutes } from '../../store/hooks/useRoutes'
import { theme } from '../../styles/theme'
import { stackRoutes } from './TabBarIcon'

interface Props
  extends MainTabScreenProps<
    'Home' | 'Posts' | 'Upload' | 'Wallet' | 'Notifications' | 'MainStack'
  > {
  focused: boolean
  color: string
  position: LabelPosition
}

export default function TabBarLabel({ route, focused }: Props) {
  const name = route.name
  const { currentRoute, previousRoute } = useRoutes()
  const isDrawerOpened = stackRoutes.includes(currentRoute as any)

  if (name === 'Upload') return null

  if (focused || (isDrawerOpened && name === previousRoute))
    return (
      <TextHeader5 style={[styles.text, { color: theme.colors.black }]}>
        {name}
      </TextHeader5>
    )

  return <TextBase style={styles.text}>{route.name}</TextBase>
}

const styles = StyleSheet.create({
  text: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray,
  },
})
