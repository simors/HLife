/**
 * Created by yangyang on 2016/12/23.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native'
import ImageGroupViewer from './Input/ImageGroupViewer'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export default class TopicImageViewer extends Component {
  constructor(props) {
    super(props)
  }

  renderImages() {
    if (this.props.images) {
      let imgCnt = this.props.images.length
      if (1 == imgCnt) {
        return (
          <ImageGroupViewer images={this.props.images} imageLineCnt={1}
                            imageStyle={{width: PAGE_WIDTH/2, height: PAGE_HEIGHT/3}} />
        )
      } else if (2 == imgCnt || 4 == imgCnt) {
        return (
          <ImageGroupViewer images={this.props.images} imageLineCnt={2} />
        )
      } else {
        return (
          <ImageGroupViewer images={this.props.images} imageLineCnt={3} />
        )
      }
    }
    return <View/>
  }

  render() {
    return(
      <View>
        {this.renderImages()}
      </View>
    )
  }
}