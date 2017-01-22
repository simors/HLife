/**
 * Created by zachary on 2016/12/16.
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

import Swiper from './Swiper'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'

export default class Marquee extends React.Component {
  
  static propTypes:{
    data: PropTypes.array.isRequired,
    intent: PropTypes.func,
    onMomentumScrollEnd: PropTypes.func
    }
  
  constructor(props) {
    super(props)
  }
  
  render() {
    let titleViews = <View />
    if(this.props.data) {
      titleViews = this.props.data.map((item, index) => {
        return (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.titleWrap}
            key={'b_title_'+index}
            onPress={() => {
              this.props.intent && this.props.intent(index, this.props.data)
            }
          }
          >
            <Text numberOfLines={1} style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )
      })
    }
    
    return (
      <Swiper
        {...this.props}
        style={styles.container}
        autoplay={true}
        horizontal={false}
        showPagination={false}
        whRatio={1.9}
        autoplayTimeout={3}
        loop={true}
        useScrollView={false}
      >
        {titleViews}
      </Swiper>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  },
  titleWrap: {
    justifyContent: 'center'
  },
  title: {
    fontSize: em(14),
    color: THEME.colors.gray
  },
})

