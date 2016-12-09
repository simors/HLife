/**
 * Created by wanpeng on 2016/12/2.
 * Modified by wuxingyu on 2016/12/8.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions
} from 'react-native'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {em, normalizeW, normalizeH} from '../../util/Responsive'
import {
  Button,
} from 'react-native-elements'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import SmsAuthCodeInput from '../common/Input/SmsAuthCodeInput'
import PhoneInput from '../common/Input/PhoneInput'

const PAGE_WIDTH = Dimensions.get('window').width

let commonForm = Symbol('commonForm')
const phoneInput = {
  formKey: commonForm,
  stateKey: Symbol('phoneInput')
}

const smsAuthCodeInput = {
  formKey: commonForm,
  stateKey: Symbol('smsAuthCodeInput')
}

class RetrievePassword extends Component {
  constructor(props) {
    super(props)
  }

  onButtonPress = () => {
    Actions.REG4VERIFYCODE()
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.REGIST()}
          title="找回密码"
          rightType=""
        />
        <View style={styles.body}>
          <Text style={styles.titleInfo}>填写注册时的手机号码并验证</Text>
          <PhoneInput {...phoneInput} containerStyle={styles.inputBox}/>
          <SmsAuthCodeInput {...smsAuthCodeInput} containerStyle={styles.inputBox}/>
        </View>
        <Button
          buttonStyle={styles.btn}
          onPress={this.onButtonPress}
          title="下一步"
        />

      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(RetrievePassword)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#f3f3f3',
    paddingTop: normalizeH(20),
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#B2B2B2'
  },
  body: {
    paddingTop: normalizeH(64),
    width: PAGE_WIDTH,
  },
  inputBox: {
    marginBottom: normalizeW(25)
  },
  btn: {
    height: normalizeH(50),
    marginLeft: normalizeW(17),
    marginRight: normalizeW(17),
    backgroundColor: '#50E3C2',
    marginBottom: normalizeH(24)
  },
  titleInfo: {
    color: '#50E3C2',
    fontSize: em(18),
    alignSelf: 'flex-start',
    paddingLeft: normalizeW(17),
    marginBottom: normalizeH(35)
  }

})