'use strict';

import React, {Component} from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  TouchableHighlight,
  Linking,
  Dimensions
} from 'react-native';
import Viewfinder from './Viewfinder';
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import * as ImageUtil from '../../util/ImageUtil'
import * as Toast from '../common/Toast'
import Camera from 'react-native-camera'
import QRCode from '@remobile/react-native-qrcode-local-image'

const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height

class QRCodeReader extends Component {

  _onBarCodeRead(result){
    // console.log('_onBarCodeRead.result===', result)
    if (this.barCodeFlag) {
      this.barCodeFlag = false;
      if (this.props.readQRSuccess) {
        this.props.readQRSuccess(result.data)
      }
      // Actions.pop({
      //   refresh:{
      //     qRCode:result.data
      //   }
      // })
    }
  }

  recognitionQrcodeFromImage() {
    ImageUtil.openPicker({
      openType: 'gallery',
      cropping: false,
      multiple: false, //为了使用裁剪控制图片大小,必须关闭多选
      success: (response) => {
        // console.log('response.path====', response.path)
        let qrCodeImgPath = response.path
        if(Platform.OS === 'android') {
          if(response.path.startsWith('file://')) {
            qrCodeImgPath = response.path.slice(7)
          }
        }

        QRCode.decode(qrCodeImgPath, (error, result) => {
          // console.log('QRCode.decode.error====', error)
          // console.log('QRCode.decode.result====', result)
          if(error || !result) {
            if(this.props.readQRError) {
              this.props.readQRError('识别二维码失败')
            }
          }else {
            if (this.barCodeFlag) {
              this.barCodeFlag = false;
              if (this.props.readQRSuccess) {
                this.props.readQRSuccess(result)
              }
            }
          }
        })
      },
      fail: (response) => {
        if(this.props.readQRError) {
          this.props.readQRError(response.message)
        }
      }
    })
  }

  render() {
    this.barCodeFlag = true
    return (
      <View style={{flex:1}}>
        <Camera
          onBarCodeRead={(code)=>this._onBarCodeRead(code)}
          style={styles.camera}>
          <Viewfinder/>
        </Camera>
        <TouchableOpacity 
          style={{ position:'absolute', bottom:30, left: (PAGE_WIDTH/2 - 40), width:80, alignItems:'center'}}
          onPress={() =>{this.recognitionQrcodeFromImage()}}>
          <Text style={{color:'white'}}>从相册选</Text>
        </TouchableOpacity>
      </View>
      
    )
  }
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'pink',
    borderRadius: 3,
    padding: 32,
    width: 100,
    marginTop: 64,
    marginBottom: 64,
  },

  centerText: {
    flex: 1,
    fontSize: em(18),
    padding: 32,
    color: '#777',
  },

  textBold: {
    fontWeight: '500',
    color: '#000',
  },

  buttonText: {
    fontSize: em(21),
    color: 'rgb(0,122,255)',
  },

  buttonTouchable: {
    padding: 16,
  },
  camera: {
    flex: 1
  },
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  rectangle: {
    height: 250,
    width: 250,
    borderWidth: 2,
    borderColor: '#00FF00',
    backgroundColor: 'transparent'
  }
});


module.exports = QRCodeReader;