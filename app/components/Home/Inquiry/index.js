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
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import {em, normalizeH, normalizeW} from '../../../util/Responsive'
import Header from '../../common/Header'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import MultilineText from '../../common/Input/MultilineText'
import ImageGroupInput from '../../common/Input/ImageGroupInput'
import {activeUserId} from '../../../selector/authSelector'
import {submitFormData,INPUT_FORM_SUBMIT_TYPE} from '../../../action/authActions'


const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

let inquiryForm = Symbol('inquiryForm')
const questionInput = {
  formKey: inquiryForm,
  stateKey: Symbol('questionInput'),
  type: 'content'
}

const diseaseImagesInput = {
  formKey: inquiryForm,
  stateKey: Symbol('diseaseImagesInput'),
  type: 'imgGroup'
}

class Inguiry extends Component {
  constructor(props) {
    super(props)
  }

  submitSuccessCallback(doctorInfo) {
    Toast.show('提交成功')
    Actions.HEALTHRECORD()
  }

  submitErrorCallback(error) {

    Toast.show(error.message)
  }

  onButtonPress= () => {
    this.props.submitFormData({
      formKey: inquiryForm,
      submitType: INPUT_FORM_SUBMIT_TYPE.INQUIRY_SUBMIT,
      id: this.props.currentUser && this.props.currentUser,
      success: this.submitSuccessCallback,
      error: this.submitErrorCallback
    })
  }

  render(){
    return (
      <View style={styles.container}>
        <Header
          headerContainerStyle={styles.header}
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress = {()=> {Actions.pop()}}
          title="快速问诊"
          titleStyle={styles.titile}
          rightType="text"
          rightText="下一步"
          rightPress={() => this.onButtonPress()}
        />
        <View style={styles.body}>
          <KeyboardAwareScrollView style={styles.scrollViewStyle} contentContainerStyle={{flex: 1}}>
            <View>
              <MultilineText containerStyle={{height: normalizeH(232)}}
                             placeholder="请详细描述您的症状和身体状况，便于医生更准确的分析，我们将确保您的隐私安全。为了描述清楚，描述字数应至少12个字符。"
                             inputStyle={{height: normalizeH(232)}}
                             {...questionInput}/>
            </View>
            <View style={{flex: 1,backgroundColor: 'rgba(0, 0, 0, 0.05)'}}>
              <Text style={styles.trip}>病症部位、检查报告或其他病情资料</Text>

              <View style={{position: 'absolute', left: normalizeW(0), top: normalizeH(0), backgroundColor: 'rgba(0, 0, 0, 0)'}}>
                <ImageGroupInput {...diseaseImagesInput}
                                 number={9}
                                 addImage={require('../../../assets/images/upload_picture.png')}
                                 imageLineCnt={4}/>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>

    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: activeUserId(state),
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  submitFormData,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Inguiry)

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
  trip: {
    marginTop: normalizeH(46),
    marginLeft: normalizeW(102),
    fontFamily: 'PingFangSC-Regular',
    fontSize: em(12),
    color: '#BEBEBE'
  }
})