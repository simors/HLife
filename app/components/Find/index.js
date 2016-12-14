/**
 * Created by zachary on 2016/12/9.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'


const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height

export default class Launch extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="image"
          leftImageSource={require("../../assets/images/local_add.png")}
          leftPress={() => Actions.pop()}
          title="发现"
          rightType="image"
          rightImageSource={require("../../assets/images/home_message.png")}
          rightPress={() => Actions.REGIST()}
        />
        <View style={styles.body}>
          <View style={styles.zone}>
          <Image source={require('../../assets/images/home_health.png')}></Image>
          <Text>健康，养生</Text>
          </View>
          <View style={styles.zone}>
            <Image source={require('../../assets/images/home_health.png')}></Image>
            <Text>健康，养生</Text>
          </View>
          <View style={styles.zone}>
            <Image source={require('../../assets/images/home_health.png')}></Image>
            <Text>健康，养生</Text>
          </View>
          <View style={styles.zone}>
            <Image source={require('../../assets/images/home_health.png')}></Image>
            <Text>健康，养生</Text>
          </View>

        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#F5FCFF',
    // width: PAGE_WIDTH,
    // height: PAGE_HEIGHT
    borderWidth: 1,
    borderColor: 'red',
  },
  body: {
    flexDirection: 'row',
    flexWrap: 'wrap',

  },
  zone: {
    flexDirection: 'row',
    width: PAGE_WIDTH/2,
    height: normalizeH(60),
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingLeft: normalizeW(25),
    paddingTop: normalizeH(15),
    justifyContent: 'flex-start',
    alignItems: 'center',

  }
})