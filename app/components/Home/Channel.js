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
          <View style={[styles.thumbnailRight, this.props.thumbnailRightStyle]}>
            <Text style={[styles.thumbnailTitle, this.props.thumbnailTitleStyle]}>{this.props.thumbnailTitle}</Text>
            <Text style={[styles.thumbnailIntro, this.props.thumbnailIntroStyle]}>{this.props.thumbnailIntro}</Text>
          </View>
          <View style={[styles.thumbnailLeft, this.props.thumbnailLeftStyle]}>
            <Image style={[styles.thumbnailLeftImage, this.props.thumbnailLeftImageStyle]} source={this.props.sourceImage} />
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
    marginTop: 8,
    marginLeft: 8,
    marginBottom: 8,
    fontSize: em(15),
    color: '#636363'
  },
  thumbnailIntro: {
    marginLeft: 8,
    fontSize: em(10),
    color: '#ababab'
  }
})