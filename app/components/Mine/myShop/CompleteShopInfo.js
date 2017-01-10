/**
 * Created by zachary on 2017/1/10.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  ListView,
  TouchableOpacity,
  Image,
  Platform,
  InteractionManager
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Symbol from 'es6-symbol'
import {Actions} from 'react-native-router-flux'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'
import * as appConfig from '../../../constants/appConfig'
import Header from '../../common/Header'
import CommonButton from '../../common/CommonButton'
import PhoneInput from '../../common/Input/PhoneInput'
import CommonTextInput from '../../common/Input/CommonTextInput'
import SmsAuthCodeInput from '../../common/Input/SmsAuthCodeInput'
import {submitFormData, submitInputData,INPUT_FORM_SUBMIT_TYPE} from '../../../action/authActions'
import * as Toast from '../../common/Toast'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

let commonForm = Symbol('commonForm')

const nameInput = {
  formKey: commonForm,
  stateKey: Symbol('nameInput'),
  type: "nameInput",
}
const phoneInput = {
  formKey: commonForm,
  stateKey: Symbol('phoneInput'),
  type: "phoneInput",
}
const smsAuthCodeInput = {
  formKey: commonForm,
  stateKey: Symbol('smsAuthCodeInput'),
  type: "smsAuthCodeInput",
}
const shopNameInput = {
  formKey: commonForm,
  stateKey: Symbol('shopNameInput'),
  type: "shopNameInput",
}
const shopAddrInput = {
  formKey: commonForm,
  stateKey: Symbol('shopAddrInput'),
  type: "shopAddrInput",
}
const invitationCodeInput = {
  formKey: commonForm,
  stateKey: Symbol('invitationCodeInput'),
  type: "invitationCodeInput",
}

class CompleteShopInfo extends Component {
  constructor(props) {
    super(props)

  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {

    })
  }

  submitSuccessCallback(doctorInfo) {
    Actions.SHOPR_EGISTER_SUCCESS()
  }

  submitErrorCallback(error) {

    Toast.show(error.message)
  }

  onButtonPress = () => {
    this.props.submitFormData({
      formKey: commonForm,
      submitType: INPUT_FORM_SUBMIT_TYPE.SHOP_CERTIFICATION,
      success: this.submitSuccessCallback,
      error: this.submitErrorCallback
    })
  }

  rightComponent() {
    return (
      <View style={styles.completeBtnBox}>
        <Text style={styles.completeBtn}>完成</Text>
      </View>
    )
  }


  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="text"
          leftText="取消"
          leftPress={() => Actions.pop()}
          title="完善店铺资料"
          headerContainerStyle={styles.headerContainerStyle}
          leftStyle={styles.headerLeftStyle}
          titleStyle={styles.headerTitleStyle}
          rightComponent={()=>{this.rightComponent()}}
        />
        <View style={styles.body}>

          <KeyboardAwareScrollView
            keyboardDismissMode='on-drag'
            automaticallyAdjustContentInsets={false}
          >
            <View style={styles.subTitleWrap}>
              <Text style={styles.subTitle}>欢迎加入{appConfig.APP_NAME}，给你的店铺带好更好的收入</Text>
            </View>
            <View style={styles.inputsWrap}>
              <View style={styles.inputWrap}>
                <View style={styles.inputLabelBox}>
                  <Text style={styles.inputLabel}>姓名</Text>
                </View>
                <View style={styles.inputBox}>
                  <CommonTextInput
                    {...nameInput}
                    placeholder="与身份证姓名保持一致"
                    containerStyle={styles.containerStyle}
                    inputStyle={styles.inputStyle}
                  />
                </View>
              </View>

              <View style={styles.inputWrap}>
                <View style={styles.inputLabelBox}>
                  <Text style={styles.inputLabel}>手机号</Text>
                </View>
                <View style={styles.inputBox}>
                  <PhoneInput
                    {...phoneInput}
                    placeholder="仅用于客服与你联系"
                    containerStyle={styles.containerStyle}
                    inputStyle={styles.inputStyle}/>
                </View>
              </View>

            </View>


            <View style={styles.footer}>
              <CommonButton
                title="提交店铺"
                onPress={this.onButtonPress}
              />

            </View>

          </KeyboardAwareScrollView>

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
  submitInputData
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CompleteShopInfo)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)'
  },
  headerContainerStyle: {
    borderBottomWidth: 0,
    backgroundColor: THEME.colors.green
  },
  headerLeftStyle: {
    color: '#fff',
    fontSize: em(17)
  },
  headerTitleStyle: {
    color: '#fff',
  },
  completeBtnBox: {
    borderWidth: normalizeBorder(),
    borderColor: '#fff',
    padding: 5,
  },
  completeBtn: {
    fontSize: em(17),
    color: '#fff'
  }


})