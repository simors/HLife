import React from 'react'
import {Platform} from 'react-native'
import ImagePicker from 'react-native-image-picker'

export function selectPhotoTapped(callbacks) {
  const options = {
    title: '',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '从相册选择',
    cancelButtonTitle: '取消',
    quality: 1.0,
    maxWidth: 500,
    maxHeight: 500,
    storageOptions: {
      skipBackup: true
    }
  }
  callbacks.start()

  ImagePicker.showImagePicker(options, (response) => {

    if (response.didCancel) {
      callbacks.cancelled()
      console.log('User canceled photo picker')
    } else if (response.error) {
      callbacks.failed()
      console.log('ImagePicker Error:', response.error)
    } else if (response.customButton) {
      console.log('User tapped custom button:', response.customButton)
    } else {
      let source
      if (Platform.OS === 'android') {
        source = {
          uri: response.uri,
          isStatic: true,
        }
      } else {
        source = {
          uri: response.uri.replace('file://', ''),
          isStatic: true,
          origURL: response.origURL,
        }
      }
      callbacks.succeed(source)
    }
  })
}
