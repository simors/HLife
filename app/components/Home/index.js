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
  Image,
  Platform
} from 'react-native'
import {Actions} from 'react-native-router-flux'

import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import Header from '../common/Header'
import Banner from '../common/Banner'
import Health from './Health'
import DailyChosen from './DailyChosen'
import Channels from './Channels'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export default class Home extends Component {
  constructor(props) {
    super(props)

    this.banners = [
      {
        image: 'http://www.qq745.com/uploads/allimg/141106/1-141106153Q5.png',
      },
      {
        image: 'http://img1.3lian.com/2015/a1/53/d/200.jpg',
      },
      {
        image: 'http://img1.3lian.com/2015/a1/53/d/198.jpg',
      },
      {
        image: 'http://img1.3lian.com/2015/a1/53/d/200.jpg',
      },
    ];

    this.iosMarginTop = Platform.OS == 'ios' ? {marginTop: 20} : {};

    this.state = {
      clickTitle: 'You can try clicking beauty',
      defaultIndex: 0,
    }
    this.defaultIndex = 0
  }

  clickListener(index, banners) {
    console.log(`--->clickListener page index:${index}:  banners=${banners.length}`)
    this.setState({
      clickTitle: this.banners[index].title ? `you click ${this.banners[index].title}` : 'this banner has no title',
    })
  }

  onMomentumScrollEnd(event, state) {
    console.log(`--->onMomentumScrollEnd page index:${state.index}, total:${state.total}`)
    this.defaultIndex = state.index
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
              <Health />
            </View>

            <View style={styles.announcementModule}>

            </View>

            <View style={styles.advertisementModule}>
              <Banner
                banners={this.banners}
                defaultIndex={this.defaultIndex}
                onMomentumScrollEnd={this.onMomentumScrollEnd.bind(this)}
                intent={this.clickListener.bind(this)}
              />
            </View>

            <View style={styles.channelModule}>
              <Channels />
            </View>

            <View style={styles.dayChosenModule}>
              <DailyChosen />
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
  },
  announcementModule: {
    height: normalizeH(40),
    marginTop: normalizeH(15),
  },
  advertisementModule: {
    height: normalizeH(136),
    marginTop: normalizeH(15),
  },
  channelModule: {
    height: normalizeH(84),
    marginTop: normalizeH(15),
  },
  
  dayChosenModule: {
    height: normalizeH(220),
    backgroundColor: '#fff',
    marginTop: normalizeH(15),

  },

})