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
import {uploadFile, batchedUploadFiles} from '../api/leancloud/fileUploader'
import Loading from '../components/common/Loading'
import AV from 'leancloud-storage'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export function openPicker(options) {
  const defaultOptions = {
    width: Math.floor(PAGE_WIDTH * 2),
    height: Math.floor(PAGE_WIDTH * 2),
    compressImageMaxHeight: 750,
    compressImageMaxWidth: 750,
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
      if(parseInt(response.size) >= 1024 * 1024) {
        defaultOptions.fail({
          message: '图片尺寸必须小于1M'
        })
        return
      }
      defaultOptions.success(response)
    }, (error)=> {
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

export function batchUploadImgs(uris) {
  let uploadImgs = []
  if (!uris || uris.length == 0) {
    return new Promise((resolve) => {
      resolve([])
    })
  }
  uris.forEach((uri) => {
    let isImage = checkIsImage(uri)
    if(!isImage){
      let err={message:'禁止上传非图片文件，请上传图片文件'}
      throw err
    }
    let file = {}
    file.fileName = uri.split('/').pop()
    let fileUri = ''
    if (Platform.OS === 'ios' && !uri.startsWith('http://') && !uri.startsWith('https://')) {
      fileUri = fileUri.concat('file://')
    }
    file.fileUri = fileUri.concat(uri)
    uploadImgs.push(file)
  })
  if(isUploading) {
    return new Promise((resolve) => {
      resolve()
    })
  }
  isUploading = true
  let loading = Loading.show()
  let uploadPayload = {
    uploadFiles: uploadImgs,
  }
  return batchedUploadFiles(uploadPayload).then((leanUrls) => {
    let leanImgUrls = []
    leanUrls.forEach((leanUrl) => {
      leanImgUrls.push(leanUrl.savedPos)
    })
    Loading.hide(loading)
    isUploading = false
    return leanImgUrls
  }, (error)=>{
    isUploading = false
    return error
  }).catch((err) => {
    isUploading = false
    throw err
  })
}

export function batchUploadImgs2(uris) {
  return new Promise((resolve, reject)=>{
    if(!uris || !uris.length) {
      resolve([])
    }else{
      batchUploadImgs(uris).then(results=>{
        resolve(results)
      }).catch((error)=>{
        throw error
      })
    }
  })
}

export function uploadImg(source) {
  let fileUri = ''
  if (Platform.OS === 'ios'  && !source.uri.startsWith('http://') && !source.uri.startsWith('https://')) {
    fileUri = fileUri.concat('file://')
  }

    let isImage = checkIsImage(source.uri)
      if(!isImage&&typeof source.error == 'function') {
        source.error('非图片文件无法上传，请重新上传图片！')
        return
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
    isUploading = false
    if(!source.hideLoading) {
      Loading.hide(loading)
    }
    let leanImgUrl = saved.savedPos
    if(typeof source.success == 'function') {
      source.leanImgUrl = leanImgUrl
      source.success(source)
    }
  }).catch((error) => {
    console.log('upload failed:', error)
    isUploading = false
    if(!source.hideLoading) {
      Loading.hide(loading)
    }
    if(typeof source.error == 'function') {
      source.error(error)
    }
  })
}

export function uploadImg2(uri, hideLoading) {
  return new Promise((resolve, reject)=>{
    let isImage = checkIsImage(uri)
    if(!isImage) {
      isUploading = false
      reject({message:'禁止上传非图片文件，请重新上传文件！'})
    }
    let fileUri = ''
    if (Platform.OS === 'ios' && !uri.startsWith('http://') && !uri.startsWith('https://')) {
      fileUri = fileUri.concat('file://')
    }
    fileUri = fileUri.concat(uri)

    let fileName = uri.split('/').pop()
    let uploadPayload = {
      fileUri: fileUri,
      fileName: fileName
    }

    let loading = null
    if(!hideLoading) {
      if(isUploading) {
        return
      }
      isUploading = true
      loading = Loading.show()
    }

    // console.log('uploadImg2.uploadPayload===', uploadPayload)
    uploadFile(uploadPayload).then((saved)=>{
      if(!hideLoading) {
        Loading.hide(loading)
      }
      isUploading = false
      // console.log('uploadImg2.saved===', saved.savedPos)
      let leanImgUrl = saved.savedPos
      resolve(leanImgUrl)
    }, (reason)=>{
      isUploading = false
      reject()
    })
  })
}

export async function uploadImg3(uri, hideLoading) {
  try{
    let fileUri = ''
    if (Platform.OS === 'ios'  && !uri.startsWith('http://') && !uri.startsWith('https://')) {
      fileUri = fileUri.concat('file://')
    }
    fileUri = fileUri.concat(uri)

    let fileName = uri.split('/').pop()
    let uploadPayload = {
      fileUri: fileUri,
      fileName: fileName
    }

    let loading = null
    if(!hideLoading) {
      if(isUploading) {
        return
      }
      isUploading = true
      loading = Loading.show()
    }
    let saved = await uploadFile(uploadPayload)

    if(!hideLoading) {
      isUploading = false
      Loading.hide(loading)
    }
    // console.log('uploadFile.saved===', saved.savedPos)
    let leanImgUrl = saved.savedPos
    return leanImgUrl
  }catch(error){
    return false
  }
}

export function getThumbUrl(uri, width, height) {
  if (!uri || uri.length == 0) {
    return ""
  }
  let filename = uri.split('/').pop()
  let file = AV.File.withURL(filename, uri)
  let thumb = file.thumbnailURL(width*2, height*2)
  return thumb
}

export function checkIsImage(uri) {
    if(uri&&uri!=''){
      let fileType = uri.substr(uri.lastIndexOf(".")).toLowerCase()
      if (fileType != '.jpg' && fileType != '.png' && fileType != '.bmp' && fileType != '.gif' && fileType != '.jpeg') {
        return false
      }
    }
  return true
}