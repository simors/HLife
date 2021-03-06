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
import ImageInput from '../common/Input/ImageInput'

let setNicknameForm = Symbol('setNicknameForm')
const nicknameInput = {
  formKey: setNicknameForm,
  stateKey: Symbol('nicknameInput'),
  type: "nicknameInput",
  checkValid:(data)=> {
    if (data && data.text && data.text.length > 0) {
      return {isVal: true, errMsg: '验证通过'}
    }
    return {isVal: false, errMsg: '请完善全部信息'}
  },
}
const avatarInput = {
  formKey: setNicknameForm,
  stateKey: Symbol('avatarInput'),
  type: "avatarInput",
  checkValid:(data)=> {
    if (data && data.text && data.text.length > 0) {
      return {isVal: true, errMsg: '验证通过'}
    }
    return {isVal: false, errMsg: '请完善全部信息'}
  },

}
class NicknameView extends Component {
  constructor(props) {
    super(props)
    this.avatarUri=''
  }

  onButtonPress() {
    this.props.submitFormData({
      formKey: setNicknameForm,
      submitType: INPUT_FORM_SUBMIT_TYPE.SET_NICKNAME,
      avatarUri:this.avatarUri,
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
          title="完善信息"
        />
        <View style={styles.body}>
            <View style={{marginTop: 40}}>
              <View style={styles.zonea}>
                <ImageInput
                  {...avatarInput}
                  containerStyle={styles.imageInputStyle}
                  addImage={require('../../assets/images/default_portrait.png')}
                  choosenImageStyle={{borderWidth: 0, borderColor: '#FFFFFF', borderRadius: normalizeW(70), overflow: 'hidden', width: normalizeW(141), height: normalizeH(141), overlayColor: '#FFFFFF'}}
                  addImageBtnStyle={{width: normalizeW(141), height: normalizeH(141), top: 0, left: 0,borderRadius: normalizeW(70),}}
                />
              </View>
            </View>
          <View style={{marginTop: 40}}>
          <View style={{height: normalizeH(50), paddingLeft: normalizeW(17), paddingRight: normalizeW(17), marginBottom: normalizeW(25)}}>
                <CommonTextInput {...nicknameInput} placeholder="取个响亮的名字吧" outerContainerStyle={{borderWidth: 0}}/>
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
    marginTop: normalizeH(65),
    flex: 1,
  },
  zonea: {
    height: normalizeH(144),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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
  imageInputStyle: {
    backgroundColor: '#FFFFFF',
    width: normalizeW(141),
    height: normalizeH(141),
    borderWidth: 0,
  },
})