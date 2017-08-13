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
      <View style={styles.container}>
        <Svg size={normalizeW(24)} icon="v"/>
        <Text style={styles.levelName}>{level[this.props.level-1]}</Text>
      </View>
    )
  }
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
