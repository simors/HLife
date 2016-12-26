/**
 * Created by zachary on 2016/12/20.
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
  InteractionManager
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Symbol from 'es6-symbol'
import {Actions} from 'react-native-router-flux'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'
import * as appConfig from '../../../constants/appConfig'
import Header from '../../common/Header'
import CommonButton from '../../common/CommonButton'
import PhoneInput from '../../common/Input/PhoneInput'
import CommonTextInput from '../../common/Input/CommonTextInput'
import SmsAuthCodeInput from '../../common/Input/SmsAuthCodeInput'
import {submitFormData, submitInputData,INPUT_FORM_SUBMIT_TYPE} from '../../../action/authActions'
import * as Toast from '../../common/Toast'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

let commonForm = Symbol('commonForm')

const nameInput = {
  formKey: commonForm,
  stateKey: Symbol('nameInput'),
  type: "nameInput",
}
const phoneInput = {
  formKey: commonForm,
  stateKey: Symbol('phoneInput'),
  type: "phoneInput",
}
const smsAuthCodeInput = {
  formKey: commonForm,
  stateKey: Symbol('smsAuthCodeInput'),
  type: "smsAuthCodeInput",
}
const shopNameInput = {
  formKey: commonForm,
  stateKey: Symbol('shopNameInput'),
  type: "shopNameInput",
}
const shopAddrInput = {
  formKey: commonForm,
  stateKey: Symbol('shopAddrInput'),
  type: "shopAddrInput",
}
const invitationCodeInput = {
  formKey: commonForm,
  stateKey: Symbol('invitationCodeInput'),
  type: "invitationCodeInput",
}

class ShopRegister extends Component {
  constructor(props) {
    super(props)

  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {

    })
  }

  submitSuccessCallback(doctorInfo) {
    Actions.SHOPR_EGISTER_SUCCESS()
  }

  submitErrorCallback(error) {

    Toast.show(error.message)
  }

  onButtonPress = () => {
    this.props.submitFormData({
      formKey: commonForm,
      submitType: INPUT_FORM_SUBMIT_TYPE.SHOP_CERTIFICATION,
      success: this.submitSuccessCallback,
      error: this.submitErrorCallback
    })
  }

  smsCode() {
    this.props.submitInputData({
      formKey: commonForm,
      stateKey:phoneInput.stateKey,
      submitType: INPUT_FORM_SUBMIT_TYPE.GET_SMS_CODE,
      success:() => {
        Toast.show('发送短信验证码成功,请注意查收')
      },
      error: (error) => {
        Toast.show(error.message)
      }
    })
  }


  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="text"
          leftText="取消"
          leftPress={() => Actions.pop()}
          title="注册店铺"
          headerContainerStyle={styles.headerContainerStyle}
          leftStyle={styles.headerLeftStyle}
          titleStyle={styles.headerTitleStyle}
        />
        <View style={styles.body}>

          <KeyboardAwareScrollView
            keyboardShouldPersistTaps={true}
            keyboardDismissMode='on-drag'
          >
            <View style={styles.subTitleWrap}>
              <Text style={styles.subTitle}>欢迎加入{appConfig.APP_NAME}，给你的店铺带好更好的收入</Text>
            </View>
            <View style={styles.inputsWrap}>
              <View style={styles.inputWrap}>
                <View style={styles.inputLabelBox}>
                  <Text style={styles.inputLabel}>姓名</Text>
                </View>
                <View style={styles.inputBox}>
                  <CommonTextInput
                    {...nameInput}
                    placeholder="与身份证姓名保持一致"
                    containerStyle={styles.containerStyle}
                    inputStyle={styles.inputStyle}
                  />
                </View>
              </View>

              <View style={styles.inputWrap}>
                <View style={styles.inputLabelBox}>
                  <Text style={styles.inputLabel}>手机号</Text>
                </View>
                <View style={styles.inputBox}>
                  <PhoneInput
                    {...phoneInput}
                    placeholder="仅用于客服与你联系"
                    containerStyle={styles.containerStyle}
                    inputStyle={styles.inputStyle}/>
                </View>
              </View>

              <View style={styles.inputWrap}>
                <View style={styles.inputLabelBox}>
                  <Text style={styles.inputLabel}>验证码</Text>
                </View>
                <View style={styles.inputBox}>
                  <SmsAuthCodeInput
                    {...smsAuthCodeInput}
                    containerStyle={{height:normalizeH(44),}}
                    textInput={{height:normalizeH(44),backgroundColor: '#fff',borderWidth:0,paddingLeft:0}}
                    inputContainer={{paddingLeft: 17, paddingRight: 17}}
                    placeholder = "填写手机验证码"
                    codeTextContainer={{width: normalizeW(97), height: normalizeH(30), borderRadius: 5,}}
                    codeTextContainerDisable={{width: normalizeW(97), height: normalizeH(30), borderRadius: 5,}}
                    codeText={{fontSize: 12}}
                    getSmsAuCode={() => this.smsCode()}
                    reset={!this.props.phoneValid}
                  />
                </View>
              </View>

              <View style={[styles.inputWrap, {marginTop: normalizeH(15)}]}>
                <View style={styles.inputLabelBox}>
                  <Text style={styles.inputLabel}>店铺名称</Text>
                </View>
                <View style={styles.inputBox}>
                  <CommonTextInput
                    {...shopNameInput}
                    placeholder="点击输入店铺名称"
                    containerStyle={styles.containerStyle}
                    inputStyle={styles.inputStyle}
                  />
                </View>
              </View>

              <View style={styles.inputWrap}>
                <View style={styles.inputLabelBox}>
                  <Text style={styles.inputLabel}>店铺地址</Text>
                </View>
                <View style={styles.inputBox}>
                  <CommonTextInput
                    {...shopAddrInput}
                    placeholder="点击输入店铺地址"
                    containerStyle={styles.containerStyle}
                    inputStyle={styles.inputStyle}
                  />
                </View>
              </View>

              <View style={styles.inputWrap}>
                <View style={styles.inputLabelBox}>
                  <Text style={styles.inputLabel}>邀请码</Text>
                </View>
                <View style={styles.inputBox}>
                  <CommonTextInput
                    {...invitationCodeInput}
                    placeholder="输入邀请码"
                    containerStyle={styles.containerStyle}
                    inputStyle={styles.inputStyle}
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.getInvitationWrap} onPress={()=>Actions.GET_INVITATION_CODE()}>
              <Text style={{color:THEME.colors.green,fontSize: em(16)}}>如何获取邀请码？</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <CommonButton
                title="提交店铺"
                onPress={this.onButtonPress}
              />

              <TouchableOpacity style={styles.shopRegistProtocalWrap} onPress={()=>{}}>
                <Text style={{color:THEME.colors.light,fontSize: em(12)}}>我已阅读</Text>
                <Text style={{color:THEME.colors.green,fontSize: em(12)}}>《{appConfig.APP_NAME}店铺推广协议》</Text>
              </TouchableOpacity>
            </View>

          </KeyboardAwareScrollView>

        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {

  return {

  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  submitFormData,
  submitInputData
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ShopRegister)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)'
  },
  headerContainerStyle: {
    borderBottomWidth: 0,
    backgroundColor: THEME.colors.green
  },
  headerLeftStyle: {
    color: '#fff',
    fontSize: em(17)
  },
  headerTitleStyle: {
    color: '#fff',
  },
  body: {
    ...Platform.select({
      ios: {
        paddingTop: normalizeH(64),
      },
      android: {
        paddingTop: normalizeH(44)
      }
    }),
    flex: 1,
  },
  subTitleWrap: {
    height: normalizeH(44),
    backgroundColor: "rgba(80, 226, 193, 0.23)",
    justifyContent: 'center',
    alignItems: 'center'
  },
  subTitle: {
    fontSize: em(12),
    color: THEME.colors.subDark
  },
  inputsWrap: {

  },
  inputWrap: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: THEME.colors.gray,
    paddingLeft: normalizeW(20),
  },
  inputLabelBox: {
    width: normalizeW(70),
    justifyContent: 'center',
    alignItems: 'flex-start'
    
  },
  inputLabel: {
    fontSize: em(17),
    color: THEME.colors.inputLabel
  },
  inputBox: {
    flex: 1
  },
  containerStyle: {
    paddingRight:0,
  },
  inputStyle:{
    height: normalizeH(44),
    fontSize: em(17),
    backgroundColor: '#fff',
    borderWidth: 0,
    paddingLeft: 0,
  },
  getInvitationWrap: {
    marginTop: normalizeH(15),
    justifyContent: 'center',
    alignItems: 'center'
  },
  footer: {
    marginTop: normalizeH(120)
  },
  shopRegistProtocalWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalizeH(10)
  }

})