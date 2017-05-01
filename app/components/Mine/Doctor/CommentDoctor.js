/**
 * Created by wanpeng on 2017/1/17.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  InteractionManager,
  ScrollView,
  Text,
  ListView,
  Image,
  TouchableOpacity,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/Ionicons'
import Header from '../../common/Header'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import MultilineText from '../../common/Input/MultilineText'
import ScoreInput from '../../common/Input/ScoreInput'
import {submitDoctorFormData, DOCTOR_FORM_SUBMIT_TYPE} from '../../../action/doctorAction'
import Symbol from 'es6-symbol'



const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

let commentDoctorForm = Symbol('commentDoctorForm')

const scoreInput = {
  formKey: commentDoctorForm,
  stateKey: Symbol('scoreInput'),
  type: 'score'
}

const commentInput = {
  formKey: commentDoctorForm,
  stateKey: Symbol('commentInput'),
  type: 'content'
}


class CommentDoctor extends Component {
  constructor(props) {
    super(props)
  }

  renderOriginalInquiry() {
    return (
      <View style={styles.itemView}>
        <TouchableOpacity style={styles.selectItem} onPress={() => Actions.INQUIRY_MESSAGE_BOX()}>
          <Text numberOfLines={1} style={{}}>
            {'原问题：' + '最近老是失眠。。。。。。' + '(男， 57岁)'}
          </Text>
          <View style={{position: 'absolute', right: 3, top: 3}}>
            <Icon name='ios-arrow-forward' size={30} color={'red'}/>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  submitSuccessCallback() {
    Toast.show('评论提交成功')
    Actions.pop()
  }

  submitErrorCallback(error) {
    Toast.show(error.message)
  }

  onButtonPress = () => {
    this.props.submitDoctorFormData({
      formKey: commentDoctorForm,
      submitType: DOCTOR_FORM_SUBMIT_TYPE.DOCTOR_COMMENT,
      success: this.submitSuccessCallback,
      error: this.submitErrorCallback
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          headerContainerStyle={styles.header}
          leftType="icon"
          leftStyle={styles.left}
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="效果评价"
          rightType="text"
          rightText="提交"
          rightStyle={styles.left}
          rightPress={this.onButtonPress}
        />
        <View style={styles.itemContainer}>
          <View>
            {this.renderOriginalInquiry()}
            <View>
              <TouchableOpacity style={{flexDirection: 'row', backgroundColor: '#FFFFFF', marginBottom: normalizeH(10)}} onPress={() => {}}>
                <Image style={styles.avatar}
                       source={require('../../../assets/images/defualt_portrait_archives.png')}/>
                <View style={styles.desc}>
                  <View style={{flexDirection: 'row', marginTop: normalizeH(12), alignItems: 'flex-end'}}>
                    <Text style={styles.name}>老王</Text>
                    <Text style={styles.level}>主治医师</Text>
                  </View>
                  <Text style={styles.spec}>呼吸系统疾病的诊断。。。。。。。。。</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.body}>
                <Text style={styles.title}>您对医生的服务满意吗？</Text>
                <View style={{marginTop: normalizeH(10)}}>
                  <ScoreInput
                    {...scoreInput}
                  />
                </View>
                <Text style={styles.title}>给医生一些评价吧～</Text>
                <View style={{marginTop: normalizeH(10)}}>
                  <MultilineText containerStyle={{height: normalizeH(100), borderWidth: normalizeBorder(), borderRadius:2, borderColor: '#8F8E94', marginRight: normalizeW(10)}}
                                 placeholder="欢迎提出更多建议或意见"
                                 inputStyle={{height: normalizeH(100), fontSize: 12}}
                                 {...commentInput}/>
                </View>

              </View>
            </View>

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
  submitDoctorFormData,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CommentDoctor)

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  itemContainer: {
    width: PAGE_WIDTH,
    marginTop: normalizeH(65),
  },
  itemText: {
    fontFamily:'PingFangSC-Regular',
    fontSize: 15,
    color: '#9B9B9B'
  },
  numText: {
    fontFamily:'PingFangSC-Semibold',
    fontSize: 17,
    color: '#F6A623'
  },
  itemView: {
    borderBottomWidth: 1,
    borderColor: '#E6E6E6',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  selectItem: {
    width: PAGE_WIDTH,
    flexDirection: 'row',
    height: normalizeH(40),
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  avatar: {
    margin: normalizeH(10),
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  desc: {
    flex: 1,
  },
  name: {
    fontFamily:'PingFangSC-Regular',
    fontSize: 15,
    color: '#030303',
    marginRight:normalizeH(5),
  },
  level: {
    fontFamily:'PingFangSC-Regular',
    fontSize: 12,
    color: '#8F8E94'
  },
  spec: {
    fontFamily:'PingFangSC-Regular',
    fontSize: 12,
    color: '#8F8E94'
  },
  body: {
    backgroundColor: '#FFFFFF',
    paddingLeft: normalizeW(10),
  },
  title: {
    marginTop: normalizeH(12),
  },
  face: {
    width: 40,
    height: 40,
  },
  faceStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})