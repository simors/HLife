/**
 * Created by wanpeng on 2016/12/29.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Symbol from 'es6-symbol'
import {em, normalizeH, normalizeW} from '../../../util/Responsive'
import Header from '../../common/Header'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import CommonTextInput from '../../common/Input/CommonTextInput'
import DateTimeInput from '../../common/Input/DateTimeInput'
import GenderSelector from '../../common/Input/GenderSelector'
import CommonButton from '../../common/CommonButton'
import {submitFormData} from '../../../action/inquiryAction'
import {inputFormOnDestroy} from '../../../action/inputFormActions'
import * as Toast from '../../common/Toast'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class HealthProfile extends Component {
  constructor(props) {
    super(props)
  }

  componentWillUnmount() {
    console.log("HealthProfile: componentWillUnmount")
    // this.props.inputFormOnDestroy(this.props.formKey)
  }

  submitSuccessCallback = () => {
    Toast.show('提交成功')
    Actions.SELECT_DOCTOR()
    this.props.inputFormOnDestroy({formKey: this.props.formKey})

  }

  submitErrorCallback(error) {
    Toast.show(error.message)
  }
  onButtonPress = () => {
    this.props.submitFormData({
      formKey: this.props.formKey,
      id: this.props.userId && this.props.userId,
      success: this.submitSuccessCallback,
      error: this.submitErrorCallback
    })
  }
  render() {
    const nicknameInput = {
      formKey: this.props.formKey,
      stateKey: Symbol('nicknameInput'),
      type: "nicknameInput",
    }

    const genderInput = {
      formKey: this.props.formKey,
      stateKey: Symbol('genderInput'),
      type: "genderInput",
    }

    const dtPicker = {
      formKey: this.props.formKey,
      stateKey: Symbol('dtPicker'),
      type: "dtPicker",
    }
    return (
      <View style={styles.container}>
        <Header
          headerContainerStyle={styles.header}
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress = {()=> {Actions.pop()}}
          title="新增健康档案"
          titleStyle={styles.titile}
        />
        <View style={styles.body}>
          <KeyboardAwareScrollView style={styles.scrollViewStyle} contentContainerStyle={{flex: 1}}>
            <View style={styles.zone}>
              <View style={styles.tab}>
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <Text style={styles.mainText}>昵称</Text>
                </View>
                <View style={{flex: 2, justifyContent: 'center'}}>
                  <CommonTextInput {...nicknameInput}
                                   containerStyle={{height: normalizeH(38), }}
                                   clearBtnStyle={{top:6}}
                                   inputStyle={{ backgroundColor: '#FFFFFF'}}/>
                </View>

              </View>
              <View style={styles.tab}>
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <Text style={styles.mainText}>性别</Text>
                </View>
                <View style={{flex: 2}}>
                  <GenderSelector {...genderInput}/>
                </View>
              </View>
              <View style={styles.tab}>
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <Text style={styles.mainText}>出生年月</Text>
                </View>
                <View style={{flex: 2, justifyContent: 'center'}}>
                  <DateTimeInput {...dtPicker}
                                 value="2016-05-18" PickerStyle={{backgroundColor: '#FFFFFF', width: normalizeW(140), borderWidth: 0}}/>
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>

          <View style={{flex: 1, marginTop: normalizeH(49)}}>
            <CommonButton title="创建档案并提交" onPress={() => this.onButtonPress()}/>
          </View>

        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  submitFormData,
  inputFormOnDestroy
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(HealthProfile)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  header: {
    backgroundColor: '#F9F9F9',
  },
  left: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 17,
    color: '#FFFFFF',
    letterSpacing: -0.41,
  },
  body: {
    flex: 1,
    width: PAGE_WIDTH,
    marginTop: normalizeH(64),
    backgroundColor: '#FFFFFF',
  },
  scrollViewStyle: {
    flex: 1,
    width: PAGE_WIDTH,
  },
  titile: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: em(17),
    color: '#030303',
    letterSpacing: -0.41,
  },
  zone: {
    height: normalizeH(170),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  tab: {
    flexDirection: 'row',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F4F4'
  },
  mainText: {
    marginLeft: normalizeW(25),
    fontFamily: 'PingFangSC-Regular',
    fontSize: em(17),
    color: '#030303',
    letterSpacing: -0.41,
  },
})
