/**
 * Created by wanpeng on 2016/12/13.
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
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Symbol from 'es6-symbol'
import Header from '../common/Header'
import CommonButton from '../common/CommonButton'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import PhoneInput from '../common/Input/PhoneInput'
import CommonTextInput from '../common/Input/CommonTextInput'
import SmsAuthCodeInput from '../common/Input/SmsAuthCodeInput'

const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height


let commonForm = Symbol('commonForm')

const nameInput = {
  formKey: commonForm,
  stateKey: Symbol('nameInput'),
  type: "nameInput",
  initValue: "与身份证姓名保持一致"
}
const idNoInput = {
  formKey: commonForm,
  stateKey: Symbol('idNoInput'),
  type: "idNoInput",
  initValue: "请填写居民身份证号"
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

const addressInput = {
  formKey: commonForm,
  stateKey: Symbol('addressInput'),
  type: "addressInput",
  initValue: "点击输入医院、诊所或药店地址"
}

const departmentInput = {
  formKey: commonForm,
  stateKey: Symbol('departmentInput'),
  type: "departmentInput",
  initValue: "选择科室"
}

 class DoctorCertification extends Component {
  constructor(props) {
    super(props)
  }


  render() {
    return (
      <View style={styles.container}>
        <Header
          headerContainerStyle={styles.header}
          leftType="text"
          leftStyle={styles.left}
          leftText="取消"
          title="医生认证"
          titleStyle={styles.left}
          rightType=""
        />
        <View style={styles.body}>
          <ScrollView>
            <View style={styles.trip}>
              <Text style={{fontSize: 12}}>欢迎加入近来医生，完成认证可使用完整功能</Text>
            </View>
            <View style={styles.azone}>
              <View style={styles.inputBox}>
                <Text style={styles.maintext}>姓名</Text>
                <View style={{flex: 1}}>
                  <CommonTextInput {...nameInput}  containerStyle={{height: normalizeH(38), }} inputStyle={{ backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0,}}/>
                </View>
              </View>
              <View style={styles.inputBox}>
                <Text style={styles.maintext}>身份证号</Text>
                <View style={{flex: 1}}>
                  <CommonTextInput {...idNoInput}  containerStyle={{height: normalizeH(38), }} inputStyle={{ backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0,}}/>
                </View>
              </View>
              <View style={styles.inputBox}>
                <Text style={styles.maintext}>手机号</Text>
                <View style={{flex: 1}}>
                  <PhoneInput {...phoneInput} placeholder="仅用于客服与你联系" inputStyle={{height: normalizeH(38), backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0,}}/>
                </View>
              </View>
              <View style={styles.inputBox}>
                <Text style={styles.maintext}>验证码</Text>
                <View style={{flex: 1,}}>
                  <SmsAuthCodeInput {...smsAuthCodeInput} containerStyle={{height: normalizeH(38)}}
                                    textInput={{height: normalizeH(38), backgroundColor: "#FFFFFF", borderWidth: 0, paddingLeft: 0, paddingRight: 0, }}
                                    inputContainer={{paddingLeft: 17, paddingRight: 17}}
                                    placeholder = "填写手机验证码"
                                    codeTextContainer={{width: normalizeW(97), height: normalizeH(30), borderRadius: 5,}}
                                    codeText={{fontSize: 12}}
                                    getSmsAuCode={() => {
                                      this.props.submitFormData({
                                        formKey: commonForm,
                                        submitType: INPUT_FORM_SUBMIT_TYPE.GET_SMS_CODE,
                                        success:() => {},
                                        error: (error) => {Toast.show(error.message)}
                                      })
                                    }}/>
                </View>
              </View>

            </View>
            <View style={styles.bzone}>
              <View style={styles.inputBox}>
                <Text style={styles.maintext}>执业地点</Text>
                <View style={{flex: 1}}>
                  <CommonTextInput {...addressInput}  containerStyle={{height: normalizeH(38), }} inputStyle={{ backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0,}}/>
                </View>
              </View>
              <View style={styles.inputBox}>
                <Text style={styles.maintext}>擅长科目</Text>
                <View style={{flex: 1}}>
                  <CommonTextInput {...departmentInput}  containerStyle={{height: normalizeH(38), }} inputStyle={{ backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0,}}/>
                </View>
              </View>
            </View>
            <View style={styles.czone}>
              <View style={{paddingLeft: normalizeW(20)}}>
                <View style={{width: normalizeW(66), height: normalizeH(40), justifyContent: 'flex-start', borderWidth: 1, borderColor: 'red' }}>
                  <Text style={styles.maintext}>
                    认证头像
                  </Text>
                </View>

                <Text style={styles.triptext}>
                  请上传本人持身份证的头像
                </Text>
                <View style={{width: normalizeW(80), height: normalizeH(80), borderWidth:2, borderColor:'yellow'}}></View>

              </View>
              <View style={{height: normalizeH(104), marginTop: normalizeH(36), borderLeftWidth: 1, marginRight: normalizeW(12), borderLeftColor: '#D3D2D6'}}>
                <Text style={styles.triptext}>参考图像及拍摄说明</Text>
                {/*<Image source={require('../../assets/images/mine_wallet.png')}/>*/}
                <View style={{width: normalizeW(109), height: normalizeH(81), borderWidth:2, borderColor:'yellow'}}></View>
              </View>


            </View>

          </ScrollView>
        </View>
        {/*<CommonButton buttonStyle={{marginBottom: normalizeH(63),}} title="提交认证" />*/}
        <View style={styles.agreement}>
          <Text style={{fontFamily: 'PingFangSC-Regular', fontSize: 12, color: '#B2B2B2', }}>我已阅读</Text>
          <Text style={{fontFamily: 'PingFangSC-Regular', fontSize: 12, color: '#50E3C2', }}>服务条款及协议</Text>
        </View>

      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(DoctorCertification)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',

  },
  header: {
    backgroundColor: '#50E3C2',
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

  },
  azone: {
    marginTop: normalizeH(15),
    backgroundColor: '#FFFFFF',


  },
  inputBox: {
    flex: 1,
    height: normalizeH(40),
    borderBottomWidth: 1,
    borderBottomColor: '#C8C7CC',
    flexDirection: 'row',
    alignItems: 'center',

  },
  phoneInputBox: {

  },
  bzone: {
    marginTop: normalizeH(15),
    backgroundColor: '#FFFFFF',

  },
  czone: {
    marginTop: normalizeH(15),
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
  },
  trip: {
    height: normalizeH(44),
    backgroundColor: 'rgba(80, 226, 193, 0.23)',
    justifyContent: 'center',
    alignItems: 'center'

  },
  maintext: {
    width: normalizeW(66),
    marginLeft: normalizeW(20),
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#656565',
  },
  triptext: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#B2B2B2',
    letterSpacing: -0.31,
  },
  agreement: {
    flexDirection: 'row',
    marginBottom: normalizeH(35),
    width: normalizeW(172),
    height: normalizeH(26),
    borderColor: 'yellow',
    borderWidth: 2,

  }

})