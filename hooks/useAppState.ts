import { useRef, useState, useEffect } from 'react'
import { AppState } from 'react-native'

export function useAppState() {
  const appState = useRef(AppState.currentState)
  const [appStateVisible, setAppStateVisible] = useState(appState.current)

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    )
    return () => {
      if (subscription) {
        subscription.remove()
      }
    }
  }, [])

  function handleAppStateChange(nextAppState) {
    appState.current = nextAppState
    setAppStateVisible(appState.current)
  }

  return { appStateVisible }
}
