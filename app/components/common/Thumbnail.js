/**
 * Created by zachary on 2016/12/13.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image
} from 'react-native'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'

export default class Thumbnail extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.thumbnailWrap}>
        <TouchableOpacity style={[styles.thumbnailContainer, this.props.thumbnailContainerStyle]} onPress={this.props.onPress}>
          <View style={[styles.thumbnailLeft, this.props.thumbnailLeftStyle]}>
            <Image style={[styles.thumbnailLeftImage, this.props.thumbnailLeftImageStyle]} source={this.props.sourceImage} />
          </View>
          <View style={[styles.thumbnailRight, this.props.thumbnailRightStyle]}>
            <Text style={[styles.thumbnailTitle, this.props.thumbnailTitleStyle]}>{this.props.thumbnailTitle}</Text>
            <Text style={[styles.thumbnailIntro, this.props.thumbnailIntroStyle]}>{this.props.thumbnailIntro}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  thumbnailWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  thumbnailContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnailLeft: {
    width: 35,
    height: 35,
    marginRight: 10,
  },
  thumbnailLeftImage: {

  },
  thumbnailRight: {

  },
  thumbnailTitle: {
    marginBottom: 3,
    fontSize: em(18),
    color: '#636363'
  },
  thumbnailIntro: {
    fontSize: em(12),
    color: '#ababab'
  }
})