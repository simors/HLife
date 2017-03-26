/**
 * Created by yangyang on 2016/12/21.
 */
import React, {Component} from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Platform,
} from 'react-native'

import {selectPhotoTapped} from '../../util/ImageSelector'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'

export default class CustomSend extends Component {

  sendImage() {
    selectPhotoTapped({
      start: () => {},
      failed: () => {},
      cancelled: () => {},
      succeed: (source) => {
        let file = this.getImageUrl(source)
        this.props.onSend({image: file.fileUri, fileName: file.fileName}, true);
      },
    })
  }

  getImageUrl(source) {
    let fileUri = ''
    if (Platform.OS === 'ios') {
      fileUri = fileUri.concat('file://')
    }
    fileUri = fileUri.concat(source.uri)
    let fileName = source.uri.split('/').pop()
    return {fileUri, fileName}
  }

  render() {
    if (this.props.text.trim().length > 0) {
      return (
        <TouchableOpacity
          style={[styles.container, this.props.containerStyle]}
          onPress={() => {
            this.props.onSend({text: this.props.text.trim()}, true);
          }}
        >
          <Text style={[styles.text, this.props.textStyle]}>{this.props.label}</Text>
        </TouchableOpacity>
      )
    }
    return (
      <TouchableOpacity
        style={[styles.container, this.props.containerStyle]}
        onPress={() => {
          this.sendImage()
        }}
      >
        <Text style={[styles.text, this.props.textStyle]}>图片</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    justifyContent: 'flex-end',
    backgroundColor: '#50E3C2',
    borderRadius: 5,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: em(17),
    backgroundColor: 'transparent',
    marginBottom: 12,
    marginLeft: 10,
    marginRight: 10,
  },
});

CustomSend.defaultProps = {
  text: '',
  onSend: () => {},
  label: '发送',
  containerStyle: {},
  textStyle: {},
};