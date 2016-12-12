/**
 * Created by wanpeng on 2016/12/2.
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
  Dimensions
} from 'react-native'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import {
  Button,
} from 'react-native-elements'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import SmsAuthCodeInput from '../common/Input/SmsAuthCodeInput'
import PhoneInput from '../common/Input/PhoneInput'
import PasswordInput from '../common/Input/PasswordInput'
import * as Toast from '../common/Toast'

import {submitFormData, INPUT_FORM_SUBMIT_TYPE} from '../../action/authActions'

const PAGE_WIDTH = Dimensions.get('window').width
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

class RetrievePassword extends Component {
  constructor(props) {
    super(props)
  }

  onButtonPress = () => {
    this.props.submitFormData({
      formKey: commonForm,
      submitType: INPUT_FORM_SUBMIT_TYPE.MODIFY_PASSWORD,
      success:() => {
        Toast.show('密码重置成功，请登录')
        Actions.LOGIN()
      },
      error: (error) => {Toast.show(error.message)}
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="找回密码"
          rightType=""
        />
        <View style={styles.body}>
          <PhoneInput {...phoneInput} containerStyle={styles.inputBox}
                      placeholder='请输入注册的手机号'/>
          <SmsAuthCodeInput {...smsAuthCodeInput} containerStyle={styles.inputBox}
                            getSmsAuCode={() => {
                            this.props.submitFormData({
                              formKey: commonForm,
                              submitType: INPUT_FORM_SUBMIT_TYPE.RESET_PWD_SMS_CODE,
                              success:() => {},
                              error:(error) => {Toast.show(error.message)}
                            })}}
          />
          <PasswordInput {...passwordInput} containerStyle={styles.inputBox}
                         placeholder='设置新密码(6-16位数字或字母)'/>
        </View>
        <Button
          buttonStyle={styles.btn}
          onPress={this.onButtonPress}
          title="重设密码"
        />

      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  submitFormData
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(RetrievePassword)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#f3f3f3',
    paddingTop: normalizeH(20),
    flexDirection: 'row',
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: '#B2B2B2'
  },
  body: {
    paddingTop: normalizeH(64),
    width: PAGE_WIDTH,
  },
  inputBox: {
    marginBottom: normalizeW(25)
  },
  btn: {
    height: normalizeH(50),
    marginLeft: normalizeW(17),
    marginRight: normalizeW(17),
    backgroundColor: '#50E3C2',
    marginBottom: normalizeH(24)
  },
  titleInfo: {
    color: '#50E3C2',
    fontSize: em(18),
    alignSelf: 'flex-start',
    paddingLeft: normalizeW(17),
    marginBottom: normalizeH(35)
  }

})