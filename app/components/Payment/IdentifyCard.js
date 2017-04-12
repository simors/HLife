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

let cardForm = Symbol('cardForm')

const cardNumberInput = {
  formKey: cardForm,
  stateKey: Symbol('cardNumberInput'),
  type: "cardNumberInput",
}

const bankCodeInput = {
  formKey: cardForm,
  stateKey: Symbol('bankCodeInput'),
  type: "bankCodeInput",
}

class IdentifyCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      boundCarded: false
    }
  }

  onNext = () => {

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
          <View style={{justifyContent: 'center', height: normalizeH(65), }}>
            <Text style={{marginLeft: normalizeW(30), fontSize: 17, color: '#5A5A5A'}}>银行卡  交通银行储蓄卡</Text>
            <Text style={{marginLeft: normalizeW(30), fontSize: 17, color: '#5A5A5A'}}>卡号  5222 8888 8888 8888</Text>
          </View>
          <View style={styles.itemContainer}>
            <Text style={{marginLeft: normalizeW(30), fontSize: 17, color: '#5A5A5A'}}>持卡人</Text>
            <CommonTextInput
              {...cardNumberInput}
              placeholder="持卡人姓名"
              containerStyle={{height: normalizeH(42), paddingRight: 0}} maxLength={8}
              inputStyle={{backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0, fontSize: 17,}}
            />
          </View>
          <View style={styles.itemContainer}>
            <Text style={{marginLeft: normalizeW(30), fontSize: 17, color: '#5A5A5A'}}>身份证</Text>
            <CommonTextInput
              {...cardNumberInput}
              placeholder="持卡人身份证号"
              containerStyle={{height: normalizeH(42), paddingRight: 0}} maxLength={8}
              inputStyle={{backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0, fontSize: 17,}}
            />
          </View>
          <View style={styles.itemContainer}>
            <Text style={{marginLeft: normalizeW(30), fontSize: 17, color: '#5A5A5A'}}>手机号</Text>
            <CommonTextInput
              {...cardNumberInput}
              placeholder="银行预留手机号"
              containerStyle={{height: normalizeH(42), paddingRight: 0}} maxLength={8}
              inputStyle={{backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0, fontSize: 17,}}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.agreement}>
            <Text>同意</Text>
            <Text>《银联用户服务协议》</Text>
          </View>


          <CommonButton
            onPress={this.onNext}
            title="验证信息"
          />

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
    height: normalizeH(65),
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#AAAAAA'
  },
  agreement: {
    flexDirection: 'row',

  }

})
