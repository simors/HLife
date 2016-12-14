/**
 * Created by lilu on 2016/12/2.
 * Modified by wuxingyu on 2016/12/8.
 */

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
  Platform
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import SnsLogin from '../common/SnsLogin'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import {
  Button
} from 'react-native-elements'
import {submitInputData, submitFormData, INPUT_FORM_SUBMIT_TYPE} from '../../action/authActions'
import * as Toast from '../common/Toast'
import SmsAuthCodeInput from '../common/Input/SmsAuthCodeInput'
import PhoneInput from '../common/Input/PhoneInput'
import PasswordInput from '../common/Input/PasswordInput'
import Symbol from 'es6-symbol'
import Header from '../common/Header'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const PAGE_WIDTH=Dimensions.get('window').width

let commonForm = Symbol('commonForm')
const phoneInput = {
  formKey: commonForm,
  stateKey: Symbol('phoneInput'),
  type: "phoneInput"
}

const smsAuthCodeInput = {
  formKey: commonForm,
  stateKey: Symbol('smsAuthCodeInput'),
  type: "smsAuthCodeInput",

}

const passwordInput = {
  formKey: commonForm,
  stateKey: Symbol('passwordInput'),
  type: "passwordInput"
}

class Regist extends Component {
  constructor(props) {
    super(props)
  }

  onButtonPress = () => {
    this.props.submitFormData({
      formKey: commonForm,
      submitType: INPUT_FORM_SUBMIT_TYPE.REGISTER,
      success:this.submitSuccessCallback,
      error: this.submitErrorCallback
    })
  }

  submitSuccessCallback(userInfos) {
    Toast.show('注册成功, 请登录')
    Actions.LOGIN()
  }

  submitErrorCallback(error) {
    Toast.show(error.message)
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="注册"
          rightType="text"
          rightText="登录"
          rightPress={() => Actions.LOGIN()}
        />
        <View style={styles.body}>
          <Image source={require('../../assets/images/login_weixin@1x.png')} style={styles.logo} />

          <PhoneInput {...phoneInput}  containerStyle={styles.inputBox}/>
          <SmsAuthCodeInput {...smsAuthCodeInput} containerStyle={styles.inputBox}
                            getSmsAuCode={() => {
          this.props.submitInputData({
            formKey: commonForm,
            stateKey:phoneInput.stateKey,
            submitType: INPUT_FORM_SUBMIT_TYPE.GET_SMS_CODE,
            success:() => {},
            error: (error) => {Toast.show(error.message)}
          })
        }}/>
          <PasswordInput {...passwordInput} containerStyle={styles.inputBox}/>

          <Button
            buttonStyle={styles.btn}
            onPress={this.onButtonPress}
            title="开始使用"
          />
          <View style={styles.agreementView}>
            <Image source={require('../../assets/images/code_close_eye.png')} style={styles.check} />
            <Text style={styles.agreementText} onPress={this.retrievePassword}>服务条款及协议</Text>
          </View>
          <SnsLogin />
        </View>
      </View>

    )
  }

}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  submitFormData,
  submitInputData
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Regist)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    ...Platform.select({
      ios: {
        paddingTop: normalizeH(65),
      },
      android: {
        paddingTop: normalizeH(45)
      }
    }),
    flex: 1,
    alignItems: 'stretch',
    height:1000
  },
  inputBox: {
    marginBottom: normalizeW(25)
  },
  logo: {
    marginTop: normalizeH(25),
    marginBottom: normalizeH(25),
    alignSelf: 'center',
    width: normalizeW(108),
    height: normalizeH(47),
  },
  btn: {
    height: normalizeH(50),
    marginLeft: normalizeW(17),
    marginRight: normalizeW(17),
    backgroundColor: '#50E3C2',
    marginBottom: normalizeH(24)
  },
  agreementView:{
    height:normalizeH(17),
    flexDirection:'row',
    justifyContent:'center',
    marginBottom:normalizeH(59),
  },
  check:{
    width:normalizeW(18),
    height:normalizeH(16),
  },
  agreementText:{
    fontSize:em(14),
    color:'#50E3C2',
  },
})