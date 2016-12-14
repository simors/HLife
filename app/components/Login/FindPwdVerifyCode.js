/**
 * Created by yangyang on 2016/12/2.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Keyboard,
  Text,
  DatePickerIOS
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Symbol from 'es6-symbol'

import CommonTextInput from '../common/Input/CommonTextInput'
import PhoneInput from '../common/Input/PhoneInput'
import PasswordInput from '../common/Input/PasswordInput'
import ImageInput from '../common/Input/ImageInput'
import CommonButton from '../common/CommonButton'
import RichTextInput from '../common/Input/RichTextInput'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DateTimeInput from '../common/Input/DateTimeInput'

import {submitInputForm} from '../../action/inputFormActions'

const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height

let commonForm = Symbol('commonForm')
const nameInput = {
  formKey: commonForm,
  stateKey: Symbol('nameInput'),
  type: "nameInput",
  initValue: "yangyang"
}
const pwdInput = {
  formKey: commonForm,
  stateKey: Symbol('pwdInput'),
  type: "pwdInput"
}

const phoneInput = {
  formKey: commonForm,
  stateKey: Symbol('phoneInput')
}

const richTextInput ={
  formKey: commonForm,
  stateKey: Symbol('richTextInput'),
  type: 'article'
}

const dtPicker = {
  formKey: commonForm,
  stateKey: Symbol('datetimePicker'),
  type: 'dtPicker'
}

class FindPwdVerifyCode extends Component {
  constructor(props) {
    super(props)
    this.state = {
      keyboardPadding: 0,
      closeTips: false,
      rteFocused: false,    // 富文本获取到焦点
    }
  }

  componentDidMount() {
    if (Platform.OS == 'ios') {
      Keyboard.addListener('keyboardWillShow', this.keyboardWillShow)
      Keyboard.addListener('keyboardWillHide', this.keyboardWillHide)
    } else {
      Keyboard.addListener('keyboardDidShow', this.keyboardWillShow)
      Keyboard.addListener('keyboardDidHide', this.keyboardWillHide)
    }
  }

  componentWillUnmount() {
    if (Platform.OS == 'ios') {
      Keyboard.removeListener('keyboardWillShow', this.keyboardWillShow)
      Keyboard.removeListener('keyboardWillHide', this.keyboardWillHide)
    } else {
      Keyboard.removeListener('keyboardDidShow', this.keyboardWillShow)
      Keyboard.removeListener('keyboardDidHide', this.keyboardWillHide)
    }
  }

  keyboardWillShow = (e) => {
    this.setState({
      keyboardPadding: e.endCoordinates.height,
    })
  }

  keyboardWillHide = (e) => {
    this.setState({
      keyboardPadding: 0,
    })
  }

  submit() {
    this.props.submitInputForm({formKey: commonForm})
  }

  onRteFocusChanged = (val) => {
    if (val == true) {
      // this.scrollView.scrollTo({x: 0, y: 0, animated: false})
      this.scrollView.scrollToPosition(0, 0, true)
    }

    this.setState({
      rteFocused: val,
    })
  }

  renderRichText() {
    const shouldFocus = this.state.rteFocused && (this.state.keyboardPadding > 0)
    console.log("shouldFocus:", shouldFocus)
    console.log("kayboardPadding:", this.state.keyboardPadding)
    return (
      <RichTextInput
        {...richTextInput}
        onFocus={this.onRteFocusChanged}
        shouldFocus={shouldFocus}
        keyboardPadding={this.state.keyboardPadding}
      />
    )
  }

  render() {
    return (
      <View style={styles.rootContainer}>
        <KeyboardAwareScrollView
          ref={(ref) => {
            this.scrollView = ref
          }}
          style={[{
            flex: 0,
            width: PAGE_WIDTH, paddingTop: 0, backgroundColor: '#ffffff'
          },
            this.state.rteFocused ? {height: 0} : {}]}
          keyboardDismissMode='on-drag'
        >
          <View style={styles.mainContainer}>
            <View style={styles.header}></View>
            <View style={this.state.rteFocused ? {height: 0, overflow: 'hidden'} : {}}>
              <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 17}}>
                <ImageInput containerStyle={{borderRadius: 50}} />
              </View>
              <View style={{marginTop: 17}}>
                <CommonTextInput {...nameInput} placeholder="输入用户名" />
              </View>
              <View style={{marginTop: 17}}>
                <CommonTextInput {...pwdInput} placeholder="输入密码" />
              </View>
              <View style={styles.datetimeView}>
                <DateTimeInput {...dtPicker} value="2016-05-18" />
              </View>
              <View style={{marginTop: 17}}>
                <PhoneInput {...phoneInput}/>
              </View>
              <View style={{marginTop: 17}}>
                <PasswordInput {...pwdInput}/>
              </View>
              <View style={styles.btnView}>
                <CommonButton title="提交" onPress={() => this.submit()} />
              </View>
            </View>

          </View>
        </KeyboardAwareScrollView>

      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  submitInputForm
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(FindPwdVerifyCode)

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1
  },
  mainContainer: {
    width: PAGE_WIDTH,
    height: (Platform.OS == 'android' ? PAGE_HEIGHT - 20 : PAGE_HEIGHT),
    position: 'absolute',
    top: 0,
    left: 0,
    flexDirection: 'column',
  },
  header: {
    backgroundColor: '#f3f3f3',
    paddingTop: 20,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#B2B2B2'
  },
  inputTips: {},
  btnView: {
    marginTop: 17,
  },
  datetimeView: {
    marginTop: 17,

  },

})