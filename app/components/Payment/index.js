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

const PingPPModule = NativeModules.PingPPModule

class Payment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedChannel: 'wx',
    }
  }

  componentWillMount() {

  }

  paymentCallback = (errorCode, result) => {
    console.log("PingPPModule.createPayment callback!")
    console.log("errorCode:", errorCode)
    console.log("result:", result)
    if(errorCode == 0)
      Actions.PAYMENT_SUCCESS()
  }

  submitSuccessCallback = (charge) => {
    console.log("get charge:", JSON.stringify(charge))
    if(Platform.OS === 'ios') {
      PingPPModule.setDebugMode(true, () => {console.log("PingPPModule.setDebugMode success!")})
      PingPPModule.createPayment(charge, 'simorsLjyd', this.paymentCallback)
    } else if(Platform.OS === 'android') {
      PingPPModule.createPayment(JSON.stringify(charge), 'simorsLjyd', this.paymentCallback)
    }

  }

  submitErrorCallback = (error) => {
    Toast.show("支付失败")
    console.log("error:", error)
  }

  onPayment() {
    let order_no = uuid.v4().replace(/-/g, '').substr(0, 16)
    this.setState({
      order_no: order_no
    })
    let paymentPayload = {
      subject: '加盟费',
      order_no: order_no,
      amount: 1,
      channel: this.state.selectedChannel,
      success: this.submitSuccessCallback,
      error: this.submitErrorCallback,
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
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="支付店铺入驻费用"
          headerContainerStyle={styles.headerContainerStyle}
          leftStyle={styles.headerLeftStyle}
          titleStyle={styles.headerTitleStyle}
        />
        <View style={styles.body}>
          <ScrollView>
            <View style={styles.amount}>
              <Text style={styles.amountText}>支付金额</Text>
              <Text style={styles.price}>¥ 58.00元</Text>
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
              buttonStyle={{marginTop:normalizeH(20)}}
              title="支付"
              onPress={()=>{this.onPayment()}}
            />
          </ScrollView>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const isUserLogined = authSelector.isUserLogined(state)
  return {
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
    fontFamily: 'PingFangSC-Semibold',
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
  }
})