/**
 * Created by wanpeng on 2017/4/5.
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
import THEME from '../../constants/themes/theme1'
import * as appConfig from '../../constants/appConfig'
import Header from '../common/Header'
import CommonButton from '../common/CommonButton'
import * as authSelector from '../../selector/authSelector'
import {createPingppPayment} from '../../action/paymentActions'
import uuid from 'react-native-uuid'
import * as Toast from '../common/Toast'
import Popup from '@zzzkk2009/react-native-popup'
import {WXAppID} from '../../constants/appConfig'
import {ENV} from '../../util/global'

const PingPPModule = NativeModules.PingPPModule

class Payment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedChannel: 'wx',
      enableButton: true,
    }
  }

  componentWillMount() {

  }

  showErrorMessage = (errorCode) => {
    let errMessage = '支付异常'
    switch (errorCode) {
      case 'fail':
        errMessage = '支付失败'
        break
      case 'cancel':
        errMessage = '用户取消支付'
        break
      case 'invalid':
        errMessage = '找不到支付控件'
        break
      default:
        break
    }
    Popup.tip({
      title: '支付失败',
      content: errMessage,
      bnt: {
        text: '确认',
        style: {color: '#FF7819'},
        callback: ()=>{
          if(this.props.payErrorJumpScene) {
            Actions[this.props.payErrorJumpScene](this.props.payErrorJumpSceneParams)
          }else if (this.props.payErrorJumpBack) {
            Actions.pop()
          } else {
            Actions.MINE()
          }
        }
      }
    })
  }

  paymentCallback = (errorCode, result) => {
    console.log("errorCode:", errorCode)
    console.log("result:", result)
    if(errorCode == 0 || errorCode == 'success'){
      if(this.props.paySuccess){
        this.props.paySuccess()
      }
      Toast.show("支付成功")
      if(this.props.paySuccessJumpScene) {
        if(this.props.popNum) {
          Actions.pop({
            popNum: this.props.popNum
          })
        }else{
          Actions.pop()
        }
        setTimeout(()=>{
          Actions[this.props.paySuccessJumpScene](this.props.paySuccessJumpSceneParams)
        }, 10)
      }else{
        Actions.MINE()
      }
    }else{
      this.showErrorMessage(errorCode)
    }
  }

  submitSuccessCallback = (charge) => {
    console.log("get charge:", JSON.stringify(charge))
    this.setState({
      enableButton: true
    })
    if(Platform.OS === 'ios') {
      // PingPPModule.setDebugMode(true, () => {console.log("PingPPModule.setDebugMode success!")})
      PingPPModule.createPayment(charge, WXAppID, this.paymentCallback)
    } else if(Platform.OS === 'android') {
      PingPPModule.createPayment(JSON.stringify(charge), WXAppID, this.paymentCallback)
    }

  }

  submitErrorCallback = (error) => {
    this.setState({
      enableButton: true
    })
    this.showErrorMessage(error.code, error.message)
  }

  onPayment() {
    let order_no = uuid.v4().replace(/-/g, '').substr(0, 16)
    this.setState({
      enableButton: false
    })
    let realPrice = this.props.price
    if (__DEV__ || ENV == 'pre') {
      realPrice = 0.01
    }
    let paymentPayload = {
      subject: this.props.subject || '汇邻优店加盟费',
      order_no: order_no,
      amount: realPrice * 100,
      channel: this.state.selectedChannel,
      success: this.submitSuccessCallback,
      error: this.submitErrorCallback,
      metadata: this.props.metadata || {} //自定义参数
    }
    this.props.createPingppPayment(paymentPayload)
  }

  onSwitchChannel(channel) {
    if(this.state.selectedChannel == channel)
      return
    this.setState({
      selectedChannel: channel,
    })
  }


  render() {
    let realPrice = this.props.price
    if (__DEV__ || ENV == 'pre') {
      realPrice = 0.01
    }
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title={this.props.title || '收银台'}
        />
        <View style={styles.body}>
          <ScrollView>
            <View style={styles.amount}>
              <Text style={styles.amountText}>支付金额</Text>
              <Text style={styles.price}>¥ {realPrice}元</Text>
            </View>
            <Text style={styles.channelTrip}>选择支付方式</Text>
            <View style={styles.channel}>
              <TouchableOpacity style={styles.wx} onPress= {() => this.onSwitchChannel('wx')}>
                <Image source={require('../../assets/images/payment_weixin_36.png')}/>
                <Text style={{flex: 1, fontSize: 17, marginLeft: normalizeW(15)}}>微信</Text>
                <Image source={this.state.selectedChannel == 'wx'? require('../../assets/images/selected.png'): require('../../assets/images/unselect.png')}/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.alipay} onPress= {() => this.onSwitchChannel('alipay')}>
                <Image source={require('../../assets/images/payment_zhifubao_36.png')}/>
                <Text style={{flex: 1, fontSize: 17, marginLeft: normalizeW(15)}}>支付宝</Text>
                <Image source={this.state.selectedChannel == 'alipay'? require('../../assets/images/selected.png'): require('../../assets/images/unselect.png')}/>
              </TouchableOpacity>
            </View>
            <View style={{alignItems: 'center', marginTop: normalizeH(141)}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={{fontSize: 10, color: '#AAAAAA'}}>点击支付即表示已阅读并同意</Text>
                <Text style={{fontSize: 10, color: '#FF7819', paddingLeft: 5}}>[支付协议]</Text>
              </View>
              <Text style={{fontSize: 10, marginTop: 10, color: '#AAAAAA'}}>我们不会以任何形式索要银行账号和密码，并不会收取其他费用</Text>
            </View>
            <CommonButton
              buttonStyle={this.state.enableButton? styles.enableButton: styles.disableButton}
              title="支  付"
              onPress={()=>{this.onPayment()}}
              disabled = {!this.state.enableButton}
            />
          </ScrollView>
        </View>
      </View>
    )
  }
}

Payment.defaultProps = {
  price: 0.01, //单位元
  title: '',
}

const mapStateToProps = (state, ownProps) => {
  let currentUserId = authSelector.activeUserId(state)
  const isUserLogined = authSelector.isUserLogined(state)
  return {
    currentUserId: currentUserId,
    isUserLogined: isUserLogined,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  createPingppPayment
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Payment)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
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
  amount: {
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    alignItems: 'center',
    height: normalizeH(145)
  },
  amountText: {
    marginTop: normalizeH(30),
    marginBottom: normalizeH(20),
    fontSize: 17,
    color: '#5A5A5A',
  },
  price: {
    fontSize: 36,
    color: '#FF7819',
    marginBottom: normalizeH(42),
  },
  channel: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    paddingLeft: normalizeW(15),
    paddingRight: normalizeW(15),
  },
  channelTrip: {
    position: 'absolute',
    top: normalizeH(138),
    left: normalizeW(145),
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 12,
    color: '#AAAAAA',
    backgroundColor: '#FFFFFF'
  },
  wx: {
    flexDirection: 'row',
    alignItems: 'center',
    height: normalizeH(78),
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  alipay: {
    flexDirection: 'row',
    alignItems: 'center',
    height: normalizeH(66),
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  enableButton: {
    marginTop: normalizeH(20)
  },
  disableButton: {
    marginTop: normalizeH(20),
    backgroundColor: 'rgba(170, 170, 170, 0.4)'
  }
})