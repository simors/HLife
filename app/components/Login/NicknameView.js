/**
 * Created by yangyang on 2017/3/4.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Platform,
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import {Button} from 'react-native-elements'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import Symbol from 'es6-symbol'
import Header from '../common/Header'
import THEME from '../../constants/themes/theme1'
import CommonTextInput from '../common/Input/CommonTextInput'
import {submitFormData, INPUT_FORM_SUBMIT_TYPE} from '../../action/authActions'
import * as Toast from '../common/Toast'

let setNicknameForm = Symbol('setNicknameForm')
const nicknameInput = {
  formKey: setNicknameForm,
  stateKey: Symbol('nicknameInput'),
  type: "nicknameInput"
}

class NicknameView extends Component {
  constructor(props) {
    super(props)
  }

  onButtonPress() {
    this.props.submitFormData({
      formKey: setNicknameForm,
      submitType: INPUT_FORM_SUBMIT_TYPE.SET_NICKNAME,
      success:this.submitSuccessCallback,
      error: this.submitErrorCallback
    })
  }

  submitSuccessCallback() {
    Toast.show('设置昵称成功')
    Actions.HOME({type:'reset'})
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
          leftPress={() => Actions.pop()}
          title="设置昵称"
        />
        <View style={styles.body}>
            <View style={{marginTop: 30}}>
              <View style={{height: normalizeH(50)}}>
                <CommonTextInput {...nicknameInput}  containerStyle={styles.inputBox} placeholder="取个响亮的名字吧"/>
              </View>
              <Button
                buttonStyle={styles.btn}
                onPress={() => this.onButtonPress()}
                title="开始使用"
              />
            </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let newProps = {}
  return newProps
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  submitFormData
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(NicknameView)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  body: {
    ...Platform.select({
      ios: {
        marginTop: normalizeH(65),
      },
      android: {
        marginTop: normalizeH(45)
      }
    }),
    flex: 1,
  },
  btn: {
    height: normalizeH(50),
    marginLeft: normalizeW(17),
    marginRight: normalizeW(17),
    backgroundColor: THEME.base.mainColor,
    marginBottom: normalizeH(24)
  },
  inputBox: {
    marginBottom: normalizeW(25)
  },
})