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
import OpenBankPicker from '../common/Input/OpenBankPicker'
import {getInputData} from '../../selector/inputFormSelector'
import Symbol from 'es6-symbol'


let addCardForm = Symbol('addCardForm')

const cardNumberInput = {
  formKey: addCardForm,
  stateKey: Symbol('cardNumberInput'),
  type: "cardNumberInput",
}

const bankCodeInput = {
  formKey: addCardForm,
  stateKey: Symbol('bankCodeInput'),
  type: "bankCodeInput",
}

class AddCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      boundCarded: false
    }
  }

  onNext = () => {
    Actions.IDENTIFY_CARD({
      cardNumber: this.props.cardNumber,
      bankCode: this.props.bankCode,
    })
  }

  render() {
    return(
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title='添加银行卡'
          headerContainerStyle={styles.headerContainerStyle}
          leftStyle={styles.headerLeftStyle}
          titleStyle={styles.headerTitleStyle}
        />
        <View style={styles.body}>
          <View style={{justifyContent: 'center', height: normalizeH(65), borderBottomWidth: 1, borderBottomColor: '#AAAAAA'}}>
            <Text style={{marginLeft: normalizeW(30), fontSize: 17, color: '#5A5A5A'}}>请绑定本人的银行卡</Text>
          </View>
          <View style={styles.itemContainer}>
            <Text style={{width: normalizeW(60), marginLeft: normalizeW(30), fontSize: 17, color: '#5A5A5A'}}>卡号</Text>
            <CommonTextInput
              {...cardNumberInput}
              placeholder="仅用于余额体现"
              containerStyle={{height: normalizeH(42), paddingRight: 0}} maxLength={20}
              inputStyle={{backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0, fontSize: 17,}}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.itemContainer}>
            <Text style={{width: normalizeW(60), marginLeft: normalizeW(30), fontSize: 17, color: '#5A5A5A'}}>卡类型</Text>
            <OpenBankPicker {...bankCodeInput} containerStyle={{height: normalizeH(42)}}
                          inputStyle={{backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0, fontSize: 17,}}/>
          </View>

          <CommonButton
            buttonStyle={{marginTop:normalizeH(50)}}
            onPress={this.onNext}
            title="下一步"
          />

        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let cardNumber = getInputData(state, addCardForm, cardNumberInput.stateKey)
  let bankCode = getInputData(state, addCardForm, bankCodeInput.stateKey)

  const isUserLogined = authSelector.isUserLogined(state)
  return {
    cardNumber: cardNumber.text || undefined,
    bankCode: (bankCode && bankCode.text)? bankCode.text.bank : undefined,
    isUserLogined: isUserLogined,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({

}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(AddCard)

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
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    height: normalizeH(65),
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#AAAAAA'
  }

})
