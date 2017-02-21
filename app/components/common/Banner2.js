/**
 * Created by zachary on 2017/2/7.
 */
'use strict';

import React from 'react'

import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  PropTypes
} from 'react-native'

import Carousel from './Carousel'

const { width, height } = Dimensions.get('window')

export default class Banner2 extends React.Component {

  static propTypes:{
    banners: PropTypes.array.isRequired,
    intent: PropTypes.func
  }

  static defaultProps = {
    delay: 3000,
    autoplay: true,
    pageInfo: false,
    bullets: true,
  }

  constructor(props) {
    super(props)

    if(props.banners) {
      this.images = props.banners.map((banner) => banner.image)
    }

    this.state = {
      size: { width, height: 0 },
    }
  }

  _onLayoutDidChange = (e) => {
    const layout = e.nativeEvent.layout
    this.setState({ size: { width: layout.width, height: layout.height } })
  }

  render() {
    let imageViews = <View />
    if(this.images) {
      imageViews = this.images.map((image, index) => {
        return (
          <TouchableOpacity
            style={[this.state.size]}
            key={'b_image_'+index}
            onPress={
              () => {
                this.props.intent && this.props.intent(index, this.props.banners)
              }
            }
          >
            <Image
              style={[this.state.size]}
              resizeMode="stretch"
              source={typeof(image) == 'string' ? {uri: image} : image}
            />
          </TouchableOpacity>
        )
      })
    }

    return (
      <View style={{ flex: 1 }} onLayout={this._onLayoutDidChange}>
        <Carousel
          {...this.props}
          style={this.state.size}
        >
          {imageViews}
        </Carousel>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
})
