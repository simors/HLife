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
import Icon from 'react-native-vector-icons/Ionicons'

import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import Thumbnail from '../common/Thumbnail'

export default class Health extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <View style={styles.leftWrap}>
          <Image source={require("../../assets/images/local_medical.png")}/>
        </View>
        <View style={styles.centerWrap}>
          <View style={styles.centerTop}>
            <Text style={styles.centerTopTitle}>本地医疗</Text>
          </View>
          <View style={styles.centerBottom}>
            <View style={styles.tagWrap}>
              <Text style={styles.tag}>药店</Text>
            </View>
            <View style={styles.tagWrap}>
              <Text style={styles.tag}>诊所</Text>
            </View>
            <View style={styles.tagWrap}>
              <Text style={styles.tag}>医生</Text>
            </View>
            <View style={styles.tagWrap}>
              <Text style={styles.tag}>医院</Text>
            </View>
          </View>
        </View>
        <View style={styles.rightWrap}>
          <Icon
            name='ios-arrow-forward'
            style={styles.rightIcon} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingLeft: normalizeW(22),
    paddingRight: normalizeW(12),
    paddingTop: normalizeH(20),
    paddingBottom: normalizeH(16)
  },
  leftWrap: {
    justifyContent: 'center',
  },
  centerWrap: {
    flex: 1,
    marginLeft: normalizeW(10),
    paddingLeft: normalizeW(10),
    borderLeftWidth: normalizeBorder(),
    borderLeftColor: THEME.colors.lighterA
  },
  rightWrap: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  centerTop: {
    flex: 1
  },
  centerBottom: {
    flex: 1,
    flexDirection: 'row',
  },
  centerTopTitle: {
    fontSize: em(17),
    color: THEME.colors.dark
  },
  tagWrap: {
    marginRight: normalizeW(9),
    paddingLeft: normalizeW(6),
    paddingRight: normalizeW(6),
    paddingTop: normalizeW(3),
    paddingBottom: normalizeW(3),
    backgroundColor: '#F1F1F1',
    borderRadius:5,
  },
  tag: {
    fontSize: em(15),
    color: THEME.colors.lessDark
  },
  rightIcon: {
    fontSize: em(30),
    color: THEME.colors.lightest
  }
})