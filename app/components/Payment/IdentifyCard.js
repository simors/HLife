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
import CommonButton from '../common/CommonButton'
import CommonTextInput from '../common/Input/CommonTextInput'
import {identifyCardInfo} from '../../action/paymentActions'
import {getInputData} from '../../selector/inputFormSelector'
import THEME from '../../constants/themes/theme1'
import Symbol from 'es6-symbol'
import * as Toast from '../common/Toast'



const identifyCardForm = Symbol('identifyCardForm')

const userNameInput = {
  formKey: identifyCardForm,
  stateKey: Symbol('userNameInput'),
  type: "userNameInput",
}

const idNumberInput = {
  formKey: identifyCardForm,
  stateKey: Symbol('idNumberInput'),
  type: "idNumberInput",
}

const phoneInput = {
  formKey: identifyCardForm,
  stateKey: Symbol('phoneInput'),
  type: "phoneInput",
}

class IdentifyCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      boundCarded: false
    }

  }

  onIdentify = () => {
    this.props.identifyCardInfo({
      formKey: identifyCardForm,
      cardNumber: this.props.cardNumber,
      bankCode: this.props.bankCode,
      userId: this.props.currentUserId,
      success:() => {
        Toast.show("绑定成功")
        Actions.WALLET()
      },
      error: (error) => {
        Toast.show(error.message)
      }
    })
  }

  render() {
    return(
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title='验证银行卡信息'
          headerContainerStyle={styles.headerContainerStyle}
          leftStyle={styles.headerLeftStyle}
          titleStyle={styles.headerTitleStyle}
        />
        <View style={styles.body}>
          <View style={{justifyContent: 'center', height: normalizeH(104), borderBottomColor: '#AAAAAA', borderBottomWidth: 1}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{marginLeft: normalizeW(30), width: normalizeW(60), fontSize: 17, color: '#5A5A5A'}}>银行卡</Text>
              <Text style={{fontSize: 17, color: '#5A5A5A'}}>{this.props.bankCode}</Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: normalizeH(20)}}>
              <Text style={{marginLeft: normalizeW(30), width: normalizeW(60),fontSize: 17, color: '#5A5A5A'}}>卡号</Text>
              <Text style={{fontSize: 17, color: '#5A5A5A'}}>{this.props.cardNumber}</Text>
            </View>
          </View>
          <View style={styles.itemContainer}>
            <Text style={{marginLeft: normalizeW(30), fontSize: 17, color: '#5A5A5A'}}>持卡人</Text>
            <CommonTextInput
              {...userNameInput}
              placeholder="持卡人姓名"
              containerStyle={{height: normalizeH(42), paddingRight: 0}} maxLength={20}
              inputStyle={{backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0, fontSize: 17,}}
            />
          </View>
          <View style={styles.itemContainer}>
            <Text style={{marginLeft: normalizeW(30), fontSize: 17, color: '#5A5A5A'}}>身份证</Text>
            <CommonTextInput
              {...idNumberInput}
              placeholder="持卡人身份证号"
              containerStyle={{height: normalizeH(42), paddingRight: 0}} maxLength={20}
              inputStyle={{backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0, fontSize: 17,}}
            />
          </View>
          <View style={styles.itemContainer}>
            <Text style={{marginLeft: normalizeW(30), fontSize: 17, color: '#5A5A5A'}}>手机号</Text>
            <CommonTextInput
              {...phoneInput}
              placeholder="银行预留手机号"
              containerStyle={{height: normalizeH(42), paddingRight: 0}} maxLength={16}
              inputStyle={{backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0, fontSize: 17,}}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.agreement}>
            <Image source={require('../../assets/images/selected_agreement.png')}/>
            <Text style={{fontSize: 14, color: '#5A5A5A'}}>同意</Text>
            <Text style={{fontSize: 14, color: THEME.base.mainColor}}>《银联用户服务协议》</Text>
          </View>

          <CommonButton
            buttonStyle={{marginTop:normalizeH(46)}}
            onPress={this.onIdentify}
            title="验证信息"
          />

        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const isUserLogined = authSelector.isUserLogined(state)
  const currentUserId = authSelector.activeUserId(state)

  return {
    currentUserId: currentUserId,
    isUserLogined: isUserLogined,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  identifyCardInfo
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(IdentifyCard)

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
  itemContainer: {
    flexDirection: 'row',
    height: normalizeH(65),
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#AAAAAA'
  },
  agreement: {
    flexDirection: 'row',
    paddingLeft: normalizeW(30),
    marginTop: normalizeH(15),
    alignItems: 'center',
  }

})
