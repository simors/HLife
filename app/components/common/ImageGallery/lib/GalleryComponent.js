/**
 * Created by zachary on 2017/3/4.
 */

/**
 * Popup main
 */

import React, {
  Component,
  PropTypes
} from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  PixelRatio,
  Platform,
  Modal
} from 'react-native';
import Gallery from 'react-native-gallery'
import ImageGallery from '../index'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export default class GalleryComponent extends Component{

  constructor(props, context) {
    super(props, context);
  }

  close() {
    ImageGallery.close(ImageGallery.gallery)
  }

  androidHardwareBackPress() {
    this.close()
  }

  renderImageModal() {

    let {images, showIndex} = this.props

    if(!images || !images.length) {
      return null
    }

    return (
      <View>
        <Modal
          visible={true}
          transparent={false}
          animationType='fade'
          onRequestClose={()=>{this.androidHardwareBackPress()}}
        >
          <View style={{width: PAGE_WIDTH, height: PAGE_HEIGHT}}>
            <Gallery
              style={{flex: 1, backgroundColor: 'black'}}
              images={images}
              initialPage={showIndex || 0}
              onSingleTapConfirmed={() => this.close()}
            />
          </View>
        </Modal>
      </View>
    )
  }

  render() {
    return (
      <View>
        {this.renderImageModal()}
      </View>
    )
  }

};

let styles = StyleSheet.create({

});
