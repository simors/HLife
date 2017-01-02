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
import Thumbnail from '../common/Thumbnail'

export default class Health extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.healthWrap}>
        <View style={styles.healthTop}>
          <View style={styles.fastTask}>
            <Thumbnail
              sourceImage={require("../../assets/images/home_question.png")}
              thumbnailTitle="快速问诊"
              thumbnailIntro="专业医生免费为您解答疑问"
            />
          </View>
        </View>
        <View style={styles.healthBottom}>
          <View style={styles.findDoctor}>
            <Thumbnail
              sourceImage={require("../../assets/images/home_doctor.png")}
              thumbnailTitle="找名医"
              thumbnailIntro="一对一对症咨询"
              onPress={()=>{Actions.DOCTER_FINDER()}}
            />
          </View>
          <View style={styles.line}></View>
          <View style={styles.findHospital}>
            <Thumbnail
              sourceImage={require("../../assets/images/home_hospital.png")}
              thumbnailTitle="找医院"
              thumbnailIntro="找对对症的好医院"
              onPress={()=>{Actions.LOGIN()}}
            />
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  healthWrap: {
    flex: 1,
    backgroundColor: '#fff',
  },
  healthTop: {
    flex: 1,
  },
  healthBottom: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch'
  },
  fastTask: {
    flex: 1,
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: normalizeBorder(3),
  },
  findDoctor: {
    flex: 1,
  },
  line: {
    marginTop: normalizeH(19),
    marginBottom: normalizeH(19),
    borderRightWidth: normalizeBorder(3),
    borderRightColor: '#E5E5E5',
  },
  findHospital: {
    flex: 1,
  },
})