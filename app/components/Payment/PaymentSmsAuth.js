/**
 * Created by wanpeng on 2017/4/12.
 */

import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  ListView,
  TouchableOpacity,
  Image,
  Platform,
  InteractionManager,
  NativeModules
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import {normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import * as authSelector from '../../selector/authSelector'
import Header from '../common/Header'
import CommonButton from '../common/CommonButton'
import THEME from '../../constants/themes/theme1'
import SmsAuthCodeInput from '../common/Input/SmsAuthCodeInput'
import {submitInputData, submitFormData, INPUT_FORM_SUBMIT_TYPE} from '../../action/authActions'
import * as Toast from '../common/Toast'

let authForm = Symbol('authForm')

const smsAuthCodeInput = {
  formKey: authForm,
  stateKey: Symbol('smsAuthCodeInput'),
  type: "smsAuthCodeInput",

}

class PaymentSmsAuth extends Component {
  constructor(props) {
    super(props)
  }

  smsCode() {
    this.props.submitInputData({
      formKey: authForm,
      phone: this.props.activeUserInfo.mobilePhoneNumber,
      submitType: INPUT_FORM_SUBMIT_TYPE.GET_PAYMENT_SMS_CODE,
      success:() => {},
      error: (error) => {
        Toast.show(error.message)
      }
    })
  }

  onAuth = () => {
    this.props.submitFormData({
      formKey: authForm,
      phone: this.props.activeUserInfo.mobilePhoneNumber,
      submitType: INPUT_FORM_SUBMIT_TYPE.PAYMENT_AUTH,
      success:() => {Actions.PAYMENT_PASSWORD()},
      error: (error) => {
        Toast.show(error.message)
      }
    })
  }

  render() {
    return(
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title='填写验证码'
          headerContainerStyle={styles.headerContainerStyle}
          leftStyle={styles.headerLeftStyle}
          titleStyle={styles.headerTitleStyle}
        />
        <View style={styles.body}>
          <View style={{flexDirection: 'row', marginTop: normalizeH(20), marginLeft: normalizeW(15)}}>
            <Text style={{fontSize: 15, color: '#AAAAAA'}}>请输入手机</Text>
            <Text style={{fontSize: 15, color: THEME.base.mainColor}}>{this.props.activeUserInfo.mobilePhoneNumber}</Text>
            <Text style={{fontSize: 15, color: '#AAAAAA'}}>收到的短信验证码</Text>
          </View>
          <SmsAuthCodeInput
            {...smsAuthCodeInput}
            containerStyle={styles.inputBox}
            getSmsAuCode={() => {return this.smsCode()}}

          />

          <CommonButton
            buttonStyle={{marginTop:normalizeH(40)}}
            onPress={this.onAuth}
            title="验证"
          />
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const isUserLogined = authSelector.isUserLogined(state)
  const activeUserInfo = authSelector.selectActiveUserInfo(state)
  return {
    isUserLogined: isUserLogined,
    activeUserInfo: activeUserInfo,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  submitInputData,
  submitFormData
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PaymentSmsAuth)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  headerContainerStyle: {
    borderBottomWidth: 1,
    backgroundColor: '#F9F9F9'
  },
  headerLeftStyle: {
    color: THEME.colors.green,
    fontSize: 24
  },
  headerTitleStyle: {
    color: '#030303',
    fontSize: 17,
  },
  body: {
    ...Platform.select({
      ios: {
        marginTop: normalizeH(64),
      },
      android: {
        marginTop: normalizeH(44)
      }
    }),
    flex: 1,
  },
  inputBox: {
    marginTop: normalizeH(20)
  },
})
