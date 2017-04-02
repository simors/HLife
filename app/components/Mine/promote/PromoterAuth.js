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
import {submitInputData, INPUT_FORM_SUBMIT_TYPE} from '../../../action/authActions'
import {promoterCertification} from '../../../action/promoterAction'
import * as Toast from '../../common/Toast'
import {isInputValid} from '../../../selector/inputFormSelector'
import RegionPicker from '../../common/Input/RegionPicker'
import {activeUserInfo} from '../../../selector/authSelector'
import ImageInput from '../../common/Input/ImageInput'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

let commonForm = Symbol('commonForm')

const nameInput = {
  formKey: commonForm,
  stateKey: Symbol('nameInput'),
  type: "nameInput",
  checkValid: (data) => {
    if (data && data.text && data.text.length > 0) {
      return {isVal: true, errMsg: '验证通过'}
    }
    return {isVal: false, errMsg: '请输入姓名'}
  }
}
const IDInput = {
  formKey: commonForm,
  stateKey: Symbol('IDInput'),
  type: "IDInput",
  placeholder: "请填写居民身份证号",
  checkValid: (data) => {
    if (data && data.text && data.text.length > 0) {
      return {isVal: true, errMsg: '验证通过'}
    }
    return {isVal: false, errMsg: '请输入身份证号'}
  }
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
  placeholder: "点击选择地址",
  checkValid: (data) => {
    if (data && data.text) {
      return {isVal: true, errMsg: '验证通过'}
    }
    return {isVal: false, errMsg: '请选择常驻地'}
  }
}

const inviteCodeInput = {
  formKey: commonForm,
  stateKey: Symbol('inviteCodeInput'),
  type: "inviteCodeInput",
  checkValid: (data) => {
    if (data && data.text && data.text.length > 0) {
      return {isVal: true, errMsg: '验证通过'}
    }
    return {isVal: false, errMsg: '请输入邀请码'}
  }
}

const idCardPhotoInput = {
  formKey: commonForm,
  stateKey: Symbol('idCardPhotoInput'),
  type: "idCardPhotoInput",
  checkValid: (data) => {
    if (data && data.text && data.text.length > 0) {
      return {isVal: true, errMsg: '验证通过'}
    }
    return {isVal: false, errMsg: '请上传身份证照片'}
  }
}

