/**
 * Created by wanpeng on 2016/12/20.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Dimensions,
  Picker,
  Platform,
} from 'react-native'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import Symbol from 'es6-symbol'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import Header from '../../components/common/Header'
import {submitFormData, submitInputData,INPUT_FORM_SUBMIT_TYPE} from '../../action/authActions'
import CommonButton from '../../components/common/CommonButton'
import CommonTextInput from '../../components/common/Input/CommonTextInput'
import ImageInput from '../common/Input/ImageInput'
import PhoneInput from '../common/Input/PhoneInput'
import DateTimeInput from '../common/Input/DateTimeInput'
import * as Toast from '../common/Toast'
import GenderSelector from '../common/Input/GenderSelector'
import {activeUserInfo} from '../../selector/authSelector'
import {inputFormOnDestroy} from '../../action/inputFormActions'


const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height

let profileForm = Symbol('profileForm')

const nicknameInput = {
  formKey: profileForm,
  stateKey: Symbol('nicknameInput'),
  type: "nicknameInput",
}
const avatarInput = {
  formKey: profileForm,
  stateKey: Symbol('avatarInput'),
  type: "avatarInput",
}
const phoneInput = {
  formKey: profileForm,
  stateKey: Symbol('phoneInput'),
  type: "phoneInput",
}

const genderInput = {
  formKey: profileForm,
  stateKey: Symbol('genderInput'),
  type: "genderInput",
}
const dtPicker = {
  formKey: profileForm,
  stateKey: Symbol('dtPicker'),
  type: "dtPicker",
}

class Profile extends Component {
  constructor(props) {
    super(props)
  }

  componentWillUnmount() {
    this.props.inputFormOnDestroy({formKey: profileForm})
  }

  submitSuccessCallback(doctorInfo) {
    Toast.show('保存信息成功')
    Actions.pop()
  }

  submitErrorCallback(error) {

    Toast.show(error.message)
  }

  onButtonPress = () => {

    this.props.submitFormData({
      formKey: profileForm,
      submitType: INPUT_FORM_SUBMIT_TYPE.PROFILE_SUBMIT,
      id: this.props.userInfo && this.props.userInfo.id,
      success: this.submitSuccessCallback,
      error: this.submitErrorCallback
    })
  }

  render() {

    return(
      <View style={styles.container}>
        <Header
          headerContainerStyle={{backgroundColor: '#50E3C2'}}
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          leftStyle={{color: '#FFFFFF'}}
          title="个人信息"
          rightType=""
        />
        <View style={styles.body}>
          <ScrollView keyboardShouldPersistTaps= {true} keyboardDismissMode= {'on-drag'}>
            <View style={styles.zonea}>
              <ImageInput {...avatarInput} initValue={this.props.userInfo.avatar? this.props.userInfo.avatar: undefined} containerStyle={styles.imageInputStyle}
                          addImage={require('../../assets/images/default_portrait.png')}
                          choosenImageStyle={{borderWidth: 0, borderColor: '#FFFFFF', borderRadius: normalizeW(42), overflow: 'hidden', width: normalizeW(84), height: normalizeH(84), overlayColor: '#FFFFFF'}}
                          addImageBtnStyle={{width: normalizeW(84), height: normalizeH(84), top: 0, left: 0}}
              />
            </View>
            <View style={styles.zoneb}>
              <View style={styles.tab}>
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <Text style={styles.mainText}>昵称</Text>
                </View>
                <View style={{flex: 2, justifyContent: 'center'}}>
                  <CommonTextInput {...nicknameInput}
                                   initValue={this.props.userInfo.nickname? this.props.userInfo.nickname: undefined}
                                   clearBtnStyle={{right: em(20), top: em(6)}}
                                   inputStyle={{height: normalizeH(38), backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0,}}/>
                </View>
              </View>
              <View style={styles.tab}>
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <Text style={styles.mainText}>手机号</Text>
                </View>
                <View style={{flex: 2, justifyContent: 'center'}}>
                  <PhoneInput {...phoneInput}
                              initValue={this.props.userInfo.phone? this.props.userInfo.phone: undefined}
                              clearBtnStyle={{right: em(20), top: em(6)}}
                              inputStyle={styles.phoneInputStyle}/>
                </View>
              </View>
            </View>
            <View style={[styles.zoneb, {marginTop: normalizeH(20)}]}>
              <View style={styles.tab}>
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <Text style={styles.mainText}>性别</Text>
                </View>
                <View style={{flex: 2, paddingLeft: normalizeW(30)}}>
                  <GenderSelector {...genderInput}
                                  initValue={this.props.userInfo.gender? this.props.userInfo.gender: 'male'} />
                </View>
              </View>
              <View style={styles.tab}>
                <View style={{flex: 1, justifyContent: 'center', }}>
                  <Text style={styles.mainText}>出生年月</Text>
                </View>
                <View style={{flex: 2, justifyContent: 'center', }}>
                  <DateTimeInput {...dtPicker}
                                 initValue={this.props.userInfo.birthday? this.props.userInfo.birthday: undefined}
                                 value="2016-05-18" PickerStyle={{backgroundColor: '#FFFFFF', width: normalizeW(140), borderWidth: 0}}/>
                </View>
              </View>
            </View>
            <View style={{flex: 1, marginTop: normalizeH(40)}}>
              <CommonButton title="保存信息" onPress={() => this.onButtonPress()}/>
            </View>

          </ScrollView>
        </View>
      </View>
      )

  }
}

const mapStateToProps = (state, ownProps) => {
  let userInfo = activeUserInfo(state)
  return {
    userInfo: userInfo,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  inputFormOnDestroy,
  submitFormData,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Profile)

const  styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  body: {
    ...Platform.select({
      ios: {
        marginTop: normalizeH(64),
      },
      android: {
        marginTop: normalizeH(44)
      }
    }),
    flex: 1,
  },
  zonea: {
    height: normalizeH(144),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  zoneb: {
    height: normalizeH(112),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F4F4F4'
  },
  mainText: {
    marginLeft: normalizeW(25),
    fontFamily: 'PingFangSC-Regular',
    fontSize: em(17),
    color: '#030303',
    letterSpacing: -0.41,
  },
  tab: {
    flexDirection: 'row',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F4F4'
  },
  phoneInputStyle: {
    height: normalizeH(38),
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    paddingLeft: 0,
  },
  imageInputStyle: {
    backgroundColor: '#FFFFFF',
    width: normalizeW(84),
    height: normalizeH(84),
    borderWidth: 1,
    borderRadius: normalizeW(42),
    overflow: 'hidden'
  },
})
