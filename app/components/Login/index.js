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
  Platform,
  ScrollView,
  StatusBar,
  NativeModules
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import SnsLogin from '../common/SnsLogin'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import PhoneInput from '../common/Input/PhoneInput'
import Header from '../common/Header'
import PasswordInput from '../common/Input/PasswordInput'
import Symbol from 'es6-symbol'
import {submitFormData, loginWithWeixin, INPUT_FORM_SUBMIT_TYPE} from '../../action/authActions'
import * as Toast from '../common/Toast'
import CommonButton from '../common/CommonButton'
import THEME from '../../constants/themes/theme1'
import {fetchUserOwnedShopInfo} from '../../action/shopAction'

const shareNative = NativeModules.shareComponent


const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height


let commonForm = Symbol('commonForm')
const phoneInput = {
  formKey: commonForm,
  stateKey: Symbol('phoneInput'),
  type: "phoneInput"
}
const pwdInput = {
  formKey: commonForm,
  stateKey: Symbol('passwordInput'),
  type: "passwordInput"
}

class Login extends Component {
  constructor(props) {
    super(props)
    this.wxUserInfo = undefined

  }

  onButtonPress = () => {
    this.props.submitFormData({
      formKey: commonForm,
      submitType: INPUT_FORM_SUBMIT_TYPE.LOGIN_WITH_PWD,
      success: (userInfo) => {
        // this.props.fetchUserOwnedShopInfo({userId: userInfo.id})
        Toast.show('登录成功!')
        if (this.props.goHome) {
          Actions.HOME()
        } else {
          Actions.pop()
        }
      },
      error: (error) => {
        Toast.show(error.message)
      }
    })
  }

  retrievePassword() {
    Actions.RETRIEVE_PWD()
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
    console.log("loginCallback: data", data)
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
        <Header 
          leftType="icon" 
          leftIconName="ios-arrow-back" 
          leftPress={() => Actions.pop()}
          title="登   陆"
        />
        <View style={styles.body}>
          <ScrollView  keyboardDismissMode="on-drag" keyboardShouldPersistTaps={true}>
            <View style={{marginTop: 30}}>
              <View style={[styles.inputBox, {paddingLeft: normalizeW(17), paddingRight: normalizeW(17)}]}>
                <PhoneInput {...phoneInput}
                            containerStyle={{paddingLeft: normalizeW(0), paddingRight: normalizeW(0)}}
                            outContainerWrap={{backgroundColor: '#F3F3F3', borderWidth: 0}}/>
              </View>
              <View style={styles.inputBox}>
                <PasswordInput {...pwdInput} placeholder="请输入密码"/>
              </View>
            </View>
            <CommonButton title="登   陆" onPress={() => this.onButtonPress()}/>
            <View style={styles.txtView}>
              <Text style={styles.forgetPwd} onPress={() => this.retrievePassword()}>忘记密码？</Text>
            </View>

            <View style={{flexDirection: 'row', width: PAGE_WIDTH, marginTop: normalizeH(224)}}>
              <TouchableOpacity style={{flexDirection: 'row', width: normalizeW(160), height: normalizeH(47), alignItems: 'center',backgroundColor: '#F5F5F5', borderRadius: 20, marginLeft: normalizeW(20)}} onPress={() => {shareNative.loginWX(this.loginCallback)}}>
                <Image style={{width: normalizeW(40), height: normalizeH(47), marginLeft: normalizeW(20), marginRight: normalizeW(6)}} source={require('../../assets/images/login_btn_weixin.png')}/>
                <Text style={{fontSize: 17, color: '#09BB07'}}>微信登录</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{flexDirection: 'row', width: normalizeW(160), height: normalizeH(47), alignItems: 'center',backgroundColor: '#F5F5F5', borderRadius: 20, marginLeft: normalizeW(15)}} onPress={() => Actions.REGIST()}>
                <Image style={{width: normalizeW(40), height: normalizeH(47), marginLeft: normalizeW(20), marginRight: normalizeW(6)}} source={require('../../assets/images/login_btn.png')}/>
                <Text style={{fontSize: 17, color: '#FF7819'}}>快速注册</Text>
              </TouchableOpacity>
            </View>

        </ScrollView>
        </View>
      </View>
    )
  }

}

Login.defaultProps = {
  goHome: false,
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  submitFormData,
  fetchUserOwnedShopInfo,
  loginWithWeixin
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Login)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputBox: {
    marginBottom: normalizeW(25)
  },
  body: {
    marginTop: normalizeH(65),
    flex: 1,
  },
  btn: {
    height: normalizeH(50),
    marginLeft: normalizeW(17),
    marginRight: normalizeW(17),
    backgroundColor: THEME.base.mainColor,
  },
  txtView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: normalizeH(18),
  },
  forgetPwd: {
    fontSize: em(14),
    color: THEME.base.deepColor,
    textAlign: 'center',
  }
})