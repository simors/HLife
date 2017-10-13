/**
 * Created by yangyang on 2017/10/13.
 */
import React, {PureComponent} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  NativeModules
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import {loginWithWeixin} from '../../action/authActions'
import * as Toast from '../common/Toast'
import Icon from 'react-native-vector-icons/Ionicons'
import Svg from '../common/Svgs'

const shareNative = NativeModules.shareComponent


const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height

class Login extends PureComponent {
  constructor(props) {
    super(props)
    this.wxUserInfo = undefined
  }

  submitSuccessCallback(userInfo) {
    if(userInfo) {
      if(!userInfo.mobilePhoneNumber || !userInfo.mobilePhoneVerified) {
        Actions.SET_MOBILE_PHONE_NUMBER()
      } else {
        Toast.show("微信登录成功")
        Actions.HOME({type: 'reset'})
      }
    } else {
      Actions.SUPPLEMENT_USERINFO({
        wxUserInfo: this.wxUserInfo,
      })
    }
  }

  submitErrorCallback(error) {
    Toast.show("微信登录失败", error)
  }

  wxLoginCallback = (errorCode, data) => {
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
        <Image style={{width: PAGE_WIDTH, height: PAGE_HEIGHT}} resizeMode="stretch" source={require('../../assets/images/bg_login@2x.png')}>
          <TouchableOpacity style={styles.toolbarView} onPress={() => Actions.pop()}>
            <Icon name="ios-arrow-back" style={styles.leaveBtn}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.wechatLogin} onPress={() => {shareNative.loginWX(this.wxLoginCallback)}}>
            <Svg size={32} icon="login_btn_weixin"/>
            <View style={{backgroundColor: 'transparent', marginLeft: normalizeW(8)}}>
              <Text style={{fontSize: em(17), color: '#fff'}}>微信登陆</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.phoneLogin} onPress={() => Actions.PHONE_LOGIN({goHome: true})}>
            <Text style={{fontSize: em(13), color: '#fff', opacity: 0.5}}>手机号码登陆</Text>
          </TouchableOpacity>
        </Image>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  loginWithWeixin
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Login)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbarView: {
    marginTop: normalizeH(32),
    paddingLeft: normalizeW(12),
    backgroundColor: 'transparent',
    width: normalizeW(50),
  },
  leaveBtn: {
    fontSize: em(28),
    color: '#FFF',
  },
  wechatLogin: {
    marginTop: normalizeH(410),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: normalizeH(45),
  },
  phoneLogin: {
    marginTop: normalizeH(17),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    height: normalizeH(30),
  },
})