'use strict';

import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  NavigatorIOS,
  TouchableOpacity,
  TouchableHighlight,
  Linking,
} from 'react-native';

import {Actions} from 'react-native-router-flux'
import QRCodeScanner from './QRCodeScanner';

class QRCodeReader extends Component {
  onSuccess(e) {
    console.log(e)
    Actions.pop({
      refresh:{
        qRCode:e.data
      }
    })
  }

  render() {
    return (
      <NavigatorIOS
        initialRoute={{
          component: QRCodeScanner,
          title: 'Scan Code',
          passProps: {
            onRead: this.onSuccess.bind(this),
            topContent: <Text style={styles.centerText}>扫描二维码</Text>,
            bottomContent: <TouchableOpacity style={styles.buttonTouchable} onPress= {()=> {Actions.pop()}}><Text style={styles.buttonText}>取消</Text></TouchableOpacity>
          }
        }}
        style={{flex: 1}}
      />
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
});


module.exports = QRCodeReader;