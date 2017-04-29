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

import {normalizeW, normalizeH, normalizeBorder, em} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'
import * as appConfig from '../../../constants/appConfig'
import Header from '../../common/Header'
import CommonButton from '../../common/CommonButton'
import PhoneInput from '../../common/Input/PhoneInput'
import CommonTextInput from '../../common/Input/CommonTextInput'
import SmsAuthCodeInput from '../../common/Input/SmsAuthCodeInput'
import {submitFormData, submitInputData,INPUT_FORM_SUBMIT_TYPE} from '../../../action/authActions'
import {fetchUserOwnedShopInfo} from '../../../action/shopAction'
import {getShopTenant} from '../../../action/promoterAction'
import {initInputForm, inputFormUpdate} from '../../../action/inputFormActions'
import * as Toast from '../../common/Toast'
import ImageInput from '../../common/Input/ImageInput'
import * as authSelector from '../../../selector/authSelector'
import * as promoterSelector from '../../../selector/promoterSelector'
import Loading from '../../common/Loading'
import * as Utils from '../../../util/Utils'
import * as configSelector from '../../../selector/configSelector'
import {store} from '../../../store/persistStore'
import * as AVUtils from '../../../util/AVUtils'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

let commonForm = Symbol('commonForm')

// const nameInput = {
//   formKey: commonForm,
//   stateKey: Symbol('nameInput'),
//   type: "nameInput",
//   checkValid: (data)=>{
//     if (data && data.text && data.text.length > 0) {
//       return {isVal: true, errMsg: '验证通过'}
//     }
//     return {isVal: false, errMsg: '姓名为空'}
//   },
// }
const phoneInput = {
  formKey: commonForm,
  stateKey: Symbol('phoneInput'),
  type: "phoneInput",
  checkValid: (data)=>{
    if (data && data.text && data.text.length > 0) {
      return {isVal: true, errMsg: '验证通过'}
    }
    return {isVal: false, errMsg: '手机号为空'}
  },
}
const smsAuthCodeInput = {
  formKey: commonForm,
  stateKey: Symbol('smsAuthCodeInput'),
  type: "smsAuthCodeInput",
  checkValid: (data)=>{
    if (data && data.text && data.text.length > 0) {
      return {isVal: true, errMsg: '验证通过'}
    }
    return {isVal: false, errMsg: '验证码为空'}
  },
}
const shopNameInput = {
  formKey: commonForm,
  stateKey: Symbol('shopNameInput'),
  type: "shopNameInput",
  checkValid: (data)=>{
    if (data && data.text && data.text.length > 0 && (data.text !== '未知')) {
      return {isVal: true, errMsg: '验证通过'}
    }
    return {isVal: false, errMsg: '店铺名称为空'}
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
    return {isVal: false, errMsg: '店铺地址为空'}
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
  checkValid: (data)=>{
    if (data && data.text && data.text.length > 0 && (data.text !== '-1')) {
      return {isVal: true, errMsg: '验证通过'}
    }
    return {isVal: false, errMsg: '邀请码为空'}
  },
  initValue: {text: '-1'}
}

// const certificationInput = {
//   formKey: commonForm,
//   stateKey: Symbol('certificationInput'),
//   type: "certificationInput",
//   checkValid: (data)=>{
//     if (data && data.text && data.text.length > 0) {
//       return {isVal: true, errMsg: '验证通过'}
//     }
//     return {isVal: false, errMsg: '店铺认证图片为空'}
//   },
// }

class ShopRegister extends Component {
  constructor(props) {
    super(props)

    this.state = {
      shopName: '点击输入店铺名称',
      shopAddress: '标注您的店铺地址',
      qRCode: ''
    }

  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {

    })

    // this.props.initInputForm(shopNameInput)
    // this.props.initInputForm(shopAddrInput)
    // this.props.initInputForm(shopGeoInput)
    // this.props.initInputForm(shopGeoCityInput)
    // this.props.initInputForm(shopGeoDistrictInput)
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
        data: {text:[nextProps.latitude, nextProps.longitude].join(',')},
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
    // if(nextProps.qRCode) {
    //   this.setState({
    //     qRCode: nextProps.qRCode
    //   })
    //   nextProps.inputFormUpdate({
    //     formKey: invitationCodeInput.formKey,
    //     stateKey: invitationCodeInput.stateKey,
    //     data: {text:nextProps.qRCode},
    //   })
    // }

  }

  submitSuccessCallback = (shopInfo) => {
    this.isSubmiting = false
    Loading.hide(this.loading)
    // console.log('shopInfo===', shopInfo)
    this.props.getShopTenant({
      province: shopInfo.geoProvince,
      city: shopInfo.geoCity,
      success: (tenant) =>{
        this.props.fetchUserOwnedShopInfo()
        Actions.PAYMENT({
          metadata: {'shopId':shopInfo.objectId, 'tenant': tenant, 'user': this.props.userInfo.id},
          price: tenant,
          popNum: 2,
          paySuccessJumpScene: 'SHOPR_EGISTER_SUCCESS',
          paySuccessJumpSceneParams: {
            shopId: shopInfo.objectId,
            tenant: tenant,
          },
          payErrorJumpScene: 'MINE',
          payErrorJumpSceneParams: {}
        })
      },
      error: (error)=>{
        AVUtils.switchTab('MINE')
        // Actions.MINE()
      }
    })
  }

  submitErrorCallback = (error) => {
    this.isSubmiting = false
    Loading.hide(this.loading)
    Toast.show(error.message || '店铺注册失败')

    this.props.inputFormUpdate({
      formKey: smsAuthCodeInput.formKey,
      stateKey: smsAuthCodeInput.stateKey,
      data: {text: ''}
    })

    this.props.inputFormUpdate({
      formKey: invitationCodeInput.formKey,
      stateKey: invitationCodeInput.stateKey,
      data: {text: ''}
    })
  }

  onButtonPress = () => {
    // console.log('onButtonPress===submitFormData')
    if(this.isSubmiting) {
      return
    }
    this.isSubmiting = true
    this.loading = Loading.show()
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
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="注册店铺"
          headerContainerStyle={styles.headerContainerStyle}
          leftStyle={styles.headerLeftStyle}
          titleStyle={styles.headerTitleStyle}
        />
        <View style={styles.body}>

          <KeyboardAwareScrollView
            contentContainerStyle={{backgroundColor: '#F5F5F5'}}
            automaticallyAdjustContentInsets={false}
            keyboardShouldPersistTaps={true}
          >
            <View style={styles.subTitleWrap}>
              <Text style={styles.subTitle}>欢迎加入{appConfig.APP_NAME}，给你的店铺带来更好的收入</Text>
            </View>
            
            <View style={styles.inputsWrap}>
              {/*
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
              */}

              <View style={styles.inputWrap}>
                <View style={styles.inputLabelBox}>
                  <Text style={styles.inputLabel}>手机号</Text>
                </View>
                <View style={styles.inputBox}>
                  <PhoneInput
                    {...phoneInput}
                    placeholder="仅用于客服与你联系"
                    initValue={this.props.phone}
                    editable={false}
                    showClearBtn={false}
                    containerStyle={styles.containerStyle}
                    inputStyle={[styles.inputStyle, {height: normalizeH(52)}]}/>
                </View>
              </View>

              <View style={styles.inputWrap}>
                <View style={styles.inputLabelBox}>
                  <Text style={styles.inputLabel}>验证码</Text>
                </View>
                <View style={styles.inputBox}>
                  <SmsAuthCodeInput
                    {...smsAuthCodeInput}
                    containerStyle={{height:normalizeH(52),}}
                    textInput={{height:normalizeH(52),backgroundColor: '#fff',borderWidth:0,paddingLeft:0}}
                    inputContainer={{paddingLeft: 0, paddingRight: 17}}
                    placeholder = "填写手机验证码"
                    codeTextContainer={{width: normalizeW(115), height: normalizeH(35)}}
                    codeTextContainerDisable={{width: normalizeW(115), height: normalizeH(35)}}
                    codeText={{fontSize: 15}}
                    getSmsAuCode={() => this.smsCode()}
                    reset={false}
                  />
                </View>
              </View>

              <View style={[styles.inputWrap, {marginTop: normalizeH(8)}]}>
                <View style={styles.inputLabelBox}>
                  <Text style={styles.inputLabel}>店铺名称</Text>
                </View>
                <TouchableOpacity style={{flex:1}}
                      onPress={()=>{
                        Actions.SHOP_ADDRESS_SELECT({
                          shopName:this.state.shopName == '点击输入店铺名称' ? '' : this.state.shopName,
                          shopAddress:this.state.shopAddress
                        })}}>
                  <View style={[styles.inputBox, styles.shopAddress, {marginTop: normalizeH(5)}]}>
                    <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                    >
                      <View style={styles.shopAddressContainer}>
                        <Text style={styles.shopAddressTxt}>{this.state.shopName}</Text>
                      </View>
                    </ScrollView>
                  </View>
                </TouchableOpacity>
                <CommonTextInput
                  {...shopNameInput}
                  outerContainerStyle={{position:'absolute',height:0,width:0}}
                  containerStyle={{height:0,width:0}}
                  inputStyle={{height:0,width:0}}
                />
              </View>

              <View style={styles.inputWrap}>
                <View style={styles.inputLabelBox}>
                  <Text style={styles.inputLabel}>店铺地址</Text>
                </View>
                <TouchableOpacity style={{flex:1}}
                      onPress={()=>{
                        Actions.SHOP_ADDRESS_SELECT({
                          shopName:this.state.shopName == '点击输入店铺名称' ? '' : this.state.shopName,
                          shopAddress:this.state.shopAddress
                        })}}>
                  <View style={[styles.inputBox, styles.shopAddress]}>
                    <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                    >
                      <View style={styles.shopAddressContainer}>
                        <Text style={styles.shopAddressTxt}>{this.state.shopAddress}</Text>
                      </View>
                    </ScrollView>
                  </View>
                </TouchableOpacity>
                <CommonTextInput
                  {...shopAddrInput}
                  outerContainerStyle={{position:'absolute',height:0,width:0}}
                  containerStyle={{height:0,width:0}}
                  inputStyle={{height:0,width:0}}
                />
                <CommonTextInput
                  {...shopGeoInput}
                  outerContainerStyle={{position:'absolute',height:0,width:0}}
                  containerStyle={{height:0,width:0}}
                  inputStyle={{height:0,width:0}}
                />
                <CommonTextInput
                  {...shopGeoCityInput}
                  outerContainerStyle={{position:'absolute',height:0,width:0}}
                  containerStyle={{height:0,width:0}}
                  inputStyle={{height:0,width:0}}
                />
                <CommonTextInput
                  {...shopGeoDistrictInput}
                  outerContainerStyle={{position:'absolute',height:0,width:0}}
                  containerStyle={{height:0,width:0}}
                  inputStyle={{height:0,width:0}}
                />
              </View>

              <View style={styles.inputWrap}>
                <View style={styles.inputLabelBox}>
                  <Text style={styles.inputLabel}>邀请码</Text>
                </View>
                <View style={styles.inputBox}>
                  <CommonTextInput
                    {...invitationCodeInput}
                    placeholder="输入邀请码"
                    autoCorrect={false}
                    containerStyle={styles.containerStyle}
                    inputStyle={styles.inputStyle}
                    initValue={this.state.qRCode}
                  />
                </View>
                <TouchableOpacity style={{marginTop: normalizeH(16), marginRight: normalizeW(62), alignItems: 'flex-end'}}
                                  onPress= {()=> {
                                    Actions.QRCODEREADER({
                                      readQRSuccess: (code) => {
                                        this.setState({
                                          qRCode: code
                                        })
                                        this.props.inputFormUpdate({
                                          formKey: invitationCodeInput.formKey,
                                          stateKey: invitationCodeInput.stateKey,
                                          data: {text:code},
                                        })
                                        Actions.pop()
                                      }
                                    })
                                  }}>
                  <Image style={{width: 20, height: 20}}  source={require('../../../assets/images/scan_red.png')} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputWrap}>
                <TouchableOpacity style={styles.getInvitationWrap} onPress= {()=> {
                  Actions.QRCODEREADER()
                }}>
                  <Image style={{width: 12, height: 12}} source={require('../../../assets/images/question_code.png')}/>
                  <Text style={{marginLeft: normalizeW(5), color:THEME.colors.green,fontSize: 12}}>如何获取邀请码？</Text>
                </TouchableOpacity>
              </View>

              {/*
              <View style={[styles.inputWrap, {marginTop: normalizeH(8)}]}>
                <View style={{flex: 1}}>
                  <Text style={[styles.inputLabel, {marginTop: normalizeH(33)}]}>店铺认证</Text>
                  <Text style={{marginTop: normalizeH(15), fontSize: em(12), color: '#B2B2B2'}}>请上传有效营业执照</Text>
                </View>
                <ImageInput
                  {...certificationInput}
                  containerStyle={{width: 115, height: 90, marginTop: normalizeH(10), marginBottom: normalizeH(30), marginRight: normalizeW(15)}}
                  addImageBtnStyle={{top:0, left: 0, width: 115, height: 90}}
                  choosenImageStyle={{width: 115, height: 90}}
                  addImage={require('../../../assets/images/upload_certificate.png')}
                />
              </View>
              */}

            </View>

            <View style={[styles.footer, {marginTop:8,paddingTop: 30}]}>
              <CommonButton
                title="提交店铺"
                onPress={this.onButtonPress}
              />

              <TouchableOpacity style={styles.shopRegistProtocalWrap}>
                <Text style={{color:THEME.colors.light,fontSize: 12}}>我已阅读</Text>
                <Text style={{color:THEME.colors.green,fontSize: 12}}>《{appConfig.APP_NAME}推广协议》</Text>
              </TouchableOpacity>
            </View>

          </KeyboardAwareScrollView>

        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {

  const activeUserInfo = authSelector.activeUserInfo(state)
  // console.log('activeUserInfo===', activeUserInfo)
  const phone = activeUserInfo.phone

  return {
    phone: phone,
    userInfo: activeUserInfo,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  submitFormData,
  submitInputData,
  inputFormUpdate,
  initInputForm,
  getShopTenant,
  fetchUserOwnedShopInfo
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ShopRegister)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'rgba(0, 0, 0, 0.05)'
    backgroundColor: '#fff'
  },
  shopAddress: {
    height: normalizeH(52),
    justifyContent: 'center',
    paddingRight:10
  },
  shopAddressContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  shopAddressTxt: {
    fontSize: 16,
    color: '#B2B2B2'
  },
  headerContainerStyle: {
    borderBottomWidth: 0,
    backgroundColor: THEME.colors.green
  },
  headerLeftStyle: {
    color: '#fff',
    fontSize: 24
  },
  headerTitleStyle: {
    color: '#fff',
  },
  body: {
    marginTop: normalizeH(64),
    flex: 1,
  },
  subTitleWrap: {
    height: normalizeH(32),
    backgroundColor: "rgba(255, 157, 78, 0.20)",
    justifyContent: 'center',
    alignItems: 'center'
  },
  subTitle: {
    fontSize: 12,
    color: '#FF7819'
  },
  inputsWrap: {

  },
  inputWrap: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: '#F5F5F5',
    borderStyle: 'solid',
    paddingLeft: normalizeW(15),
  },
  inputLabelBox: {
    width: normalizeW(85),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  inputLabel: {
    fontSize: 17,
    color: THEME.colors.inputLabel
  },
  inputBox: {
    flex: 1
  },
  containerStyle: {
    flex:1,
    paddingRight: 0,
    paddingLeft: 0,
  },
  inputStyle:{
    height: normalizeH(52),
    fontSize: 17,
    backgroundColor: '#fff',
    borderWidth: 0,
    paddingLeft: 0,
  },
  getInvitationWrap: {
    flex: 1,
    flexDirection: 'row',
    height: normalizeH(37),
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 0,
  },
  shopRegistProtocalWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalizeH(10)
  }

})