class PromoterAuth extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inviteCode: '',
    }
  }

  onButtonPress = () => {
    this.props.promoterCertification({
      formKey: commonForm,
      success: () => {Toast.show('注册为推广员成功')},
      error: (err) => {
        Toast.show(err.message)
      },
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
        <Header headerContainerStyle={styles.header}
                leftType="icon"
                leftIconName="ios-arrow-back"
                leftStyle={{color: '#FFFFFF'}}
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
            keyboardShouldPersistTaps={true}
            automaticallyAdjustContentInsets={false}
            contentContainerStyle={{backgroundColor: 'rgba(0, 0, 0, 0.05)'}}
          >
            <View style={styles.adv}>
              <Text style={styles.advText}>欢迎加入{appConfig.APP_NAME}推广联盟，完成认证可赚取高额收益</Text>
            </View>
            <View style={styles.certify}>
              <View style={styles.inputBox}>
                <Text style={styles.maintext}>姓名</Text>
                <View style={{flex: 1}}>
                  <CommonTextInput {...nameInput} placeholder="与身份证姓名保持一致" containerStyle={{height: normalizeH(42),}}
                                   inputStyle={{backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0, fontSize: em(17),}}/>
                </View>
              </View>
              <View style={styles.inputBox}>
                <Text style={styles.maintext}>手机号</Text>
                <View style={{flex: 1}}>
                  <PhoneInput {...phoneInput} initValue={this.props.userInfo.phone} placeholder="仅用于客服与你联系"
                              editable={false} showClearBtn={false} inputStyle={styles.phoneInputStyle}/>
                </View>
              </View>
              <View style={styles.inputBox}>
                <Text style={styles.maintext}>验证码</Text>
                <View style={{flex: 1,}}>
                  <SmsAuthCodeInput {...smsAuthCodeInput} containerStyle={{height: normalizeH(42)}}
                                    textInput={styles.smsAuthCodeTextInput}
                                    inputContainer={{paddingLeft: 17, paddingRight: 17}}
                                    placeholder = "填写手机验证码"
                                    codeTextContainer={{width: normalizeW(115), height: normalizeH(35)}}
                                    codeTextContainerDisable={{width: normalizeW(115), height: normalizeH(35)}}
                                    codeText={{fontSize: em(15)}}
                                    getSmsAuCode={() => this.smsCode()}
                                    reset={!this.props.phoneValid}
                  />
                </View>
              </View>
            </View>
            <View style={styles.detail}>
              <View style={styles.inputBox}>
                <Text style={styles.maintext}>身份证</Text>
                <View style={{flex: 1}}>
                  <CommonTextInput {...IDInput} containerStyle={{height: normalizeH(42)}} maxLength={18}
                                   inputStyle={{backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0, fontSize: em(17),}}/>
                </View>
              </View>
              <View style={styles.inputBox}>
                <Text style={styles.maintext}>常驻地</Text>
                <View style={{flex: 1}}>
                  <RegionPicker {...regionPicker} mode="segment" containerStyle={{height: normalizeH(42)}}
                                inputStyle={{backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0, fontSize: em(17),}}/>
                </View>
              </View>
              <View style={styles.inputBox}>
                <Text style={styles.maintext}>邀请码</Text>
                <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
                  <CommonTextInput
                    {...inviteCodeInput}
                    placeholder="输入邀请码"
                    autoCorrect={false}
                    containerStyle={{height: normalizeH(42), paddingRight: 0}} maxLength={8}
                    inputStyle={{backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0, fontSize: em(17),}}
                    initValue={this.state.inviteCode}
                  />
                  <TouchableOpacity style={{marginRight: normalizeW(25)}}
                                    onPress= {()=> {
                                      Actions.QRCODEREADER({
                                        readQRSuccess: (inviteCode) => {
                                          this.setState({inviteCode: inviteCode})
                                          Actions.pop()
                                        }
                                      })
                                    }}>
                    <Image style={{width: 20, height: 20}} source={require('../../../assets/images/scan_red.png')} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={{backgroundColor: '#FFF', height: normalizeH(37)}}>
              <TouchableOpacity style={styles.getInvitationWrap} onPress={()=>Actions.GET_INVITE_CODE()}>
                <Image style={{width: 12, height: 12}} source={require('../../../assets/images/question_code.png')}/>
                <Text style={{color: THEME.colors.green, fontSize: em(12), marginLeft: normalizeW(5)}}>如何获取邀请码？</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.certificateView}>
              <View style={styles.certificateImgView}>
                <View style={{marginLeft: normalizeW(15)}}>
                  <Text style={styles.certificateTitle}>身份认证</Text>
                  <Text style={{marginTop: normalizeH(15), fontSize: em(12), color: '#B2B2B2'}}>请上传身份证正面照</Text>
                </View>
                <ImageInput
                  {...idCardPhotoInput}
                  containerStyle={{width: normalizeW(115), height: normalizeH(90), marginRight: normalizeW(15)}}
                  addImageBtnStyle={{top:0, left: 0, width: normalizeW(115), height: normalizeH(90)}}
                  choosenImageStyle={{width: normalizeW(115), height: normalizeH(90)}}
                  addImage={require('../../../assets/images/upload_certificate.png')}
                />
              </View>

              <View style={styles.footer}>
                <CommonButton
                  title="成为推广大使"
                  onPress={this.onButtonPress}
                />

                <TouchableOpacity style={styles.shopRegistProtocalWrap} onPress={()=> {}}>
                  <Text style={{color: THEME.colors.light, fontSize: em(12)}}>我已阅读</Text>
                  <Text style={{color: THEME.colors.green, fontSize: em(12)}}>《{appConfig.APP_NAME}推广协议》</Text>
                </TouchableOpacity>
              </View>
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
  promoterCertification,
  submitInputData,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PromoterAuth)


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    backgroundColor: THEME.base.mainColor,
  },
  left: {
    fontSize: em(17),
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
    backgroundColor: '#FFF',
    //opacity:0.08
  },
  adv: {
    width: PAGE_WIDTH,
    height: normalizeH(32),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,157,78,0.20);',
  },
  advText: {
    color: '#FF7819',
    fontSize: em(12),
  },
  certify: {
    backgroundColor: '#FFFFFF',
  },
  inputBox: {
    height: normalizeH(44),
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
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
    width: normalizeW(75),
    marginLeft: normalizeW(15),
    fontSize: em(17),
    color: '#5a5a5a',
  },
  smsAuthCodeTextInput: {
    height: normalizeH(42),
    backgroundColor: "#FFFFFF",
    borderWidth: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
  phoneInputStyle: {
    height: normalizeH(42),
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    paddingLeft: 0,
  },
  detail: {
    marginTop: normalizeH(8),
    backgroundColor: '#FFFFFF',

  },
  getInvitationWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  footer: {
    paddingBottom: normalizeH(24),
  },
  shopRegistProtocalWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalizeH(10)
  },
  certificateView: {
    height: normalizeH(226),
    backgroundColor: '#FFF',
    justifyContent: 'space-between',
    marginTop: normalizeH(8),
  },
  certificateImgView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: normalizeH(10),
  },
  certificateTitle: {
    fontSize: em(17),
    color: '#5A5A5A',
  },
})