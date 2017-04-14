/**
 * Created by yangyang on 2017/4/12.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Image,
  Text,
} from 'react-native'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'

export default class PromoterAgentIcon extends Component {
  constructor(props) {
    super(props)
  }

  renderAreaView() {
    if (this.props.identity == 1) {
      return (
        <View style={styles.areaView}>
          <Text style={styles.areaText}>{this.props.province}</Text>
        </View>
      )
    } else if (this.props.identity == 2) {
      return (
        <View style={styles.areaView}>
          <Text style={styles.areaText}>{this.props.city}</Text>
        </View>
      )
    } else if (this.props.identity == 3) {
      return (
        <View style={styles.areaView}>
          <Text style={styles.areaText}>{this.props.district}</Text>
        </View>
      )
    }
  }

  renderLevelTextView() {
    let agentName = ''
    if (this.props.identity > 1) {
      agentName = '区域代理'
    } else {
      agentName = '区域总代理'
    }
    return (
      <View style={styles.levelView}>
        <Text style={styles.agentLevelText}>{agentName}</Text>
      </View>
    )
  }

  render() {
    return (
      <View>
        <Image style={styles.imgStyle} resizeMode='contain' source={require('../../../assets/images/general_agent.png')}>
          {this.renderAreaView()}
          {this.renderLevelTextView()}
        </Image>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  imgStyle: {
    width: normalizeW(188),
    height: normalizeH(127),
    alignItems: 'center',
  },
  areaView: {
    paddingTop: normalizeH(46),
  },
  areaText: {
    fontSize: em(25),
    fontWeight: 'bold',
    color: THEME.base.mainColor,
  },
  levelView: {
    paddingTop: normalizeH(25),
  },
  agentLevelText: {
    fontSize: em(17),
    color: '#FFF',
  },
})