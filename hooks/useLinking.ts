import * as Linking from 'expo-linking'

export function useLinking() {
  async function openSettings() {
    try {
      await Linking.openSettings()
    } catch (error) {
      console.log('linking error: ', error)
    }
  }

  return { openSettings }
}
