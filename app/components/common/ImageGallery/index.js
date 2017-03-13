/**
 * Created by zachary on 2017/3/4.
 */
import React, {
  Component,
  PropTypes
} from 'react';
import {
  View,
  ActivityIndicator
} from 'react-native';
import RootSiblings from './lib/SiblingsManager';
import GalleryComponent from './lib/GalleryComponent';

class ImageGallery extends Component {

  static gallery = null

  static show = (options = {}) => {
    ImageGallery.gallery = new RootSiblings(
      <GalleryComponent
        {...options}
      />
    )
  }

  static close = (gallery, callback) => {
    if (gallery instanceof RootSiblings) {
      gallery.destroy();
    } else {
      console.warn(`ImageGallery.close expected a \`RootSiblings\` instance as argument.\nBut got \`${typeof gallery}\` instead.`);
    }
  }

  _gallery = null

  componentWillMount = () => {
    this._gallery = new RootSiblings(<GalleryComponent
      {...this.props}
    />)
  }

  componentWillReceiveProps = nextProps => {
    this._gallery.update(<GalleryComponent
      {...nextProps}
    />)
  }

  componentWillUnmount = () => {
    this._gallery.destroy()
  }

  render() {
    return null
  }
}

export {
  RootSiblings as Manager
};
export default ImageGallery