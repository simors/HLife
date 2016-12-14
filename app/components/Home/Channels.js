/**
 * Created by zachary on 2016/12/13.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import THEME from '../../constants/themes/theme1'

export default class Channels extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.channelContainer}>
        <View style={styles.channelWrap}>
          <TouchableOpacity onPress={()=>{}}>
            <Image source={require("../../assets/images/home_health.png")}/>
            <Text style={styles.channelText}>健康</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.channelWrap}>
          <TouchableOpacity onPress={()=>{}}>
            <Image source={require("../../assets/images/home_emotional.png")}/>
            <Text style={styles.channelText}>情感</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.channelWrap}>
          <TouchableOpacity onPress={()=>{}}>
            <Image source={require("../../assets/images/home_baby_mother.png")}/>
            <Text style={styles.channelText}>母婴</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.channelWrap}>
          <TouchableOpacity onPress={()=>{}}>
            <Image source={require("../../assets/images/home_beauty.png")}/>
            <Text style={styles.channelText}>美容</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.channelWrap}>
          <TouchableOpacity onPress={()=>{}}>
            <Image source={require("../../assets/images/home_more.png")}/>
            <Text style={styles.channelText}>更多</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  channelContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff'
  },
  channelWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  channelText: {
    marginTop: 5,
    color:THEME.colors.gray,
    textAlign: 'center'
  },
})