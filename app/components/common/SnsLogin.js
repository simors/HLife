import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'

export default class SnsLogin extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.snsTxt}>通过以下方式直接登录</Text>   
        <View style={styles.snsLoginBox}>
          <Image source={require('../../assets/images/login_weixin@1x.png')} style={styles.snsIcon}></Image>
          <Image source={require('../../assets/images/login_qq@1x.png')} style={styles.snsIcon}></Image>
          <Image source={require('../../assets/images/login_sina@1x.png')} style={styles.snsIcon}></Image>
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    
  },
  snsTxt: {
    color: '#BBBABA',
    fontSize: em(14),
    textAlign: 'center',
    paddingBottom: normalizeH(7),
    marginLeft: normalizeW(17),
    marginRight: normalizeW(17),
  },
  snsLoginBox: {
    marginLeft: normalizeW(17),
    marginRight: normalizeW(17),
    paddingTop: normalizeH(20),
    borderTopWidth: normalizeBorder(),
    borderTopColor: '#e9e9e9',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  snsIcon: {
    width: normalizeW(48),
    height: normalizeH(50)
  }
})