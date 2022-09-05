import ImagePicker from 'react-native-image-crop-picker'
import type { ImageOrVideo, Options } from 'react-native-image-crop-picker'

import { theme } from '../styles/theme'

const baseOptions: Options = {
  includeExif: true,
  cropperStatusBarColor: 'black',
  cropperToolbarColor: 'black',
  cropperActiveWidgetColor: theme.colors.veryLightGray,
  cropperToolbarWidgetColor: theme.colors.veryLightGray,
  cropperChooseText: 'Next',
  enableRotationGesture: true,
  sortOrder: 'asc',
  loadingLabelText: 'Loading...',
  useFrontCamera: true,
}

export function pickProfileImage() {
  return ImagePicker.openPicker({
    ...baseOptions,
    mediaType: 'photo',
    width: 300,
    height: 300,
    cropping: true,
    cropperCircleOverlay: true,
  })
}

export function takeProfileImage() {
  return ImagePicker.openCamera({
    ...baseOptions,
    mediaType: 'photo',
    width: 300,
    height: 300,
    cropping: true,
    cropperCircleOverlay: true,
    useFrontCamera: true,
    // compressVideoPreset: 'MediumQuality',
  })
}
