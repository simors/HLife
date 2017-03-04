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
  Platform,
  ScrollView
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
import {isInputValid} from '../../selector/inputFormSelector'
import * as Toast from '../common/Toast'
import SmsAuthCodeInput from '../common/Input/SmsAuthCodeInput'
import PhoneInput from '../common/Input/PhoneInput'
import PasswordInput from '../common/Input/PasswordInput'
import Symbol from 'es6-symbol'
import Header from '../common/Header'
import THEME from '../../constants/themes/theme1'

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
    Actions.NICKNAME_VIEW()
  }

  submitErrorCallback(error) {
    Toast.show(error.message)
  }

  smsCode() {
    this.props.submitInputData({
      formKey: commonForm,
      stateKey:phoneInput.stateKey,
      submitType: INPUT_FORM_SUBMIT_TYPE.GET_SMS_CODE,
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
          title="注   册"
          rightType="text"
          rightText="昵称"
          rightPress={() => Actions.NICKNAME_VIEW()}
        />
        <View style={styles.body}>
          <ScrollView keyboardDismissMode="on-drag">
            <View style={{marginTop: 30}}>
              <PhoneInput {...phoneInput}  containerStyle={styles.inputBox}/>
              <SmsAuthCodeInput {...smsAuthCodeInput} containerStyle={styles.inputBox}
                                getSmsAuCode={() => {return this.smsCode()}} reset={!this.props.phoneValid} />
              <PasswordInput {...passwordInput} containerStyle={styles.inputBox}/>

              <Button
                buttonStyle={styles.btn}
                onPress={this.onButtonPress}
                title="确   定"
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

export default connect(mapStateToProps, mapDispatchToProps)(Regist)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    ...Platform.select({
      ios: {
        marginTop: normalizeH(65),
      },
      android: {
        marginTop: normalizeH(45)
      }
    }),
    flex: 1,
  },
  inputBox: {
    marginBottom: normalizeW(25)
  },
  btn: {
    height: normalizeH(50),
    marginLeft: normalizeW(17),
    marginRight: normalizeW(17),
    backgroundColor: THEME.base.mainColor,
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
    color:'#5A5A5A',
  },
})