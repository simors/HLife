/**
 * Created by yangyang on 2017/8/13.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native'
import Svg from './Svgs'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'

const level = ['少尉', '中尉', '上尉', '少校', '中校', '上校', '大校', '少将', '中将', '上将', '少帅', '中帅', '大帅']

export default class PromoterIcon extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={[styles.container, this.props.isSmall ? {} : {width: normalizeW(127), height: normalizeH(30)}]}>
        {this.props.isSmall ? <View/> : <Text style={{fontSize: em(11), color: '#FFF', paddingLeft: normalizeW(8)}}>当前等级：</Text>}
        <Svg size={normalizeW(24)} icon="v"/>
        <Text style={[styles.levelName, this.props.isSmall ? {} : {fontSize: em(15), fontWeight: 'bold'}]}>
          {level[this.props.level-1]}
        </Text>
      </View>
    )
  }
}

PromoterIcon.defaultProps = {
  isSmall: true,
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FF9D4E',
    width: normalizeW(60),
    height: normalizeH(24),
    borderRadius: normalizeH(12),
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelName: {
    paddingLeft: normalizeW(2),
    fontSize: em(12),
    color: '#FFF',
  },
})
