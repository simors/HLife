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

import CommonTextInput from '../common/Input/CommonTextInput'

const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height

let commonForm = Symbol('commonForm')
const nameInput = {
  formKey: commonForm,
  stateKey: Symbol('nameInput')
}
const pwdInput = {
  formKey: commonForm,
  stateKey: Symbol('pwdInput')
}

class FindPwdVerifyCode extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.rootContainer}>
        <View style={styles.mainContainer}>
          <View style={styles.header}></View>
          <View style={styles.inputTips}>
            <CommonTextInput {...nameInput} placeholder="输入用户名" />
            <CommonTextInput {...pwdInput} placeholder="输入密码" />
          </View>
          <View style={styles.inputView}></View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

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