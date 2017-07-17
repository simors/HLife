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
import {submitFormData, submitInputData,INPUT_FORM_SUBMIT_TYPE} from '../../../action/authActions'
import {fetchUserOwnedShopInfo} from '../../../action/shopAction'
import {getShopTenant} from '../../../action/promoterAction'
import {initInputForm, inputFormUpdate} from '../../../action/inputFormActions'
import * as Toast from '../../common/Toast'
import * as authSelector from '../../../selector/authSelector'
import Loading from '../../common/Loading'
import * as AVUtils from '../../../util/AVUtils'
import TimerMixin from 'react-timer-mixin'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

let commonForm = Symbol('commonForm')

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

  }

  submitSuccessCallback = (shopInfo) => {
    // console.log('shopInfo===', shopInfo)
    this.props.getShopTenant({
      province: shopInfo.geoProvince,
      city: shopInfo.geoCity,
      success: (tenant) =>{
        this.props.fetchUserOwnedShopInfo()
        this.isSubmiting = false
        Loading.hide(this.loading)
        Actions.PAYMENT({
          metadata: {
            'shopId':shopInfo.objectId,
            'tenant': tenant,
            'user': this.props.userInfo.id,
            'dealType': appConfig.INVITE_SHOP
          },
          price: tenant,
          subject: '店铺入驻汇邻优店加盟费',
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
        this.isSubmiting = false
        Loading.hide(this.loading)
        AVUtils.switchTab('MINE')
        // Actions.MINE()
      }
    })
  }

  submitErrorCallback = (error) => {
    this.isSubmiting = false
    Loading.hide(this.loading)
    Toast.show(error.message || '店铺注册失败')
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
                    outContainerWrap={{borderWidth: 0}}
                    containerStyle={styles.containerStyle}
                    inputStyle={[styles.inputStyle, {height: normalizeH(52)}]}/>
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

Object.assign(ShopRegister.prototype, TimerMixin)

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