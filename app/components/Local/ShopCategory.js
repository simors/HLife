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
  Image,
  Platform
} from 'react-native'
import {Actions} from 'react-native-router-flux'

import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'

export default class ShopCategories extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={[styles.shopCategory, this.props.containerStyle]}>
        <Image
          style={[styles.image, this.props.imageStyle]}
          source={typeof(this.props.imageSource) == 'string'
              ? {uri: this.props.imageSource} : this.props.imageSource}
        />
        <Text style={[styles.text, this.props.textStyle]}>{this.props.text}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  shopCategory: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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