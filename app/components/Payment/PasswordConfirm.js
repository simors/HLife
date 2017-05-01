/**
 * Created by wanpeng on 2017/4/12.
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
import THEME from '../../constants/themes/theme1'
import PaymentPasswordInput from '../common/Input/PaymentPasswordInput'
import * as Toast from '../common/Toast'
import {setPaymentPassword} from '../../action/paymentActions'


class PasswordConfirm extends Component {
  constructor(props) {
    super(props)
  }

  onPasswordEnd = (password) => {
    console.log("onPasswordEnd:", password)
    if(password === this.props.password) {
      this.props.setPaymentPassword({
        userId: this.props.currentUserId,
        password: password,
        success: () => {
          Toast.show("设置成功")
          Actions.WALLET()
        },
        error: (error) => {Toast.show(error.message)}
      })
    } else {
      Toast.show("两次密码输入不一致！")
    }
  }
  render() {
    return(
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title='确认支付密码'
          headerContainerStyle={styles.headerContainerStyle}
          leftStyle={styles.headerLeftStyle}
          titleStyle={styles.headerTitleStyle}
        />
        <View style={styles.body}>
          <View style={{marginTop: normalizeH(46), height: normalizeH(93), alignItems: 'center'}}>
            <Text style={{fontSize: 17, color: '#5A5A5A'}}>再次填写以确认</Text>
          </View>
          <View style={{marginLeft: normalizeW(15), width: normalizeW(345), height: normalizeH(50)}}>
            <PaymentPasswordInput
              inputItemStyle={{width: normalizeW(57.5), height: normalizeH(50)}}
              maxLength={6}
              onEnd={this.onPasswordEnd}
            />
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const currentUserId = authSelector.activeUserId(state)
  const isUserLogined = authSelector.isUserLogined(state)
  return {
    currentUserId: currentUserId,
    isUserLogined: isUserLogined,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setPaymentPassword,

}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PasswordConfirm)

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
    marginTop: normalizeH(64),
    flex: 1,
  },
  inputBox: {
    marginTop: normalizeH(20)
  },
})

