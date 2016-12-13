/**
 * Created by yangyang on 2016/12/1.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import Carousel from 'react-native-looped-carousel'

import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import Header from '../common/Header'
import Thumbnail from '../common/Thumbnail'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export default class Home extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="image"
          leftImageSource={require("../../assets/images/local_unselect.png")}
          leftImageLabel="长沙"
          leftPress={() => Actions.pop()}
          title="近来"
          rightType="image"
          rightImageSource={require("../../assets/images/home_message.png")}
          rightPress={() => Actions.REGIST()}
        />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainerStyle}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.body}>
            <View style={styles.healthModule}>
              <View style={styles.healthTop}>
                <View style={styles.fastTask}>
                  <Thumbnail
                    sourceImage={require("../../assets/images/home_question.png")}
                    thumbnailTitle="快速问诊"
                    thumbnailIntro="专业医生免费为您解答疑问"
                    onPress={()=>{Actions.LOGIN()}}
                  />
                </View>
              </View>
              <View style={styles.healthBottom}>
                <View style={styles.findDoctor}>
                  <Thumbnail
                    sourceImage={require("../../assets/images/home_doctor.png")}
                    thumbnailTitle="找名医"
                    thumbnailIntro="一对一对症咨询"
                    onPress={()=>{Actions.LOGIN()}}
                  />
                </View>
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

            <View style={styles.announcementModule}>

            </View>

            <View style={styles.advertisementModule}>

            </View>

            <View style={styles.channelModule}>

            </View>

            <View style={styles.dayChosenModule}>

            </View>
          </View>
        </ScrollView>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF'
  },
  body: {
    paddingTop: normalizeH(65),
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#E5E5E5',
    height:1000
  },
  healthModule: {
    height: normalizeH(128),
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
    marginTop: normalizeH(19),
    marginBottom: normalizeH(19),
    borderRightWidth: normalizeBorder(3),
    borderRightColor: '#E5E5E5',
  },
  findHospital: {
    flex: 1,
  },
  announcementModule: {
    height: normalizeH(40),
    marginTop: normalizeH(15),
    flexDirection: 'row',
  },
  advertisementModule: {
    width: PAGE_WIDTH,
    height: normalizeH(136),
    marginTop: normalizeH(15),
  },
  channelModule: {

  },
  dayChosenModule: {
    height: normalizeH(84),
    width: PAGE_WIDTH,
    backgroundColor: '#FFFFFF',
    marginTop: normalizeH(15),

  },

})