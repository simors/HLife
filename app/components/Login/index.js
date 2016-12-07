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
import PasswordInput from '../common/Input/PasswordInput'
import Symbol from 'es6-symbol'
import auth from '../../api/leancloud/auth'
import {submitFormData, INPUT_FORM_SUBMIT_TYPE} from '../../action/authActions'

const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height

let commonForm = Symbol('commonForm')
const phoneInput = {
  formKey: commonForm,
  stateKey: Symbol('phoneInput')
}
const pwdInput = {
  formKey: commonForm,
  stateKey: Symbol('pwdInput'),
  type: "pwdInput"
}

class Login extends Component {
  constructor(props) {
    super(props)
  }

  changeUserState(key, value) {
    this.setState({
      key: value
    })
  }

  onButtonPress = () => {
    this.props.submitFormData({
      formKey: commonForm,
      submitType: INPUT_FORM_SUBMIT_TYPE.LOGIN_WITH_PWD,
      success:this.submitSuccess
    })
  }

  submitSuccess() {
    Alert.alert('regist success!');
  }

  retrievePassword = () => {
    Actions.RetrivevePassword()
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon          
            name='ios-arrow-back'
            style={styles.chevronLeft} />
          <Text style={styles.title}>登录</Text>  
          <TouchableOpacity style={styles.rightBox} onPress={() => Actions.REGIST()} >
            <Text style={styles.rightTxt}>快速注册</Text>  
          </TouchableOpacity>
        </View>
        <View style={styles.body}>
          <Image source={require('../../assets/images/login_qq@1x.png')} style={styles.logo}></Image>
          <PhoneInput {...phoneInput}/>
          <PasswordInput {...pwdInput}/>
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
  header: {
    backgroundColor: '#f3f3f3',
    paddingTop: normalizeH(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#B2B2B2'
  },
  chevronLeft: {
    position: 'absolute',
    left: 9,
    bottom: 14,
    width: 13,
    height: 21,
    zIndex: 10,
    fontSize: em(24),
    color: '#50E3C2',
  },
  title: {
    flex: 1,
    lineHeight: 44,
    fontSize: em(17),
    color: '#030303',
    textAlign: 'center'
  },
  rightBox: {
    position: 'absolute',
    right: 9,
    bottom: 14,
    zIndex: 10,
  },
  rightTxt: {
    fontSize: em(17),
    color: '#50E3C2',
    textAlign: 'right',
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
  inputField: {
    height: normalizeH(50),
    marginLeft: normalizeW(17),
    marginRight: normalizeW(17),
    marginBottom: normalizeH(31),
    paddingLeft: normalizeW(10),
    paddingRight: normalizeW(10),
    borderWidth: 1,
    borderColor: '#E9E9E9',
    backgroundColor: '#F3F3F3',
    color: '#666',
    fontSize: em(14)
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