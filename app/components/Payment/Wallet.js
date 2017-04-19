/**
 * Created by wanpeng on 2017/4/11.
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
import * as authSelector from '../../selector/authSelector'
import Header from '../common/Header'
import CommonButton from '../common/CommonButton'
import THEME from '../../constants/themes/theme1'
import {getPaymentInfo} from '../../selector/paymentSelector'
import {fetchPaymentInfo} from '../../action/paymentActions'



class Wallet extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchPaymentInfo({userId: this.props.currentUserId})
    })
  }

  onWxCash = () => {

  }

  onAlipayCash = () => {
    Actions.ALIPAY_CASH()
  }

  onPaymentSetting = () => {
    if(this.props.paymentInfo.password)
      Actions.PAYMENT_SETTING()
    else
      Actions.PAYMENT_SMS_AUTH()
  }

  render() {
    return(
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title='钱包'
          headerContainerStyle={styles.headerContainerStyle}
          leftStyle={styles.headerLeftStyle}
          titleStyle={styles.headerTitleStyle}
        />
        <View style={styles.body}>
          <View style={{flexDirection: 'row', paddingLeft: normalizeW(15), paddingRight: normalizeW(15)}}>
            <View style={styles.balance}>
              <Text style={{fontSize: 15, color: '#AAAAAA', marginTop: normalizeH(20)}}>余额（元）</Text>
              <Text style={{fontSize: 36, color: '#FF7819', marginTop: normalizeH(20)}}>{this.props.paymentInfo.balance}</Text>
              <Text style={{fontSize: 12, color: '#AAAAAA', marginTop: normalizeH(10)}}>平台推广总收益：88888:00</Text>
            </View>
            <View style={styles.setting}>
              <TouchableOpacity style={{flexDirection: 'row'}} onPress={this.onPaymentSetting}>
                <Image source={require('../../assets/images/promot_set_wallet.png')}/>
                <Text style={{fontSize: 15, color: '#AAAAAA', marginLeft: normalizeW(5)}}>支付设置</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.cash}>
            {/*<CommonButton*/}
              {/*buttonStyle={{width: normalizeW(165), height: normalizeH(40), borderRadius: 5, backgroundColor: THEME.base.lightColor}}*/}
              {/*onPress={this.onBoundCard}*/}
              {/*title={this.props.cardNumber? '我的银行卡': '绑定银行卡'}*/}
            {/*/>*/}
            <CommonButton
              buttonStyle={{width: normalizeW(165), height: normalizeH(40), borderRadius: 5, backgroundColor: 'green'}}
              onPress={this.onWxCash}
              title="微信提现"
            />
            <CommonButton
              buttonStyle={{width: normalizeW(165), height: normalizeH(40), borderRadius: 5}}
              onPress={this.onAlipayCash}
              title="支付宝提现"/>
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const isUserLogined = authSelector.isUserLogined(state)
  const currentUserId = authSelector.activeUserId(state)
  const paymentInfo = getPaymentInfo(state)
  return {
    cardNumber: paymentInfo.card_number || undefined,
    isUserLogined: isUserLogined,
    currentUserId: currentUserId,
    paymentInfo: paymentInfo,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchPaymentInfo,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Wallet)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  headerContainerStyle: {
    borderBottomWidth: 1,
    backgroundColor: '#F9F9F9'
  },
  headerLeftStyle: {
    color: THEME.colors.green,
    fontSize: 24
  },
  headerTitleStyle: {
    color: '#030303',
    fontSize: 17,
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
  balance: {
    flex: 1,
  },
  setting: {
    flex: 1,
    marginTop: normalizeH(23),
    alignItems: 'flex-end'
  },
  cash: {
    flexDirection: 'row',
    paddingLeft: normalizeW(15),
    paddingRight: normalizeW(15),
    justifyContent: 'space-between',
    marginTop: normalizeH(25)
  }
})