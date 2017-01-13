/**
 * Created by lilu on 2017/1/12.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import Symbol from 'es6-symbol'
import Header from '../../common/Header'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import THEME from '../../../constants/themes/theme1'
import CommonButton from '../../common/CommonButton'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import PhoneInput from '../../common/Input/PhoneInput'
import * as appConfig from '../../../constants/appConfig'
import CommonTextInput from '../../common/Input/CommonTextInput'
import SmsAuthCodeInput from '../../common/Input/SmsAuthCodeInput'
import ImageInput from '../../common/Input/ImageInput'
import {submitInputData, INPUT_FORM_SUBMIT_TYPE} from '../../../action/authActions'
import {submitDoctorFormData, DOCTOR_FORM_SUBMIT_TYPE} from '../../../action/doctorAction'
import * as Toast from '../../common/Toast'
import {isInputValid} from '../../../selector/inputFormSelector'
import MedicalLabPicker from '../../common/Input/MedicalLabPicker'
import RegionPicker from '../../common/Input/RegionPicker'
import ImageGroupViewer from '../../common/Input/ImageGroupViewer'
import ImageGroupInput from '../../common/Input/ImageGroupInput'
import {activeUserInfo} from '../../../selector/authSelector'


const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

let commonForm = Symbol('commonForm')

const nameInput = {
  formKey: commonForm,
  stateKey: Symbol('nameInput'),
  type: "nameInput",

}
const IDInput = {
  formKey: commonForm,
  stateKey: Symbol('IDInput'),
  type: "IDInput",
  placeholder: "请填写居民身份证号"
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
const regionPicker = {
  formKey: commonForm,
  stateKey: Symbol('regionPicker'),
  type: "regionPicker",
  placeholder: "点击选择地址"
}

const inviteCodeInput = {
  formKey: commonForm,
  stateKey: Symbol('inviteCodeInput'),
  type: "inviteCodeInput",
}

class promoterAuth extends Component {
  constructor(props) {
    super(props)
  }

  onButtonPress() {

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
        <Header headerContainerStyle={styles.header}
                leftType="text"
                leftStyle={styles.left}
                leftText="取消"
                leftPress={()=> {
                  Actions.pop()
                }}
                title="推广认证"
                titleStyle={styles.left}
                rightType=""
        >
        </Header>

        <View style={styles.body}>
          <KeyboardAwareScrollView
            keyboardDismissMode='on-drag'
            automaticallyAdjustContentInsets={false}
          >
            <View style={styles.adv}>
              <Text style={styles.advText}>欢迎加入吾爱推广大使，完成认证可赚取高额收益</Text>
            </View>
            <View style={styles.certify}>
              <View style={styles.inputBox}>
                <Text style={styles.maintext}>姓名</Text>
                <View style={{flex: 1}}>
                  <CommonTextInput {...nameInput} placeholder="与身份证姓名保持一致" containerStyle={{height: normalizeH(38),}}
                                   inputStyle={{backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0,}}/>
                </View>
              </View>
              <View style={styles.inputBox}>
                <Text style={styles.maintext}>身份证号</Text>
                <View style={{flex: 1}}>
                  <CommonTextInput {...IDInput} containerStyle={{height: normalizeH(38)}} maxLength={18}
                                   inputStyle={{backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0,}}/>
                </View>
              </View>
              <View style={styles.inputBox}>
                <Text style={styles.maintext}>手机号</Text>
                <View style={{flex: 1}}>
                  <PhoneInput {...phoneInput} initValue={this.props.userInfo.phone} placeholder="仅用于客服与你联系" editable={false}
                              inputStyle={styles.phoneInputStyle}/>
                </View>
              </View>
              <View style={styles.inputBox}>
                <Text style={styles.maintext}>验证码</Text>
                <View style={{flex: 1,}}>
                  <SmsAuthCodeInput {...smsAuthCodeInput} containerStyle={{height: normalizeH(38)}}
                                    textInput={styles.smsAuthCodeTextInput}
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
            </View>
            <View style={styles.detail}>
              <View style={styles.inputBox}>
                <Text style={styles.maintext}>地址</Text>
                <View style={{flex: 1}}>
                  <RegionPicker {...regionPicker} containerStyle={{height: normalizeH(38)}}
                                inputStyle={{backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0,}}/>
                </View>
              </View>
              <View style={styles.inputBox}>
                <Text style={styles.maintext}>邀请码</Text>
                <CommonTextInput
                  {...inviteCodeInput}
                  placeholder="输入邀请码"
                  containerStyle={{height: normalizeH(38)}} maxLength={18}
                  inputStyle={{backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0,}}
                />
              </View>
            </View>
            <TouchableOpacity style={styles.getInvitationWrap} onPress={()=>Actions.GET_INVITE_CODE()}>
              <Text style={{color: THEME.colors.green, fontSize: em(16)}}>如何获取邀请码？</Text>
            </TouchableOpacity>
            <View style={styles.footer}>
              <CommonButton
                title="成为推广大使"
                onPress={this.onButtonPress}
              />

              <TouchableOpacity style={styles.shopRegistProtocalWrap} onPress={()=> {
              }}>
                <Text style={{color: THEME.colors.light, fontSize: em(12)}}>我已阅读</Text>
                <Text style={{color: THEME.colors.green, fontSize: em(12)}}>《{appConfig.APP_NAME}吾爱推广协议》</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </View>

      </View>
    )
  }
}
const mapStateToProps = (state, ownProps) => {
  let phoneValid
  let isValid = isInputValid(state, commonForm, phoneInput.stateKey)
  let userInfo = activeUserInfo(state)
  if (!isValid.isValid) {
    phoneValid = false
  } else {
    phoneValid = true
  }
  return {
    phoneValid: phoneValid,
    userInfo: userInfo,
  }
}
const mapDispatchToProps = (dispatch) => bindActionCreators({
  //submitDoctorFormData,
  submitInputData,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(promoterAuth)


const styles = StyleSheet.create(
  {
    container: {
      flex: 1
    },
    header: {
      backgroundColor: '#50E3C2',
    },
    left: {
      fontFamily: 'PingFangSC-Regular',
      fontSize: 17,
      color: '#FFFFFF',
      letterSpacing: -0.41,
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
      width: PAGE_WIDTH,
      backgroundColor: 'rgba(0,0,0,0.05)',
      //opacity:0.08
    },
    adv: {
      width: PAGE_WIDTH,
      height: normalizeH(44),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(80,226,193,0.23)',
      // opacity:0.23
    },
    advText: {
      color: 'black',
      fontSize: em(12),
      // opacity:1,
    },
    certify: {
      marginTop: normalizeH(15),
      backgroundColor: '#FFFFFF',
    },
    inputBox: {
      height: normalizeH(40),
      borderBottomWidth: 1,
      borderBottomColor: '#C8C7CC',
      flexDirection: 'row',
      alignItems: 'center',
    },
    phoneInputBox: {},
    trip: {
      height: normalizeH(44),
      backgroundColor: 'rgba(80, 226, 193, 0.23)',
      justifyContent: 'center',
      alignItems: 'center'

    },
    maintext: {
      width: normalizeW(66),
      marginLeft: normalizeW(20),
      fontFamily: 'PingFangSC-Regular',
      fontSize: em(16),
      color: '#656565',
    },
    smsAuthCodeTextInput: {
      height: normalizeH(38),
      backgroundColor: "#FFFFFF",
      borderWidth: 0,
      paddingLeft: 0,
      paddingRight: 0,
    },
    phoneInputStyle: {
      height: normalizeH(38),
      backgroundColor: '#FFFFFF',
      borderWidth: 0,
      paddingLeft: 0,
    },
    detail: {
      marginTop: normalizeH(30),
      backgroundColor: '#FFFFFF',

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
    },
  }
)