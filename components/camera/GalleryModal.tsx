import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import {
  View,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  useWindowDimensions,
} from 'react-native'
import * as MediaLibrary from 'expo-media-library'

import ModalWrapper from '../shared/ModalWrapper'
import { TextBase, TextHeader4 } from '../shared/Texts'
import { useAppDispatch } from '../../store/hooks'
import { loadAssets } from '../../store/features/gallery/gallerySlice'
import { useGallery } from '../../store/hooks/useGallery'
import { theme } from '../../styles/theme'

interface Props {
  title?: string
  modalVisible: boolean
  closeModal: () => void
  mediaType?: MediaLibrary.MediaTypeValue | MediaLibrary.MediaTypeValue[]
  selectAsset: Dispatch<SetStateAction<MediaLibrary.Asset | undefined>>
}

const NUM_COLUMNS = 3
const ITEM_SEPARATOR_HEIGHT = 1 // pixel

export default function GalleryModal({
  title = 'Gallery',
  modalVisible,
  closeModal,
  mediaType,
  selectAsset,
}: Props) {
  // const { assets, hasMore, lastFetchedItemId } = useGallery()
  // const dispatch = useAppDispatch()

  // // Assets to be displayed depending on the mediaType prop
  // const displayedAssets = !mediaType
  //   ? assets
  //   : typeof mediaType === 'string'
  //   ? assets.filter((asset) => asset.mediaType === mediaType)
  //   : typeof mediaType === 'object'
  //   ? assets.filter((asset) => mediaType.includes(asset.mediaType))
  //   : []

  // const { width } = useWindowDimensions()
  // const itemWidth = width / NUM_COLUMNS
  // const itemHeight = itemWidth * 1.1

  // function loadMoreAssets() {
  //   if (!hasMore || !lastFetchedItemId) return

  //   dispatch(loadAssets(lastFetchedItemId))
  // }

  // function renderItem({ item }: { item: MediaLibrary.Asset }) {
  //   return (
  //     <Pressable
  //       style={[styles.item, { width: itemWidth, height: itemHeight }]}
  //       onPress={selectAsset.bind(undefined, item)}
  //     >
  //       <Image style={styles.photo} source={{ uri: item.uri }} />
  //     </Pressable>
  //   )
  // }
  // function ItemSeparator() {
  //   return (
  //     <View
  //       style={{
  //         height: ITEM_SEPARATOR_HEIGHT,
  //         backgroundColor: 'white',
  //       }}
  //     />
  //   )
  // }
  // const keyExtractor = (item: MediaLibrary.Asset) => item.id
  // function getItemLayout(data: any, index: number) {
  //   return {
  //     length: itemHeight + ITEM_SEPARATOR_HEIGHT,
  //     offset: (itemHeight + ITEM_SEPARATOR_HEIGHT) * index,
  //     index,
  //   }
  // }

  return (
    <ModalWrapper
      visible={modalVisible}
      title={title}
      leftButtonType='close'
      closeModal={closeModal}
    >
      {/* <View style={styles.container}>
        {assets.length === 0 ? (
          <View style={styles.info}>
            <TextHeader4
              style={{ fontSize: theme.fontSize.xl, color: theme.colors.gray }}
            >
              No Photos
            </TextHeader4>
          </View>
        ) : (
          <FlatList
            data={displayedAssets}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            numColumns={NUM_COLUMNS}
            ItemSeparatorComponent={ItemSeparator}
            initialNumToRender={40}
            onEndReached={loadMoreAssets}
          />
        )}
      </View> */}
    </ModalWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0.5,
  },
  photo: { width: '100%', height: '100%', resizeMode: 'cover' },
})
