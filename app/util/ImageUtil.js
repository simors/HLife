/**
 * Created by zachary on 2017/2/13.
 */
import React, {Component} from 'react'
import {
  Platform,
  Dimensions,
  Image
} from 'react-native'

import ImagePicker from 'react-native-image-crop-picker';
import {uploadFile} from '../api/leancloud/fileUploader'
import Loading from '../components/common/Loading'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export function openPicker(options) {
  const defaultOptions = {
    width: 750,
    height: 750,
    maxFiles: 9, //ios only
    cropping: true,//控制图片大小在1M以内, 裁剪和多选必须互斥
    compressImageQuality: 1,
    multiple: false,//拍照必须传false,否则没有返回(ResultCollector类notifySuccess方法waitCounter为null)
    openType: 'camera', //enum('gallery', 'camera')
    success: () =>{},
    fail: () =>{},
  }
  Object.assign(defaultOptions, options)

  //文件过大,会导致Modal加载图片报错(E_GET_SIZE_FAILURE)
  //限制图片文件1M以内
  if('camera' == defaultOptions.openType) {
    ImagePicker.openCamera(defaultOptions).then(response => {
      // console.log('openCamera.response====')
      // console.log(response)
      if(parseInt(response.size) >= 1024 * 1024) {
        defaultOptions.fail({
          message: '图片尺寸必须小于1M'
        })
        return
      }
      defaultOptions.success(response)
    }, (error)=> {
      // console.log(error)
      // console.log(error.code)
      // console.log(error.message)
      if('E_PICKER_CANCELLED' != error.code) { //用户取消
        defaultOptions.fail({
          message: '获取照片信息失败,请稍候再试'
        })
      }
    }).catch((err) => {
      defaultOptions.fail({
        message: '获取信息失败,请稍候再试'
      })
    })
  }else {
    ImagePicker.openPicker(defaultOptions).then(response => {
      // console.log('openPicker.response====')
      // console.log(response)
      if(defaultOptions.multiple) {
        if(response && response.length) {
          for(let i = 0; i < response.length; i++) {
            if(parseInt(response[i].size) >= 1024 * 1024) {
              defaultOptions.fail({
                message: '图片尺寸必须小于1M'
              })
              return
            }
          }
          defaultOptions.success(response)
        }
      }else {
        if(parseInt(response.size) >= 1024 * 1024) {
          defaultOptions.fail({
            message: '图片尺寸必须小于1M'
          })
          return
        }
        defaultOptions.success(response)
      }
    }, (error)=> {
      // console.log(error)
      // console.log(error.code)
      // console.log(error.message)
      if('E_PICKER_CANCELLED' != error.code) { //用户取消
        defaultOptions.fail({
          message: '照片类型不支持,请重新选择'
        })
      }
    }).catch((err) => {
      defaultOptions.fail({
        message: '获取信息失败,请稍候再试'
      })
    })
  }
}

export function getImageSize(options) {
  Image.getSize(options.uri, (width, height) => {
    let imgWidth = width
    let imgHeight = height
    let maxWidth = PAGE_WIDTH - 15
    if (width > maxWidth) {
      imgWidth = maxWidth
      imgHeight = Math.floor((imgWidth / width) * height)
    }
    if(typeof options.success == 'function') {
      options.success(imgWidth, imgHeight)
    }
  })
}

let isUploading = false
export function uploadImgs(options) {
  let leanImgUrls = []
  if(options && options.uris && options.uris.length) {
    if(isUploading) {
      return
    }
    isUploading = true
    let loading = Loading.show()
    uploadImg({
      hideLoading: true,
      uri: options.uris[0],
      index: 0,
      success: (response) => {
        leanImgUrls.push(response.leanImgUrl)
        if(response.index < options.uris.length-1) {
          response.index += 1
          response.uri = options.uris[response.index]
          uploadImg(response)
        }else {
          isUploading = false
          Loading.hide(loading)
          if(options.success) {
            options.success(leanImgUrls)
          }
        }
      }
    })
  }
}

export function uploadImg(source) {
  let fileUri = ''
  if (Platform.OS === 'ios') {
    fileUri = fileUri.concat('file://')
  }
  fileUri = fileUri.concat(source.uri)

  let fileName = source.uri.split('/').pop()
  let uploadPayload = {
    fileUri: fileUri,
    fileName: fileName
  }
  // console.log('uploadFile.uploadPayload===', uploadPayload)
  let loading = null
  if(!source.hideLoading) {
    if(isUploading) {
      return
    }
    isUploading = true
    loading = Loading.show()
  }
  uploadFile(uploadPayload).then((saved) => {
    if(!source.hideLoading) {
      isUploading = false
      Loading.hide(loading)
    }
    // console.log('uploadFile.saved===', saved.savedPos)
    let leanImgUrl = saved.savedPos
    if(typeof source.success == 'function') {
      source.leanImgUrl = leanImgUrl
      source.success(source)
    }
  }).catch((error) => {
    console.log('upload failed:', error)
    if(!source.hideLoading) {
      isUploading = false
      Loading.hide(loading)
    }
  })
}
