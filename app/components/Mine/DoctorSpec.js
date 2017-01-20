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
import {Actions} from 'react-native-router-flux'
import Symbol from 'es6-symbol'
import Header from '../common/Header'
import MultilineText from '../common/Input/MultilineText'
import {em, normalizeW, normalizeH,} from '../../util/Responsive'
import {inputFormCheck} from '../../action/inquiryAction'
import * as Toast from '../common/Toast'
import {submitDoctorFormData, DOCTOR_FORM_SUBMIT_TYPE} from '../../action/doctorAction'
import {activeUserInfo} from '../../selector/authSelector'
import {activeDoctorInfo} from '../../selector/doctorSelector'


const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height

let doctorSpecForm = Symbol('doctorSpecForm')

const specInput = {
  formKey: doctorSpecForm,
  stateKey: Symbol('specInput'),
  type: 'content'
}

class DoctorSpec extends Component {
  constructor(props) {
    super(props)
  }

  submitSuccessCallback = () => {
    Toast.show("提交成功")
    if (this.props.interKey == 'Basic_doctor_info') {
      Actions.pop()
    } else if (this.props.interKey == 'mine' || this.props.interKey == 'Doctor_intro') {
      Actions.DOCTOR()
    }
  }

  submitErrorCallback = (error) => {
    Toast.show(error.message)
  }

  onButtonPress= () => {
    this.props.submitDoctorFormData({
      formKey: doctorSpecForm,
      submitType: DOCTOR_FORM_SUBMIT_TYPE.SUBMIT_DOCTOR_SPEC,
      id: this.props.userInfo.id,
      success: this.submitSuccessCallback,
      error: this.submitErrorCallback,
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
          leftPress={()=> Actions.pop()}
          title="完善信息"
          titleStyle={styles.left}
          rightType="text"
          rightText="完成"
          rightStyle={styles.left}
          rightPress={() => this.onButtonPress()}
        />
        <View style={styles.body}>
          <View style={{height: normalizeH(40)}}>
            <Text style={[styles.left, {marginLeft: normalizeW(23), marginTop: normalizeH(14), color: '#030303'}]}>擅长疾病</Text>
          </View>
          <View style={styles.textArea}>
            <MultilineText containerStyle={{height: normalizeH(232)}}
                           initValue={this.props.doctorInfo.spec}
                           placeholder="请填写您擅长的疾病及科室，让患者更方便地找到你"
                           inputStyle={{height: normalizeH(232)}}
                           {...specInput}/>
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let userInfo = activeUserInfo(state)
  let doctorInfo = activeDoctorInfo(state)
  return{
    userInfo: userInfo,
    doctorInfo: doctorInfo,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  inputFormCheck,
  submitDoctorFormData,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSpec)

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
  textArea: {
    flex: 1,
    marginLeft: normalizeW(15),
    marginRight: normalizeW(15),
    borderWidth: 1,
    borderColor: '#50E3C2',
    borderRadius: em(5),
  }



})

