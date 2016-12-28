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
import {em, normalizeW, normalizeH,} from '../../util/Responsive'
import PhoneInput from '../common/Input/PhoneInput'
import CommonTextInput from '../common/Input/CommonTextInput'
import ImageInput from '../common/Input/ImageInput'
import {submitFormData, submitInputData} from '../../action/authActions'
import MedicalLabPicker from '../common/Input/MedicalLabPicker'
import RegionPicker from '../common/Input/RegionPicker'
import ImageGroupViewer from '../common/Input/ImageGroupViewer'
import {activeDoctorInfo} from '../../selector/authSelector'


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
}

const medicalPicker = {
  formKey: commonForm,
  stateKey: Symbol('medicalPicker'),
  type: "medicalPicker",
}
const idImageInput = {
  formKey: commonForm,
  stateKey: Symbol('idImageInput'),
  type: "idImageInput",
}

class DoctorInfo extends Component {
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
          leftPress={()=> Actions.pop()}
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
                  <CommonTextInput {...nameInput} initValue={this.props.doctorInfo.name} placeholder="与身份证姓名保持一致"
                                   containerStyle={{height: normalizeH(38), }} editable={false}
                                   inputStyle={{ backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0,}}/>
                </View>
              </View>
              <View style={styles.inputBox}>
                <Text style={styles.maintext}>身份证号</Text>
                <View style={{flex: 1}}>
                  <CommonTextInput {...IDInput}
                                   initValue={this.props.doctorInfo.ID}
                                   containerStyle={{height: normalizeH(38), }}
                                   editable={false}
                                   inputStyle={{ backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0,}}/>
                </View>
              </View>
              <View style={styles.inputBox}>
                <Text style={styles.maintext}>手机号</Text>
                <View style={{flex: 1}}>
                  <PhoneInput {...phoneInput}
                              initValue={this.props.doctorInfo.phone}
                              editable={false}
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
                                editable={false}
                                inputStyle={{ backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0,}}/>
                </View>
              </View>
              <View style={styles.inputBox}>
                <Text style={styles.maintext}>擅长科目</Text>
                <View style={{flex: 1}}>

                  <MedicalLabPicker {...medicalPicker}
                                    initValue={this.props.doctorInfo.department}
                                    containerStyle={{height: normalizeH(38), }}
                                    editable={false}
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
                <ImageInput {...idImageInput}
                            initValue={this.props.doctorInfo.certifiedImage}
                            containerStyle={styles.imageInputStyle}
                            addImage={require('../../assets/images/upload.png')}
                            editable={false}
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
              <View style={{flexDirection: 'row'}}>
                <ImageGroupViewer images={this.props.doctorInfo.certificate} imageLineCnt={4}/>

              </View>
            </View>

          </ScrollView>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let doctorInfo = activeDoctorInfo(state)
  return{
    doctorInfo: doctorInfo,
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

})
