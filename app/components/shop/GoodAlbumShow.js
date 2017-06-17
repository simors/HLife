/**
 * Created by lilu on 2017/6/9.
 */
/**
 * Created by lilu on 2017/6/9.
 */
/**
 * Created by zachary on 2016/12/13.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Platform
} from 'react-native'
import {Actions} from 'react-native-router-flux'

import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import {CachedImage} from 'react-native-img-cache'
import shallowequal from 'shallowequal'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export default class GoodAlbumShow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imgModalShow: false,
      showImg: '',
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!shallowequal(this.props, nextProps)) {
      return true;
    }
    if (!shallowequal(this.state, nextState)) {
      return true;
    }
    return false;
  }



  render() {
    return (
      <TouchableWithoutFeedback
        style={[styles.shopCategory, this.props.containerStyle]}
        onPress={this.props.onPress}
      >
        <CachedImage
          mutable
          style={[{width: PAGE_WIDTH, height: normalizeH(264)}]}
          resizeMode="stretch"
          source={typeof(this.props.image) == 'string' ? {uri: this.props.image} : this.props.image}
        />
        {/*{this.renderImageModal()}*/}

        {/*<Text style={[styles.text, this.props.textStyle]}>{this.props.text}</Text>*/}
      </TouchableWithoutFeedback>

    )
  }
}

const styles = StyleSheet.create({
  shopCategory: {
    flex: 1,

  },
  image: {
    width: normalizeW(35),
    height: normalizeH(35)
  },
  text: {
    marginLeft: normalizeW(15),
    fontSize: em(17),
    color: THEME.colors.lessDark
  },

})