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
import {Actions} from 'react-native-router-flux'
import Symbol from 'es6-symbol'
import Header from '../common/Header'
import CommonButton from '../common/CommonButton'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import PhoneInput from '../common/Input/PhoneInput'
import CommonTextInput from '../common/Input/CommonTextInput'
import SmsAuthCodeInput from '../common/Input/SmsAuthCodeInput'
import ImageInput from '../common/Input/ImageInput'
import {submitFormData, submitInputData,INPUT_FORM_SUBMIT_TYPE} from '../../action/authActions'
import * as Toast from '../common/Toast'
import {isInputValid} from '../../selector/inputFormSelector'
import MedicalLabPicker from '../common/Input/MedicalLabPicker'
import RegionPicker from '../common/Input/RegionPicker'
import {getInputData} from '../../selector/inputFormSelector'
import ImageGroupViewer from '../common/Input/ImageGroupViewer'


const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height


let commonForm = Symbol('commonForm')

const nameInput = {
  formKey: commonForm,
  stateKey: Symbol('nameInput'),
  type: "nameInput",

}
const idNoInput = {
  formKey: commonForm,
  stateKey: Symbol('idNoInput'),
  type: "idNoInput",
  placeholder: "请填写居民身份证号"
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

const regionPicker = {
  formKey: commonForm,
  stateKey: Symbol('regionPicker'),
  type: "regionPicker",
  placeholder: "点击输入医院、诊所或药店地址"
}

const medicalPicker = {
  formKey: commonForm,
  stateKey: Symbol('medicalPicker'),
  type: "medicalPicker",
  placeholder: "选择科室"
}
const idImageInput = {
  formKey: commonForm,
  stateKey: Symbol('idImageInput'),
  type: "idImageInput",
}
const cardImageInputA = {
  formKey: commonForm,
  stateKey: Symbol('cardImageInputA'),
  type: "cardImageInput",
}
const cardImageInputB = {
  formKey: commonForm,
  stateKey: Symbol('cardImageInputB'),
  type: "cardImageInput",
}
const cardImageInputC = {
  formKey: commonForm,
  stateKey: Symbol('cardImageInputC'),
  type: "cardImageInput",
}

const images = [
  'http://c.hiphotos.baidu.com/image/pic/item/64380cd7912397dd5393db755a82b2b7d1a287dd.jpg',
  'http://c.hiphotos.baidu.com/image/pic/item/d009b3de9c82d1585e277e5f840a19d8bd3e42b2.jpg',
  'http://g.hiphotos.baidu.com/image/pic/item/83025aafa40f4bfb1530a905014f78f0f63618fa.jpg',
  'http://c.hiphotos.baidu.com/image/pic/item/f7246b600c3387448982f948540fd9f9d72aa0bb.jpg'
]

class DoctorInfo extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    console.log("render:", require('../../assets/images/card_portrait.png'))
    return (
      <View style={styles.container}>
        <Header
          headerContainerStyle={styles.header}
          leftType="text"
          leftStyle={styles.left}
          leftText="取消"
          title="认证资料信息"
          titleStyle={styles.left}
          rightType=""
        />
        <View style={styles.body}>
          <ScrollView keyboardShouldPersistTaps= {true} keyboardDismissMode= {'on-drag'}>
            <View style={styles.zone}>
              <View style={styles.inputBox}>
                <Text style={styles.maintext}>姓名</Text>
                <View style={{flex: 1}}>
                  {/*<CommonTextInput {...nameInput} placeholder="与身份证姓名保持一致" containerStyle={{height: normalizeH(38), }}*/}
                                   {/*inputStyle={{ backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0,}}/>*/}
                  <Text>我爱我家</Text>
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
            </View>
            <View style={styles.zone}>
              <View style={styles.inputBox}>
                <Text style={styles.maintext}>执业地点</Text>
                <View style={{flex: 1}}>
                  <RegionPicker {...regionPicker} containerStyle={{height: normalizeH(38)}}
                                inputStyle={{ backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0,}}/>
                </View>
              </View>
              <View style={styles.inputBox}>
                <Text style={styles.maintext}>擅长科目</Text>
                <View style={{flex: 1}}>

                  <MedicalLabPicker {...medicalPicker} containerStyle={{height: normalizeH(38), }}
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
                <ImageInput {...idImageInput} containerStyle={styles.imageInputStyle}
                            addImage={require('../../assets/images/upload.png')}
                            addImageBtnStyle={{width: normalizeW(80), height: normalizeH(80), top: 0, left: 0}}
                />
                <ImageGroupViewer images={images} imageLineCnt={3}/>
              </View>

            </View>
            <View style={[styles.zone, {alignItems: 'flex-start'}]}>
              <View style={styles.imageHeader}>
                <Text style={styles.maintext}>
                  认证凭证
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <ImageGroupViewer images={images} imageLineCnt={3}/>

              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let nameInputData = getInputData(state, Symbol('profileForm'), Symbol('nicknameInput'))
  return {
    nickname: nameInputData.text

  }

}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  submitFormData,
  submitInputData
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(DoctorInfo)

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
    fontSize: em(16),
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
