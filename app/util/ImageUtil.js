/**
 * Created by zachary on 2017/2/13.
 */
import React, {Component} from 'react'
import {
  Platform,
  Dimensions
} from 'react-native'

import ImagePicker from 'react-native-image-crop-picker';

export function openPicker(options) {
  const defaultOptions = {
    width: 300,
    height: 400,
    maxFiles: 9, //ios only
    cropping: false,
    multiple: false,//拍照必须传false,否则没有返回(ResultCollector类notifySuccess方法waitCounter为null)
    compressImageQuality: 1,
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
      if(parseInt(response.fileSize) >= 1024 * 1024) {
        defaultOptions.fail({
          message: '文件尺寸必须小于1M'
        })
      }else {
        defaultOptions.success(response)
      }
    }, (error)=> {
      defaultOptions.fail({
        message: '获取照片信息失败,请稍候再试'
      })
    }).catch((err) => {
      defaultOptions.fail({
        message: '获取信息失败,请稍候再试'
      })
    })
  }else {
    ImagePicker.openPicker(defaultOptions).then(response => {
      // console.log('openPicker.response====')
      // console.log(response)
      if(parseInt(response.fileSize) >= 1024 * 1024) {
        defaultOptions.fail({
          message: '文件尺寸必须小于1M'
        })
      }else {
        defaultOptions.success(response)
      }
    }, (error)=> {
      defaultOptions.fail({
        message: '照片类型不支持,请重新选择'
      })
    }).catch((err) => {
      defaultOptions.fail({
        message: '获取信息失败,请稍候再试'
      })
    })
  }
}
