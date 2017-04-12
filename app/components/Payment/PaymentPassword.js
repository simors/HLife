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

class PaymentPassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      boundCarded: false
    }
  }

  onPasswordEnd = () => {

  }
  render() {
    return(
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title='输入支付密码'
          headerContainerStyle={styles.headerContainerStyle}
          leftStyle={styles.headerLeftStyle}
          titleStyle={styles.headerTitleStyle}
        />
        <View style={styles.body}>
          <View style={{marginTop: normalizeH(46), height: normalizeH(93), alignItems: 'center'}}>
            <Text style={{fontSize: 17, color: '#5A5A5A'}}>设置在邻家优店的支付密码</Text>
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
  const isUserLogined = authSelector.isUserLogined(state)
  return {
    isUserLogined: isUserLogined,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PaymentPassword)

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
  inputBox: {
    marginTop: normalizeH(20)
  },
})

