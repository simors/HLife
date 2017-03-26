/**
 * Created by yangyang on 2017/3/25.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'

const levelName = ['青铜级', '白银级', '黄金级', '钻石级', '皇冠级']
const levelIcon = [
  require('../../../assets/images/bronze_20.png'),
  require('../../../assets/images/silver_20.png'),
  require('../../../assets/images/gold_20.png'),
  require('../../../assets/images/diamond_20.png'),
  require('../../../assets/images/crown_20.png'),
]

export default class PromoterLevelIcon extends Component {
  constructor(props) {
    super(props)
  }

  renderLevelIcon(level) {
    if (level >= 1 && level <= 5) {
      return <Image style={{width: normalizeW(20), height: normalizeH(20)}} resizeMode="contain" source={levelIcon[level-1]} />
    } else {
      return <View/>
    }
  }

  renderLevelName(level) {
    return (
      <View style={styles.levelName}>
        {this.renderLevelIcon(level)}
        <Text style={styles.levelText}>{levelName[level-1]}</Text>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.backImg} source={require('../../../assets/images/pro_level_back.png')}>
          {this.renderLevelName(this.props.level)}
        </Image>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: normalizeW(188),
    height: normalizeH(39),
  },
  levelName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelText: {
    fontSize: em(17),
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: normalizeW(8),
  },
  backImg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})