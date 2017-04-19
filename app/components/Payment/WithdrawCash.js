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
import Symbol from 'es6-symbol'
import {createPingppTransfers} from '../../action/paymentActions'
import CommonTextInput from '../common/Input/CommonTextInput'
import {getPaymentInfo} from '../../selector/paymentSelector'
import uuid from 'react-native-uuid'
import * as Toast from '../common/Toast'
import {getRandomInt} from '../../util/numberUtils'


let cashForm = Symbol('cashForm')

const nameInput = {
  formKey: cashForm,
  stateKey: Symbol('nameInput'),
  type: "nameInput",
}

const cardInput = {
  formKey: cashForm,
  stateKey: Symbol('cardInput'),
  type: "cardInput",
}

const amountInput = {
  formKey: cashForm,
  stateKey: Symbol('amountInput'),
  type: "amountInput",
}

const passwordInput = {
  formKey: cashForm,
  stateKey: Symbol('passwordInput'),
  type: "passwordInput",
}

class WithdrawCash extends Component {
  constructor(props) {
    super(props)
  }

  amountValidCheck = (data)=> {
    if (data && data.text && (parseInt(data.text) <= this.props.paymentInfo.balance) && (parseInt(data.text) > 0)) {
      return {isVal: true, errMsg: '验证通过'}
    }
    return {isVal: false, errMsg: '提现金额输入有误'}
  }

  submitSuccessCallback = () => {
    Actions.pop()
  }

  submitErrorCallback = (error) => {
    Toast.show(error.message)
  }

  onWithdrawCash = () => {
    let order_no = uuid.v4().replace(/-/g, '').replace(/[a-z]/g, getRandomInt(0, 9)).substr(0, 16) //unionpay 为1~16位的纯数字
    this.props.createPingppTransfers({
      formKey: cashForm,
      order_no: order_no,
      userId: this.props.currentUserId,
      success: this.submitSuccessCallback,
      error: this.submitErrorCallback,
    })
  }

  render() {
    return(
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title='确认提现'
          headerContainerStyle={styles.headerContainerStyle}
          leftStyle={styles.headerLeftStyle}
          titleStyle={styles.headerTitleStyle}
        />
        <View style={styles.body}>
          <View style={styles.itemContainer}>
            <Text style={{fontSize: 15, color: '#AAAAAA'}}>保障财产，您只能使用</Text>
            <Text style={{fontSize: 15, color: 'red'}}>本人银行</Text>
            <Text style={{fontSize: 15, color: '#AAAAAA'}}>卡！</Text>
          </View>
          <View style={styles.itemContainer}>
            <Text style={{fontSize: 17, color: '#AAAAAA'}}>账户姓名</Text>
            <CommonTextInput
              {...nameInput}
              placeholder="输入姓名"
              containerStyle={{height: normalizeH(42), paddingRight: 0}} maxLength={8}
              inputStyle={{backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0, fontSize: 17,}}
              initValue={this.props.paymentInfo.id_name}
            />
          </View>
          <View style={styles.itemContainer}>
            <Text style={{fontSize: 17, color: '#AAAAAA'}}>提现账户</Text>
            <CommonTextInput
              {...cardInput}
              placeholder="请输入银行卡号"
              containerStyle={{height: normalizeH(42), paddingRight: 0}} maxLength={20}
              inputStyle={{backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0, fontSize: 17}}
              keyboardType="numeric"
              initValue={this.props.paymentInfo.card_number}
            />
          </View>
          <View style={{paddingLeft: normalizeW(15), height: normalizeH(80),justifyContent: 'center', borderBottomColor: '#F5F5F5', borderBottomWidth: 1}}>
            <View style={{flexDirection: 'row', marginBottom: normalizeH(15)}}>
              <Text style={{fontSize: 15, color: '#AAAAAA'}}>保障财产，每日提现上限</Text>
              <Text style={{fontSize: 15, color: 'red'}}>15000</Text>
              <Text style={{fontSize: 15, color: '#AAAAAA'}}>元！</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 15, color: '#AAAAAA'}}>可提现金额</Text>
              <Text style={{fontSize: 15, color: 'red'}}>{this.props.paymentInfo.balance}</Text>
              <Text style={{fontSize: 15, color: '#AAAAAA'}}>元！</Text>
            </View>
          </View>
          <View style={styles.itemContainer}>
            <Text style={{fontSize: 17, color: '#AAAAAA'}}>提现金额</Text>
            <CommonTextInput
              {...amountInput}
              placeholder=""
              containerStyle={{height: normalizeH(42), paddingRight: 0}} maxLength={20}
              inputStyle={{backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0, fontSize: 17}}
              keyboardType="numeric"
              checkValid= {this.amountValidCheck}
            />
          </View>
          <View style={styles.itemContainer}>
            <Text style={{fontSize: 17, color: '#AAAAAA'}}>支付密码</Text>
            <CommonTextInput
              {...passwordInput}
              placeholder="请输入支付密码"
              containerStyle={{height: normalizeH(42), paddingRight: 0}} maxLength={20}
              inputStyle={{backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0, fontSize: 17}}
              secureTextEntry={true}
            />
          </View>
          <View style={{alignItems: 'flex-end', height: normalizeH(50), justifyContent: 'center'}}>
            <TouchableOpacity>
              <Text style={{fontSize: 17, color: THEME.base.mainColor}}>忘记密码？</Text>
            </TouchableOpacity>
          </View>
          <CommonButton
            onPress={this.onWithdrawCash}
            title="确认提现"
          />
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
    paymentInfo: paymentInfo,
    isUserLogined: isUserLogined,
    currentUserId: currentUserId,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  createPingppTransfers,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(WithdrawCash)

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
  itemContainer: {
    flexDirection: 'row',
    paddingLeft: normalizeW(15),
    height: normalizeH(50),
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5'
  }
})