/**
 * Created by zachary on 2016/12/21.
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

export default class PickedTopic extends Component {
  constructor(props) {
    super(props)
  }

  renderBadge() {
    if(this.props.showBadge) {
      return (
        <View style={styles.badge}>
          <Text style={styles.badgeTxt}>每日精选</Text>
        </View>
      )
    }
  }

  render() {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <View style={styles.titleImageWrap}>
          <TouchableOpacity onPress={()=>{}}>
            <View style={styles.titleWrap}>
              <Text style={styles.title}>农村豪气冲天的楼房，致在城市蜗居的你</Text>
            </View>
            <View style={styles.imagesWrap}>
              <Image style={styles.image} source={{uri: "http://www.qq745.com/uploads/allimg/141106/1-141106153Q5.png"}}/>
              <Image style={styles.image} source={{uri: "http://img1.3lian.com/2015/a1/53/d/198.jpg"}}/>
              <Image style={styles.image} source={{uri: "http://img1.3lian.com/2015/a1/53/d/200.jpg"}}/>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.introWrap}>
          <TouchableOpacity onPress={()=>{}}>
            <Text style={styles.intro}>白天不懂夜的黑</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tipWrap}>
          <View style={styles.oneFlex}>
            <View style={styles.time}>
              <Text style={styles.tipTxt}>刚刚</Text>
            </View>
            <View style={styles.location}>
              <Text style={styles.tipTxt}>长沙</Text>
            </View>
          </View>
          <View style={[styles.oneFlex, styles.tipRight]}>
            <View>
              <TouchableOpacity style={styles.heart} onPress={()=>{}}>
                <Image source={require("../../assets/images/like_unselect.png")}/>
                <Text style={styles.tipTxt}>75</Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity style={styles.comments} onPress={()=>{}}>
                <Image source={require("../../assets/images/comments_unselect.png")}/>
                <Text style={styles.tipTxt}>8</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {this.renderBadge()}
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    height: normalizeH(220),
    justifyContent: 'space-around',
    backgroundColor: '#fff'
  },
  badge: {
    position: 'absolute',
    left: 0,
    top: -10,
    paddingLeft: normalizeW(12),
    paddingRight: normalizeW(12),
    backgroundColor: THEME.colors.green,
  },
  badgeTxt: {
    lineHeight: 20,
    color: '#fff'
  },
  titleWrap: {
    marginTop: 11,
    marginLeft: normalizeW(12)
  },
  title: {
    fontSize: em(16),
    color: THEME.colors.dark
  },
  imagesWrap: {
    marginTop: normalizeH(17),
    marginLeft: normalizeW(6),
    marginRight: normalizeW(6),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  image: {
    height: normalizeH(117),
    width: normalizeW(117)
  },
  introWrap: {
    marginTop: normalizeH(8),
    marginLeft: normalizeW(12)
  },
  intro: {
    fontSize: em(14),
    color: THEME.colors.gray
  },
  tipWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalizeH(10)
  },
  oneFlex: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  tipRight: {
    justifyContent: 'flex-end',
  },
  time: {
    marginLeft: normalizeW(2)
  },
  location: {
    marginLeft: normalizeW(65)
  },
  heart: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comments: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: normalizeW(20),
    marginLeft: normalizeW(25)
  },
  tipTxt: {
    fontSize: em(12),
    marginLeft: normalizeW(10),
    color:THEME.colors.lighter
  }
})