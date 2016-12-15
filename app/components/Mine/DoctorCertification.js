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
import ImageInput from '../common/Input/ImageInput'

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
            <View style={styles.zone}>
              <View style={styles.inputBox}>
                <Text style={styles.maintext}>姓名</Text>
                <View style={{flex: 1}}>
                  <CommonTextInput {...nameInput}  containerStyle={{height: normalizeH(38), }}
                                   inputStyle={{ backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0,}}/>
                </View>
              </View>
              <View style={styles.inputBox}>
                <Text style={styles.maintext}>身份证号</Text>
                <View style={{flex: 1}}>
                  <CommonTextInput {...idNoInput}  containerStyle={{height: normalizeH(38), }}
                                   inputStyle={{ backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0,}}/>
                </View>
              </View>
              <View style={styles.inputBox}>
                <Text style={styles.maintext}>手机号</Text>
                <View style={{flex: 1}}>
                  <PhoneInput {...phoneInput} placeholder="仅用于客服与你联系"
                              inputStyle={styles.phoneInputStyle}/>
                </View>
              </View>
              <View style={styles.inputBox}>
                <Text style={styles.maintext}>验证码</Text>
                <View style={{flex: 1,}}>
                  <SmsAuthCodeInput {...smsAuthCodeInput} containerStyle={{height: normalizeH(38)}}
                                    textInput={styles.smsAuthCodeTextInput}
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
            <View style={styles.zone}>
              <View style={styles.inputBox}>
                <Text style={styles.maintext}>执业地点</Text>
                <View style={{flex: 1}}>
                  <CommonTextInput {...addressInput}  containerStyle={{height: normalizeH(38), }}
                                   inputStyle={{ backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0,}}/>
                </View>
              </View>
              <View style={styles.inputBox}>
                <Text style={styles.maintext}>擅长科目</Text>
                <View style={{flex: 1}}>
                  <CommonTextInput {...departmentInput}  containerStyle={{height: normalizeH(38), }}
                                   inputStyle={{ backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0,}}/>
                </View>
              </View>
            </View>
            <View style={[styles.zone, {flexDirection: 'row'}]}>
              <View style={[styles.zone, {marginTop: 0, alignItems: 'flex-start', flex: 1}]}>
                <View style={styles.imageHeader}>
                  <Text style={styles.maintext}>
                    认证头像
                  </Text>
                </View>
                <Text style={styles.triptext}>
                  请上传本人持身份证的头像
                </Text>
                <ImageInput containerStyle={styles.imageInputStyle}
                            addImage={require('../../assets/images/upload.png')}
                            addImageBtnStyle={{width: normalizeW(80), height: normalizeH(80), top: 0, left: 0}}
                />
              </View>
              <View style={styles.illustrate}>
                <Text style={[styles.triptext, {paddingLeft: 0}]}>
                  参考图像及拍摄说明
                </Text>
                <View style={{width: normalizeW(109), height: normalizeH(81), backgroundColor: 'yellow'}}>

                </View>

              </View>

            </View>
            <View style={[styles.zone, {alignItems: 'flex-start'}]}>
              <View style={styles.imageHeader}>
                <Text style={styles.maintext}>
                  认证凭证
                </Text>
              </View>
                <Text style={styles.triptext}>
                  请上传医生有效证明，包含工作证、执业证和职称证
                </Text>
                <ImageInput containerStyle={styles.imageInputStyle}
                            addImage={require('../../assets/images/upload.png')}
                            addImageBtnStyle={{width: normalizeW(80), height: normalizeH(80), top: 0, left: 0}}

                />
            </View>
            <CommonButton buttonStyle={{marginBottom: normalizeH(6), marginTop: normalizeH(100)}} title="提交认证" />
            <View style={styles.agreement}>
              <Text style={styles.agreementText}>我已阅读</Text>
              <Text style={[styles.agreementText, {color: '#50E3C2'}]}>《近来医生用户协议》</Text>
            </View>
          </ScrollView>
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
  zone: {
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
    paddingLeft: normalizeW(20),
    marginBottom: normalizeH(8),
    fontSize: 12,
    color: '#B2B2B2',
    letterSpacing: -0.31,
  },
  agreement: {
    flexDirection: 'row',
    marginBottom: normalizeH(35),
    alignSelf: 'center'
  },
  agreementText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#B2B2B2',
  },
  imageInputStyle: {
    marginLeft: normalizeW(20),
    width: normalizeW(80),
    height: normalizeH(80),
    marginBottom: normalizeH(12),
    borderStyle: 'dashed',
  },
  imageHeader: {
    width: normalizeW(86),
    height: normalizeH(40),
    justifyContent: 'center'
  },
  illustrate: {
    marginTop: normalizeH(36),
    borderLeftWidth: 1,
    borderLeftColor: '#D3D2D6',
    paddingLeft: normalizeW(12),
    paddingRight: normalizeW(12)
  },
  smsAuthCodeTextInput: {
    height: normalizeH(38),
    backgroundColor: "#FFFFFF",
    borderWidth: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
  phoneInputStyle: {
    height: normalizeH(38),
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    paddingLeft: 0,
  }

})