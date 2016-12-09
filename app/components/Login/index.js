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
import Icon from 'react-native-vector-icons/Ionicons'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import SnsLogin from '../common/SnsLogin'
import {em, normalizeW, normalizeH} from '../../util/Responsive'
import {
  Button
} from 'react-native-elements'
import PhoneInput from '../common/Input/PhoneInput'
import Header from '../common/Header'
import PasswordInput from '../common/Input/PasswordInput'
import Symbol from 'es6-symbol'
import {submitFormData, INPUT_FORM_SUBMIT_TYPE} from '../../action/authActions'
import * as Toast from '../common/Toast'


const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height

let commonForm = Symbol('commonForm')
const phoneInput = {
  formKey: commonForm,
  stateKey: Symbol('phoneInput'),
  type: "phoneInput"
}
const pwdInput = {
  formKey: commonForm,
  stateKey: Symbol('passwordInput'),
  type: "passwordInput"
}

class Login extends Component {
  constructor(props) {
    super(props)
  }

  onButtonPress = () => {
    this.props.submitFormData({
      formKey: commonForm,
      submitType: INPUT_FORM_SUBMIT_TYPE.LOGIN_WITH_PWD,
      success:this.submitSuccessCallback,
      error: this.submitErrorCallback
    })
  }

  submitSuccessCallback(userInfos) {
    //console.log('userInfos=' + JSON.stringify(userInfos))
    Toast.show('登录成功!')
  }
  
  submitErrorCallback(error) {
    Toast.show(error.message)
  }

  render() {
    return (
      <View style={styles.container}>
        <Header 
          leftType="icon" 
          leftIconName="ios-arrow-back" 
          leftPress={() => Actions.REGIST()}
          title="登录" 
          rightType="text" 
          rightText="快速注册"
          rightPress={() => Actions.REGIST()}
        />
        <View style={styles.body}>
          <Image source={require('../../assets/images/login_qq@1x.png')} style={styles.logo} />
          <View style={styles.inputBox}>
            <PhoneInput {...phoneInput}/>
          </View>
          <View style={styles.inputBox}>
            <PasswordInput {...pwdInput}/>
          </View>
          <Button
            buttonStyle={styles.btn}
            onPress={this.onButtonPress}
            title="登录"
          />
          <Text style={styles.forgetPwd} onPress={this.retrievePassword}>忘记密码？</Text>
          <SnsLogin />
        </View>
      </View>
    )
  }

}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  submitFormData
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Login)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputBox: {
    marginBottom: normalizeW(25)
  },
  body: {
    paddingTop: normalizeH(65),
    width: PAGE_WIDTH,
  },
  logo: {
    marginLeft: normalizeW(PAGE_WIDTH / 2 - 54),
    marginBottom: normalizeH(44),
    width: 108,
    height: normalizeH(47),
  },
  btn: {
    height: normalizeH(50),
    marginLeft: normalizeW(17),
    marginRight: normalizeW(17),
    backgroundColor: '#50E3C2'
  },
  forgetPwd: {
    fontSize: em(18),
    color: '#50E3C2',
    textAlign: 'center',
    marginTop: normalizeH(23),
    marginBottom: normalizeH(49)
  }
})