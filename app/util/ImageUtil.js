/**
 * Created by zachary on 2017/2/13.
 */
import React, {Component} from 'react'
import {
  Platform,
  Dimensions
} from 'react-native'

import ImagePicker from 'react-native-image-crop-picker';

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export function openPicker(options) {
  const defaultOptions = {
    width: 750,
    height: 750,
    maxFiles: 9, //ios only
    cropping: true,
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
    defaultOptions.cropping = true //控制图片大小在1M以内
    defaultOptions.multiple = false //裁剪和多选必须互斥
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
    defaultOptions.cropping = true
    defaultOptions.multiple = false
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
