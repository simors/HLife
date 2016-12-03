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
import {em, normalizeW, normalizeH} from '../../util/Responsive'
import {
  Button
} from 'react-native-elements'

const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height

class RegVerifyCode extends Component {
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
    Alert.alert('Button has been pressed!')
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon          
            name='ios-arrow-back'
            style={styles.chevronLeft} />
          <Text style={styles.title}>验证手机号</Text>  
        </View>
        <View style={styles.body}>
          <View style={styles.tipInfoBox}>
            <Text style={styles.tipInfo}>请填写验证码</Text>
          </View>
          <TextInput
                placeholder={'验证码'}
                style={styles.inputField}
                autoCapitalize={'none'}
                autoCorrect={false}
                onChangeText={(text) => {
                  this.changeUserState('userName', text)
                }}
              /> 
          <Button
            buttonStyle={styles.btn}
            onPress={this.onButtonPress}
            title="注册"
          />
          <TouchableOpacity style={styles.resendCodeBox} onPress={() => Actions.LOGIN()} >
            <Text style={styles.resendCode}>点击重新发送验证码</Text>  
          </TouchableOpacity>

          <View style={styles.protocalBox}>
            <Text style={styles.protocalTipTxt}>点击注册表示您同意</Text>
            <TouchableOpacity style={styles.protocalLinkBox} onPress={() => Actions.LOGIN()} >
              <Text style={styles.protocalLink}>服务条款及协议</Text>  
            </TouchableOpacity>
          </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(RegVerifyCode)

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
  chevronLeft: {
    position: 'absolute',
    left: 9,
    bottom: 14,
    width: 13,
    height: 21,
    zIndex: 10,
    fontSize: em(24),
    color: '#50E3C2'
  },
  title: {
    flex: 1,
    lineHeight: 44,
    fontSize: em(17),
    color: '#030303',
    textAlign: 'center'
  },
  body: {
    paddingTop: normalizeH(65),
    width: PAGE_WIDTH,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tipInfoBox: {
    width: normalizeW(120),
    marginBottom: normalizeH(64),
  },
  tipInfo: {
    fontSize: em(20),
    fontWeight: 'bold',
    textAlign: 'center'
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
    width: PAGE_WIDTH - normalizeW(34),
    height: normalizeH(50),
    marginLeft: normalizeW(17),
    marginRight: normalizeW(17),
    backgroundColor: '#50E3C2',
    marginBottom: normalizeH(22)
  },
  resendCodeBox: {
    width: normalizeW(162),
    marginBottom: normalizeH(187)
  },
  resendCode: {
    color: '#50E3C2',
    fontSize: em(18),
  },
  protocalBox: {
    
  },
  protocalTipTxt: {
    color: '#7a7a7a',
    fontSize: em(18),
  },
  protocalLinkBox: {
    marginTop: normalizeH(18)
  },
  protocalLink: {
    color: '#50E3C2',
    fontSize: em(18),
    textAlign: 'center'
  }
})