/**
 * Created by yangyang on 2016/12/2.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
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
import CommonDateTimeInput from '../common/Input/CommonDateTimeInput'

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

const dtPicker = {
  fromKeys: commonForm,
  stateKey: Symbol('datetimePicker')
}

class FindPwdVerifyCode extends Component {
  constructor(props) {
    super(props)

  }

  submit() {
    this.props.submitInputForm({formKey: commonForm})
  }

  render() {
    return (
      <View style={styles.rootContainer}>
        <View style={styles.mainContainer}>
          <View style={styles.header}></View>
          <View style={styles.inputTips}>
            <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 17}}>
              <ImageInput containerStyle={{borderRadius: 50}} />
            </View>
            <View style={{marginTop: 17}}>
              <CommonTextInput {...nameInput} placeholder="输入用户名" />
            </View>
            <View style={{marginTop: 17}}>
              <CommonTextInput {...pwdInput} placeholder="输入密码" />
            </View>
            <View style={{marginTop: 17}}>
              <PhoneInput {...phoneInput}/>
            </View>
            <View style={{marginTop: 17}}>
              <PasswordInput {...pwdInput}/>
            </View>
          </View>
          <View style={styles.btnView}>
          <CommonButton title="提交" onPress={() => this.submit()} />
          </View>
          <View style={styles.datetimeView}>
            <CommonDateTimeInput {...dtPicker} />
          </View>
          <View style={styles.datepickeriosView}>
            <DatePickerIOS
              date={new Date()}
              mode="datetime"
            />
          </View>
        </View>
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
  datepickeriosView: {
    marginTop: 17,
  }
})