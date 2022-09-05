import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as MediaLibrary from 'expo-media-library'

export type GalleryState = {
  assets: MediaLibrary.Asset[]
  lastFetchedItemId: MediaLibrary.AssetRef
  hasMore: boolean
  fetchingAssets: boolean
  fetchingError: boolean
  loaded: boolean
}

const initialState: GalleryState = {
  assets: [],
  lastFetchedItemId: '',
  hasMore: false,
  fetchingAssets: false,
  fetchingError: false,
  loaded: false,
}

// Normal function (not thunk function)
export async function checkMediaLibraryPermission() {
  try {
    const { granted, canAskAgain } = await MediaLibrary.getPermissionsAsync()

    if (!granted) {
      if (canAskAgain) {
        // Not granted and can ask again, request permission
        const permission = await MediaLibrary.requestPermissionsAsync()

        return permission.granted
      }

      return granted
    }

    // Granted or Not granted and cannot ask again
    return granted
  } catch (error) {
    return false
  }
}

export const loadAssets = createAsyncThunk(
  'gallery/loadAssets',
  async (after?: MediaLibrary.AssetRef) => {
    try {
      const { assets, endCursor, hasNextPage } =
        await MediaLibrary.getAssetsAsync({
          first: 20,
          mediaType: ['photo', 'video'],
          after,
          sortBy: 'creationTime',
        })

      return { assets, endCursor, hasNextPage }
    } catch (error) {
      console.log('load assets error: ', error)
    }
  }
)

const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadAssets.pending, (state) => {
      state.fetchingAssets = true
      state.fetchingError = false
    })
    builder.addCase(loadAssets.fulfilled, (state, action) => {
      state.assets = state.assets.concat(action.payload.assets)
      state.lastFetchedItemId = action.payload.endCursor
      state.hasMore = action.payload.hasNextPage
      state.fetchingAssets = false
      state.fetchingError = false
      state.loaded = !action.payload.hasNextPage
    })
    builder.addCase(loadAssets.rejected, (state) => {
      state.fetchingAssets = false
      state.fetchingError = true
    })
  },
})

export default gallerySlice.reducer
