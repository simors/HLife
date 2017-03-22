'use strict';

import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  View,
  TextInput
} from 'react-native'
import QRCode from 'react-native-qrcode'
import THEME from '../../constants/themes/theme1'

export default class Qrcode extends Component {

  render() {
    return (
      <View style={styles.container}>

        <QRCode
          value={this.props.data}
          size={200}
          bgColor={THEME.base.mainColor}
          fgColor='white'/>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    borderRadius: 5,
    padding: 5,
  }
});