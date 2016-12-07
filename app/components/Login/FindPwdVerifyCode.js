/**
 * Created by yangyang on 2016/12/2.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Platform
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Symbol from 'es6-symbol'
import {Button} from 'react-native-elements'

import CommonTextInput from '../common/Input/CommonTextInput'
import PhoneInput from '../common/Input/PhoneInput'
import PasswordInput from '../common/Input/PasswordInput'

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
            <PhoneInput {...phoneInput}/>
            <PasswordInput {...pwdInput}/>
          </View>
          <View style={styles.inputView}>
            <Button title="submit" onPress={() => this.submit()} />
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
  inputView: {},
})