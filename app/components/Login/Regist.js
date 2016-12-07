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

const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height

class Regist extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userName: "",
      password: ""
    }
  }

  changeUserState(key, value) {
    this.setState({
      key: value
    })
  }

  onButtonPress = () => {
    Actions.REG4VERIFYCODE()
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon
            name='ios-arrow-back'
            style={styles.chevronLeft} />
          <Text style={styles.title}>注册</Text>
          <TouchableOpacity style={styles.rightBox} onPress={() => Actions.LOGIN()} >
            <Text style={styles.rightTxt}>登录</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.body}>
          <Image source={require('../../assets/images/login_weixin@1x.png')} style={styles.logo}></Image>
          <TextInput
                placeholder={'输入手机号'}
                style={styles.inputField}
                autoCapitalize={'none'}
                autoCorrect={false}
                onChangeText={(text) => {
                  this.changeUserState('userName', text)
                }}
              />
          <View style={styles.inputField}>
            <TextInput
              placeholder={'输入验证码'}
              style={styles.inputverifycode}
              autoCapitalize={'none'}
              autoCorrect={false}
              onChangeText={(text) => {
                this.changeUserState('userName', text)
              }}
            />
            <Button
            buttonStyle={styles.getverifycodebtn}
            onPress={this.onButtonPress}
            title="获取验证码"
            />
            </View>
          <View style={styles.inputField}>
          <TextInput
            placeholder={'设置密码（6～10位数字或字母'}
            style={styles.pswText}
            autoCapitalize={'none'}
            autoCorrect={false}
            onChangeText={(text) => {
              this.changeUserState('userName', text)
            }}
          />
            <Image source={require('../../assets/images/code_close_eye.png')} style={styles.pswEye}></Image>

          </View>
          <Button
            buttonStyle={styles.btn}
            onPress={this.onButtonPress}
            title="开始使用"
          />
          <View style={styles.agreementview}>
            <Image source={require('../../assets/images/code_close_eye.png')} style={styles.check}></Image>
            <Text style={styles.agreementtext} onPress={this.retrievePassword}>服务条款及协议</Text>

          </View>
          <SnsLogin />
        </View>
      </View>

    )
  }

}

const mapStateToProps = (state, ownProps) => {
  return {
    'userName': 'Z',
    'password': '1',
    'isLogin': true
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Regist)

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
    fontSize: em(16),
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
    //paddingTop: normalizeH(65),
    width: PAGE_WIDTH,
  },
  logo: {
    marginLeft: normalizeW(PAGE_WIDTH / 2 - 54),
    marginBottom: normalizeH(25),
    marginTop:normalizeH(25),
    width: 108,
    height: normalizeH(47),
  },
  inputField: {
    height: normalizeH(50),
    marginLeft: normalizeW(17),
    marginRight: normalizeW(17),
    marginBottom: normalizeH(25),
    paddingLeft: normalizeW(10),
    paddingRight: normalizeW(10),
    borderWidth: 1,
    borderColor: '#E9E9E9',
    backgroundColor: '#F3F3F3',
    color: '#666',
    fontSize: em(14),
    flexDirection:'row',
  },
  pswText: {

    marginLeft: normalizeW(3),
    padding:normalizeH(5),
    fontSize:em(14),
    width:normalizeW(233),

    backgroundColor: '#F3F3F3',
    color: '#666',
    fontSize: em(14),
    //flex:5,
  },
  inputverifycode:{
    height:normalizeH(50),
    width:normalizeW(196),
  },
  pswEye: {
    left: normalizeW(27),
    top: normalizeH(19),
    width: normalizeW(35),
    height: normalizeH(12),
    //color:'#50E3C2'
    //flex:1,
  },
  getverifycodebtn:{
    marginLeft:0,
    marginTop:0,
    height:normalizeH(50),
    width:normalizeW(134),
    backgroundColor:'#50E3C2',
  },
  btn: {
    height: normalizeH(50),
    marginLeft: normalizeW(17),
    marginRight: normalizeW(17),
    backgroundColor: '#50E3C2',
    marginBottom: normalizeH(24)
  },
  agreementview:{
    height:normalizeH(17),
    flexDirection:'row',
    justifyContent:'center',
    marginBottom:normalizeH(59),
  },
  check:{
    width:normalizeW(18),
    height:normalizeH(16),
  },
  agreementtext:{
    fontSize:em(14),
    color:'#50E3C2',

  },
})