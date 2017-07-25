/**
 * Created by wanpeng on 2017/7/24.
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
  Platform,
  ScrollView
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import CommonButton from '../common/CommonButton'
import {submitInputData, submitFormData, INPUT_FORM_SUBMIT_TYPE} from '../../action/authActions'
import {isInputValid} from '../../selector/inputFormSelector'
import * as Toast from '../common/Toast'
import SmsAuthCodeInput from '../common/Input/SmsAuthCodeInput'
import PhoneInput from '../common/Input/PhoneInput'
import Symbol from 'es6-symbol'
import Header from '../common/Header'


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

class SetMobilePhoneNumber extends Component {
  constructor(props) {
    super(props)
  }

  onButtonPress = () => {
    this.props.submitFormData({
      formKey: commonForm,
      submitType: INPUT_FORM_SUBMIT_TYPE.SET_MOBILE_PHONE_NUMBER,
      success:this.submitSuccessCallback,
      error: this.submitErrorCallback
    })
  }

  submitSuccessCallback(userInfos) {
    Toast.show('手机号码设置成功')
    Actions.HOME({type: 'reset'})
  }

  submitErrorCallback(error) {
    Toast.show(error.message)
  }

  smsCode() {
    this.props.submitInputData({
      formKey: commonForm,
      stateKey:phoneInput.stateKey,
      submitType: INPUT_FORM_SUBMIT_TYPE.VERIFY_SMS_CODE,
      success:() => {},
      error: (error) => {
        Toast.show(error.message)
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="手机号码设置"
        />
        <View style={styles.body}>
          <ScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps={true}>
            <View style={{marginTop: 30}}>
              <View style={[styles.inputBox, {paddingLeft: normalizeW(17), paddingRight: normalizeW(17)}]}>
                <PhoneInput {...phoneInput}
                            containerStyle={{paddingLeft: normalizeW(0), paddingRight: normalizeW(0)}}
                            outContainerWrap={{backgroundColor: '#F3F3F3', borderWidth: 0}}/>
              </View>
              <SmsAuthCodeInput {...smsAuthCodeInput} containerStyle={styles.inputBox}
                                getSmsAuCode={() => {return this.smsCode()}} reset={!this.props.phoneValid} />

              <CommonButton
                onPress={this.onButtonPress}
                title="确定"
              />
              <View style={styles.agreementView}>
                <TouchableOpacity onPress={() => Actions.AGREEMENT_VIEW()}>
                  <Text style={styles.agreementText} onPress={this.retrievePassword}>服务条款及协议</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>

    )
  }

}

const mapStateToProps = (state, ownProps) => {
  let newProps = {}
  let isValid = isInputValid(state, commonForm, phoneInput.stateKey)
  if (!isValid.isValid) {
    newProps.phoneValid = false
  } else {
    newProps.phoneValid = true
  }
  return newProps
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  submitFormData,
  submitInputData
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SetMobilePhoneNumber)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    marginTop: normalizeH(65),
    flex: 1,
  },
  inputBox: {
    marginBottom: normalizeW(25)
  },
  agreementView:{
    marginTop: normalizeH(18),
    height:normalizeH(20),
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
    color:'#5A5A5A',
  },
})