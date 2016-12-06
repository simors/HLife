/**
 * Created by wuxingyu on 2016/12/4.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Keyboard,
  TextInput,
  Dimensions,
  PropTypes,
} from 'react-native'
import { FormInput } from 'react-native-elements'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {initInputForm, inputFormUpdate} from '../../../action/inputFormActions'
import {getInputData} from '../../../selector/inputFormSelector'
import {normalizeW, normalizeH} from '../../../util/Responsive'

class SmsAuthCodeInput extends Component {

  constructor(props) {
    super(props)
    this.state = {countDown: 0}
  }

  componentWillUnmount() {
    this.interval && clearInterval(this.interval)
  }

  componentDidMount() {
    let formInfo = {
      formKey: this.props.formKey,
      stateKey: this.props.stateKey
    }
    this.props.initInputForm(formInfo)
  }

  inputChange(text) {
    let inputForm = {
      formKey: this.props.formKey,
      stateKey: this.props.stateKey,
      text: text
    }
    this.props.inputFormUpdate(inputForm)
  }

  countDown = () => {
    this.interval = setInterval(()=> {
      this.setState({countDown: this.state.countDown - 1})
    }, 1000)
  }

  renderCodeFetcher = () => {
    if (this.state.countDown) {
      return (
        <Text style={smsStyles.smsCodeText}>
          {this.state.countDown + 's后重新获取'}
        </Text>
      )
    } else {
      this.interval && clearInterval(this.interval)
      return (
        <Text style={smsStyles.smsCodeText}>
          获取验证码
        </Text>
      )
    }
  }

  requestSmsCode = () => { return '' }

  getSmsAuthCode = () => {
    let result = this.requestSmsCode()
    if (result) {
      result = ''
    } else {
      this.setState({countDown: this.props.countTimes})
      this.countDown()
    }
  }

  renderGetSmsButtonEnabled = () => {
    return (
      <TouchableOpacity style={[smsStyles.smsCodeTextContainer,
                              {height:this.props.height,
                                width:this.props.buttonWidth}]}
                        onPress={this.state.countDown ? ()=> {
                        } : this.getSmsAuthCode}
      >
        <View>{this.renderCodeFetcher()}</View>
      </TouchableOpacity>
    )
  }

  renderGetSmsButtonDisabled = () => {
    return (
      <View style={[smsStyles.smsCodeTextContainerDisable,
                  {height:this.props.height,
                    width:this.props.buttonWidth}]}
            height={this.props.height}
      >
      <View>{this.renderCodeFetcher()}</View>
        </View>
    )
  }

  render() {
    return (
      <View style={{height:this.props.height,
                    marginLeft:this.props.marginLeft,
                    marginRight:this.props.marginRight,
                    marginBottom:this.props.marginBottom}}>
        <View style={smsStyles.smsInputContainerBg}/>
        <View style={smsStyles.smsInputContainer}
              marginTop={-this.props.height}>
          <TextInput
            style={smsStyles.smsTextInput}
            autoFocus={this.props.autoFocus}
            placeholder={this.props.placeholder}
            placeholderTextColor={this.props.placeholderTextColor}
            maxLength={this.props.maxLength}
            keyboardType="numeric"
            underlineColorAndroid="transparent"
            onChangeText={(text) => this.inputChange(text)}
          />
          {this.state.countDown ? this.renderGetSmsButtonDisabled() : this.renderGetSmsButtonEnabled()}
        </View>
      </View>
    )
  }
}

SmsAuthCodeInput.defaultProps = {
    placeholder: '请输入6位验证码',
    placeholderTextColor: 'rgba(178,178,178,0.6)',
    maxLength: 6,
    height:normalizeH(50),
    autoFocus: false,
    countTimes:60,
    buttonWidth:normalizeW(120),
    marginLeft:normalizeW(17),
    marginRight:normalizeW(17),
    marginBottom:normalizeH(25),
}

const smsStyles = StyleSheet.create({
  smsInputContainerBg: {
    flex: 1,
    borderRadius: 4,
    backgroundColor: '#000000',
    opacity: 0.2,
  },
  smsInputContainer: {
    flex: 1,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  smsTextInput: {
    flex: 1,
    paddingLeft: normalizeW(16),
    fontSize: 14,
    color: '#b2b2b2',
    backgroundColor: '#f3f3f3',
  },
  smsCodeTextContainer: {
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor: '#50e3c2',
  },
  smsCodeTextContainerDisable: {
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor: '#b2b2b2',
  },
  smsCodeText: {
    fontSize: 14,
    color: '#ffffff',
    backgroundColor: 'transparent',
  }
})

const mapStateToProps = (state, ownProps) => {
  let obj = getInputData(state, ownProps.formKey, ownProps.stateKey)
  console.log("obj", obj)
  return {obj}
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  initInputForm,
  inputFormUpdate
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SmsAuthCodeInput)