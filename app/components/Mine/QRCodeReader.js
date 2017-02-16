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
} from 'react-native';
import Viewfinder from './Viewfinder';
import {Actions} from 'react-native-router-flux'
import Camera from 'react-native-camera'

class QRCodeReader extends Component {

  _onBarCodeRead(result){
    if (this.barCodeFlag) {
      this.barCodeFlag = false;
      Actions.pop({
        refresh:{
          qRCode:result.data
        }
      })
    }
  }

  render() {
    this.barCodeFlag = true
    return (
      <Camera
        onBarCodeRead={(code)=>this._onBarCodeRead(code)}
        style={styles.camera}>
        <Viewfinder/>
      </Camera>
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
    fontSize: 18,
    padding: 32,
    color: '#777',
  },

  textBold: {
    fontWeight: '500',
    color: '#000',
  },

  buttonText: {
    fontSize: 21,
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