import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  NativeModules
} from 'react-native'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import {loginWithWeixin} from '../../action/authActions'
import * as Toast from '../common/Toast'
const shareNative = NativeModules.shareComponent


class SnsLogin extends Component {
  constructor(props) {
    super(props)
    this.wxUserInfo = undefined
  }

  submitSuccessCallback(userInfo) {
    if(userInfo) {
      Actions.HOME({type: 'reset'})
    } else {
      Actions.SUPPLEMENT_USERINFO({
        wxUserInfo: this.wxUserInfo,
      })
    }
  }

  submitErrorCallback(error) {
    Toast.show("微信登录失败")
  }

  loginCallback = (errorCode, data) => {
    let wxUserInfo = {
      accessToken: data.accessToken,
      expiration: data.expiration,
      unionid: data.uid,
      name: data.name,
      avatar: data.iconurl,
    }

    this.wxUserInfo = wxUserInfo

    this.props.loginWithWeixin({
      wxUserInfo: wxUserInfo,
      success:this.submitSuccessCallback,
      error: this.submitErrorCallback
    })

  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.snsTxt}>通过以下方式直接登录</Text>   
        <View style={styles.snsLoginBox}>
          <TouchableOpacity onPress={() => {shareNative.loginWX(this.loginCallback)}}>
            <Image source={require('../../assets/images/login_weixin@1x.png')} style={styles.snsIcon}></Image>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

}


const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  loginWithWeixin,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SnsLogin)


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