import 'dotenv/config'
import { ConfigContext, ExpoConfig } from '@expo/config'

let httpApiEndpoint = ''
let wsApiEndpoint = ''

if (process.env.APP_ENV === 'production' || process.env.APP_ENV === 'staging') {
  httpApiEndpoint = 'https://contentbase-server-qyh5hhru7q-uc.a.run.app'
  wsApiEndpoint = 'wss://contentbase-server-qyh5hhru7q-uc.a.run.app'
} else {
  httpApiEndpoint = 'http://192.168.10.112:4000'
  wsApiEndpoint = 'ws://192.168.10.112:4000'
}

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'ContentBase',
  slug: 'ContentBase',
  version: '1.0.0',
  orientation: 'default',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    googleServicesFile: './GoogleService-Info.plist',
    bundleIdentifier: 'com.autsada.contentbase',
    buildNumber: '1.0.0',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FFFFFF',
    },
    googleServicesFile: './google-services.json',
    package: 'com.autsada.contentbase',
    versionCode: 1,
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    '@react-native-firebase/app',
    '@react-native-firebase/perf',
    '@react-native-firebase/crashlytics',
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static',
        },
      },
    ],
    [
      'expo-media-library',
      {
        photosPermission: 'Allow $(PRODUCT_NAME) to access your photos.',
        savePhotosPermission: 'Allow $(PRODUCT_NAME) to save photos.',
        isAccessMediaLocationEnabled: true,
      },
    ],
    [
      'with-rn-image-crop-picker',
      {
        PhotoLibraryUsageDescription:
          'Allow $(PRODUCT_NAME) to access your photos.',
        CameraUsageDescription: 'Allow $(PRODUCT_NAME) to access your camera.',
        // MicrophoneUsageDescription: 'Allow $(PRODUCT_NAME) to access your microphone',
      },
    ],
  ],
  extra: {
    httpApiEndpoint,
    wsApiEndpoint,
    eas: {
      projectId: '7c558b06-436f-42dc-911e-cbea12a74910',
    },
  },
})
