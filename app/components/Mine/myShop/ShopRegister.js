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
import AV from 'leancloud-storage'
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
import {initInputForm, inputFormUpdate} from '../../../action/inputFormActions'
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
  checkValid: (data)=>{
    if (data && data.text && data.text.length > 0 && (data.text !== '未知')) {
      return {isVal: true, errMsg: '验证通过'}
    }
    return {isVal: false, errMsg: '输入有误'}
  },
  initValue: {text: '未知'}
}
const shopAddrInput = {
  formKey: commonForm,
  stateKey: Symbol('shopAddrInput'),
  type: "shopAddrInput",
  checkValid: (data)=>{
    if (data && data.text && data.text.length > 0 && (data.text !== '未知')) {
      return {isVal: true, errMsg: '验证通过'}
    }
    return {isVal: false, errMsg: '输入有误'}
  },
  initValue: {text: '未知'}
}
const shopGeoInput = {
  formKey: commonForm,
  stateKey: Symbol('shopGeoInput'),
  type: "shopGeoInput",
  checkValid: ()=>{return {isVal: true}},
  initValue: {text: []}
}
const shopGeoCityInput = {
  formKey: commonForm,
  stateKey: Symbol('shopGeoCityInput'),
  type: "shopGeoCityInput",
  checkValid: ()=>{return {isVal: true}},
  initValue: {text: '未知'}
}
const shopGeoDistrictInput = {
  formKey: commonForm,
  stateKey: Symbol('shopGeoDistrictInput'),
  type: "shopGeoDistrictInput",
  checkValid: ()=>{return {isVal: true}},
  initValue: {text: '未知'}
}
const invitationCodeInput = {
  formKey: commonForm,
  stateKey: Symbol('invitationCodeInput'),
  type: "invitationCodeInput",
  checkValid: ()=>{return {isVal: true}},
  initValue: {text: '-1'}
}

class ShopRegister extends Component {
  constructor(props) {
    super(props)

    this.state = {
      shopName: '点击选择店铺名称',
      shopAddress: '点击选择店铺地址',
      qRCode: ''
    }

  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {

    })

    this.props.initInputForm(shopNameInput)
    this.props.initInputForm(shopAddrInput)
    this.props.initInputForm(shopGeoInput)
    this.props.initInputForm(shopGeoCityInput)
    this.props.initInputForm(shopGeoDistrictInput)
  }

  componentWillReceiveProps(nextProps) {
    // console.log('componentWillReceiveProps.nextProps===', nextProps)
    if(nextProps.shopName) {
      this.setState({
        shopName: nextProps.shopName
      })
      nextProps.inputFormUpdate({
        formKey: shopNameInput.formKey,
        stateKey: shopNameInput.stateKey,
        data: {text:nextProps.shopName},
      })
    }
    if(nextProps.shopAddress) {
      this.setState({
        shopAddress: nextProps.shopAddress
      })
      nextProps.inputFormUpdate({
        formKey: shopAddrInput.formKey,
        stateKey: shopAddrInput.stateKey,
        data: {text:nextProps.shopAddress},
      })
    }
    if(nextProps.latitude && nextProps.longitude) {
      nextProps.inputFormUpdate({
        formKey: shopGeoInput.formKey,
        stateKey: shopGeoInput.stateKey,
        data: {text:[nextProps.latitude, nextProps.longitude]},
      })
    }
    if(nextProps.currentCity) {
      nextProps.inputFormUpdate({
        formKey: shopGeoCityInput.formKey,
        stateKey: shopGeoCityInput.stateKey,
        data: {text:nextProps.currentCity},
      })
    }
    if(nextProps.currentDistrict) {
      nextProps.inputFormUpdate({
        formKey: shopGeoDistrictInput.formKey,
        stateKey: shopGeoDistrictInput.stateKey,
        data: {text:nextProps.currentDistrict},
      })
    }
    if(nextProps.qRCode) {
      this.setState({
        qRCode: nextProps.qRCode
      })
      nextProps.inputFormUpdate({
        formKey: invitationCodeInput.formKey,
        stateKey: invitationCodeInput.stateKey,
        data: {text:nextProps.qRCode},
      })
    }

  }

  submitSuccessCallback() {
    Actions.SHOPR_EGISTER_SUCCESS()
  }

  submitErrorCallback(error) {
    Toast.show(error.message)
  }

  onButtonPress = () => {
    // console.log('onButtonPress===submitFormData')
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
            automaticallyAdjustContentInsets={false}
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
                    codeText={{fontSize: em(12)}}
                    getSmsAuCode={() => this.smsCode()}
                    reset={!this.props.phoneValid}
                  />
                </View>
              </View>

              <View style={[styles.inputWrap, {marginTop: normalizeH(15)}]}>
                <View style={styles.inputLabelBox}>
                  <Text style={styles.inputLabel}>店铺名称</Text>
                </View>
                <View style={[styles.inputBox, styles.shopAddress]}>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  >
                    <TouchableOpacity
                      style={styles.shopAddressContainer}
                      onPress={()=>{Actions.SHOP_ADDRESS_SELECT()}}>
                      <Text style={styles.shopAddressTxt}>{this.state.shopName}</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              </View>

              <View style={styles.inputWrap}>
                <View style={styles.inputLabelBox}>
                  <Text style={styles.inputLabel}>店铺地址</Text>
                </View>
                <View style={[styles.inputBox, styles.shopAddress]}>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  >
                    <TouchableOpacity
                      style={styles.shopAddressContainer}
                      onPress={()=>{Actions.SHOP_ADDRESS_SELECT()}}>
                      <Text style={styles.shopAddressTxt}>{this.state.shopAddress}</Text>
                    </TouchableOpacity>
                  </ScrollView>
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
                    initValue={this.state.qRCode}
                  />
                </View>
                <TouchableOpacity style={{marginTop: normalizeH(16), marginRight: normalizeW(25), alignItems: 'flex-end'}} onPress= {()=> {Actions.QRCODEREADER()}}>
                  <Image style={{width: 20, height: 20}}  source={require('../../../assets/images/扫一扫.png')} />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.getInvitationWrap} onPress= {()=> {
              Actions.QRCODEREADER()
            }}>
              <Text style={{color:THEME.colors.green,fontSize: em(16)}}>如何获取邀请码？</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <CommonButton
                title="提交店铺"
                onPress={this.onButtonPress}
              />

              <TouchableOpacity style={styles.shopRegistProtocalWrap}>
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
  submitInputData,
  inputFormUpdate,
  initInputForm,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ShopRegister)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)'
  },
  shopAddress: {
    height: normalizeH(50),
    justifyContent: 'center'
  },
  shopAddressContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: normalizeW(17)
  },
  shopAddressTxt: {
    fontSize: em(16),
    color: '#B2B2B2'
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
        marginTop: normalizeH(64),
      },
      android: {
        marginTop: normalizeH(44)
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
    width: normalizeW(86),
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