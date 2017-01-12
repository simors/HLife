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
  Platform,
  Image,
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Symbol from 'es6-symbol'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import CommonButton from '../common/CommonButton'
import {em, normalizeW, normalizeH} from '../../util/Responsive'
import PhoneInput from '../common/Input/PhoneInput'
import CommonTextInput from '../common/Input/CommonTextInput'
import ImageInput from '../common/Input/ImageInput'
import {submitDoctorFormData, DOCTOR_FORM_SUBMIT_TYPE} from '../../action/doctorAction'
import MedicalLabPicker from '../common/Input/MedicalLabPicker'
import RegionPicker from '../common/Input/RegionPicker'
import ImageGroupInput from '../common/Input/ImageGroupInput'
import {activeDoctorInfo} from '../../selector/doctorSelector'
import {activeUserInfo} from '../../selector/authSelector'


const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height


let commonForm = Symbol('commonForm')

const nameInput = {
  formKey: commonForm,
  stateKey: Symbol('nameInput'),
  type: "nameInput",

}
const IDInput = {
  formKey: commonForm,
  stateKey: Symbol('IDInput'),
  type: "IDInput",
  placeholder: "请填写居民身份证号"
}
const phoneInput = {
  formKey: commonForm,
  stateKey: Symbol('phoneInput'),
  type: "phoneInput",
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
const IDImageInput = {
  formKey: commonForm,
  stateKey: Symbol('IDImageInput'),
  type: "IDImageInput",
}
const imageGroupInput = {
  formKey: commonForm,
  stateKey: Symbol('imageGroupInput'),
  type: 'imgGroup'
}

class DoctorRevise extends Component {
  constructor(props) {
    super(props)
  }

  submitSuccessCallback(doctorInfo) {
    Toast.show('认证提交成功')
    Actions.pop()
  }

  submitErrorCallback(error) {
    Toast.show(error.message)
  }

  onButtonPress = () => {
    this.props.submitDoctorFormData({
      formKey: commonForm,
      submitType: DOCTOR_FORM_SUBMIT_TYPE.DOCTOR_CERTIFICATION_MODIFY,
      id: this.props.userInfo && this.props.userInfo.id,
      success: this.submitSuccessCallback,
      error: this.submitErrorCallback
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          headerContainerStyle={styles.header}
          leftType="text"
          leftStyle={styles.left}
          leftText="取消"
          leftPress = {()=> {Actions.pop()}}
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
                  <CommonTextInput {...nameInput}
                                   initValue={this.props.doctorInfo.name}
                                   placeholder="与身份证姓名保持一致"
                                   containerStyle={{height: normalizeH(38), }}
                                   clearBtnStyle={{top:5}}
                                   inputStyle={{ backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0,}}/>

                </View>
              </View>
              <View style={styles.inputBox}>
                <Text style={styles.maintext}>身份证号</Text>
                <View style={{flex: 1}}>
                  <CommonTextInput {...IDInput}
                                   initValue={this.props.doctorInfo.ID}
                                   containerStyle={{height: normalizeH(38), }}
                                   clearBtnStyle={{top:5}}
                                   inputStyle={{ backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0,}}/>
                </View>
              </View>
              <View style={styles.inputBox}>
                <Text style={styles.maintext}>手机号</Text>
                <View style={{flex: 1}}>
                  <PhoneInput {...phoneInput}
                              initValue={this.props.doctorInfo.phone}
                              placeholder="仅用于客服与你联系"
                              editable={false}
                              clearBtnStyle={{top:5}}
                              inputStyle={styles.phoneInputStyle}/>
                </View>
              </View>
            </View>
            <View style={styles.zone}>
              <View style={styles.inputBox}>
                <Text style={styles.maintext}>执业地点</Text>
                <View style={{flex: 1}}>
                  <RegionPicker {...regionPicker}
                                initValue={this.props.doctorInfo.organization}
                                containerStyle={{height: normalizeH(38)}}
                                inputStyle={{ backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0,}}/>
                </View>
              </View>
              <View style={styles.inputBox}>
                <Text style={styles.maintext}>擅长科目</Text>
                <View style={{flex: 1}}>

                  <MedicalLabPicker {...medicalPicker}
                                    initValue={this.props.doctorInfo.department}
                                    containerStyle={{height: normalizeH(38), }}
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
                <ImageInput {...IDImageInput}
                            initValue={this.props.doctorInfo.certifiedImage}
                            containerStyle={styles.imageInputStyle}
                            addImage={require('../../assets/images/upload.png')}
                            addImageBtnStyle={{width: normalizeW(80), height: normalizeH(80), top: 0, left: 0}}
                />
              </View>

            </View>
            <View style={[styles.zone, {alignItems: 'flex-start'}]}>
              <View style={styles.imageHeader}>
                <Text style={styles.maintext}>
                  认证凭证
                </Text>
              </View>
              <View style={{flexDirection: 'row', paddingLeft: normalizeW(15)}}>
                <ImageGroupInput {...imageGroupInput}
                                 number={3}
                                 imageLineCnt={4}/>
              </View>

            </View>

            <CommonButton buttonStyle={{marginBottom: normalizeH(6), marginTop: normalizeH(54)}}
                          title="确认修改内容，重新提交"
                          onPress={this.onButtonPress}
            />
            <Text style={styles.tailText}>重新提交后，审核时间重新开始计算</Text>
          </ScrollView>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let userInfo = activeUserInfo(state)
  let doctorInfo = activeDoctorInfo(state)
  return{
    doctorInfo: doctorInfo,
    userInfo: userInfo,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  submitDoctorFormData
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(DoctorRevise)

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
    ...Platform.select({
      ios: {
        marginTop: normalizeH(64),
      },
      android: {
        marginTop: normalizeH(44),
      }
    })
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
  maintext: {
    width: normalizeW(66),
    marginLeft: normalizeW(20),
    fontFamily: 'PingFangSC-Regular',
    fontSize: em(16),
    color: '#656565',
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
  phoneInputStyle: {
    height: normalizeH(38),
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    paddingLeft: 0,
  },
  tailText: {
    fontFamily: 'PingFangSC-Regular',
    alignSelf: 'center',
    fontSize: em(12),
    color: '#B2B2B2',
    letterSpacing: 0,
    height: normalizeH(26)
  }
})
