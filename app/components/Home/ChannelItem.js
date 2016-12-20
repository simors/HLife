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
import {em, normalizeW, normalizeH} from '../../util/Responsive'

export default class ChannelItem extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={[styles.body,this.props.bodyStyle]}>
        <TouchableOpacity style={[styles.channelContainer, this.props.channelContainerStyle]} onPress={this.props.onPress}>
          <View style={[styles.channelBottom, this.props.channelBottomStyle]}>
            <Image style={[styles.channelImage, this.props.channelImageStyle]} source={this.props.sourceImage} />
          </View>
          <View style={[styles.channelTop, this.props.channelTopStyle]}>
            <Text style={[styles.channelTitle, this.props.channelTitleStyle]}>{this.props.channelTitle}</Text>
            <Text style={[styles.channelIntro, this.props.channelIntroStyle]}>{this.props.channelIntro}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

ChannelItem.defaultProps = {
  // style
  bodyStyle:{},
  channelContainerStyle:{},
  channelBottomStyle:{},
  channelImageStyle:{},
  channelTopStyle:{},
  channelTitleStyle:{},
  channelIntroStyle:{},

  sourceImage:{}
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    borderWidth:1,
    borderColor:"#E5E5E5",
    justifyContent: 'center',
    alignItems: 'center'
  },
  channelContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelBottom: {
    flex:1,
    justifyContent: 'flex-end',
    alignSelf: 'flex-end'
  },
  channelImage: {
    width: normalizeW(159),
    height: normalizeH(113),
    marginBottom:normalizeH(7),
  },
  channelTop: {
    position:'absolute',
    left:0,
    right:0,
    top:0,
    height: normalizeH(60),
    backgroundColor:'rgba(255, 255, 255, 0.1)',
    alignItems: 'center'
  },
  channelTitle: {
    marginTop: normalizeH(15),
    fontSize: em(18),
    color: '#636363'
  },
  channelIntro: {
    marginTop: normalizeH(8),
    fontSize: em(12),
    color: '#636363'
  }
})