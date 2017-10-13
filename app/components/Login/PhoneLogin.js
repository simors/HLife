import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  ScrollView,
  NativeModules
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH} from '../../util/Responsive'
import PhoneInput from '../common/Input/PhoneInput'
import Header from '../common/Header'
import PasswordInput from '../common/Input/PasswordInput'
import Symbol from 'es6-symbol'
import {submitFormData, INPUT_FORM_SUBMIT_TYPE} from '../../action/authActions'
import * as Toast from '../common/Toast'
import CommonButton from '../common/CommonButton'
import THEME from '../../constants/themes/theme1'

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

class PhoneLogin extends Component {
  constructor(props) {
    super(props)
    this.wxUserInfo = undefined

  }

  onButtonPress = () => {
    this.props.submitFormData({
      formKey: commonForm,
      submitType: INPUT_FORM_SUBMIT_TYPE.LOGIN_WITH_PWD,
      success: (result) => {
        if(result.wxAuthed) {
          Toast.show('登录成功!')
          if (this.props.goHome) {
            Actions.HOME({type: 'reset'})
          } else {
            Actions.pop({popNum: 2})
          }
        } else {
          shareNative.loginWX(this.phoneLoginCallback)
        }
      },
      error: (error) => {
        Toast.show(error.message)
      }
    })
  }

  phoneLoginCallback = (errorCode, data) => {
    let wxUserInfo = {
      accessToken: data.accessToken,
      expiration: data.expiration,
      unionid: data.uid,
      name: data.name,
      avatar: data.iconurl,
    }

    this.wxUserInfo = wxUserInfo

    this.props.submitFormData({
      formKey: commonForm,
      submitType: INPUT_FORM_SUBMIT_TYPE.LOGIN_WITH_PWD,
      wxUserInfo: wxUserInfo,
      success: () => {
        Toast.show('登录成功!')
        if (this.props.goHome) {
          Actions.HOME({type: 'reset'})
        } else {
          Actions.pop({popNum: 2})
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

        </ScrollView>
        </View>
      </View>
    )
  }

}

PhoneLogin.defaultProps = {
  goHome: false,
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  submitFormData,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PhoneLogin)

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