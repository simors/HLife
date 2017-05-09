/**
 * Created by yangyang on 2017/5/6.
 */
import React, {Component} from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native'
import Header from '../common/Header'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH} from '../../util/Responsive'

export default class Contact extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="联系客服"
          rightType="none"
        />
        <View style={styles.body}>
          <View style={{marginTop: normalizeH(20), flexDirection: 'row', alignItems: 'center', paddingLeft: normalizeW(20)}}>
            <Text style={styles.text}>QQ客服：</Text>
            <Text style={styles.text}>2072809995</Text>
          </View>
          <View style={{marginTop: normalizeH(20), paddingLeft: normalizeW(20)}}>
            <Text style={styles.text}>微信客服：wuai1681688</Text>
          </View>
          <View style={{marginTop: normalizeH(20), alignItems: 'center'}}>
            <Image style={{width: 200, height: 200}} resizeMode='contain' source={require('../../assets/images/wechat_contact.png')}/>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  body: {
    marginTop: normalizeH(64),
  },
  text: {
    fontSize: em(27),
    color: '#5A5A5A',
  }
})