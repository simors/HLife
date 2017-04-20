/**
 * Created by wanpeng on 2017/4/20.
 */
import React, {Component} from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  NativeModules,
  Platform
} from 'react-native'

import {Actions} from 'react-native-router-flux'

const shareNative = NativeModules.shareComponent


export default class Share extends Component {
  constructor(props) {
    super(props)
  }

  renderShareCell = () => {

  }

  shareUrl(plateform, url, title, description, thumbURL) {
    shareNative.shareURLWithPlate(plateform, {title: title, thumbURL: thumbURL, URL: url, descr: description})
  }

  shareUrlToWx = () => {
    this.shareUrl()
  }

  render() {
    return(
      <TouchableOpacity style={styles.shareMain} activeOpacity={1} onPress={() => {}}>
        <View>
          <Text>分享到</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  shareMain: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center'
  },
})