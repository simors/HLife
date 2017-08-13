/**
 * Created by yangyang on 2017/8/12.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native'
import Svg from './Svgs'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import {CachedImage} from "react-native-img-cache"
import {getThumbUrl} from '../../util/ImageUtil'

export default class Avatar extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    if (!this.props.src || this.props.src == "") {
      return (
        <View>
          <Svg size={this.props.size || normalizeW(32)} icon="user"/>
        </View>
      )
    }
    return (
      <View style={{
        width: this.props.size || normalizeW(32),
        height: this.props.size || normalizeW(32),
        borderRadius: this.props.size/2 || normalizeW(16),
        overflow: 'hidden',
      }}>
        <CachedImage mutable style={{
          width: this.props.size || normalizeW(32),
          height: this.props.size || normalizeW(32),
          borderRadius: this.props.size/2 || normalizeW(16),
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: '#FFF',
        }}
          source={{uri: getThumbUrl(this.props.src, this.props.size || normalizeW(32), this.props.size || normalizeW(32))}} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
})
