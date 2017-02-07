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
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'

const { width, height } = Dimensions.get('window')

export default class Marquee2 extends React.Component {
  
  static propTypes:{
    data: PropTypes.array.isRequired,
    intent: PropTypes.func
  }

  static defaultProps = {
    delay: 3000,
    autoplay: true,
    pageInfo: false,
    bullets: false,
    horizontal: false
  }
  
  constructor(props) {
    super(props)

    this.state = {
      size: { width, height: 0 },
    }
  }

  _onLayoutDidChange = (e) => {
    const layout = e.nativeEvent.layout
    this.setState({ size: { width: layout.width, height: layout.height } })
  }
  
  render() {
    let titleViews = <View />
    if(this.props.data) {
      titleViews = this.props.data.map((item, index) => {
        return (
          <TouchableOpacity
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
      <View style={{ flex: 1 }} onLayout={this._onLayoutDidChange}>
        <Carousel
          {...this.props}
          style={this.state.size}
        >
          {titleViews}
        </Carousel>
      </View>
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

