/**
 * Created by wuxingyu on 2016/12/21.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
  ScrollView,

} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Symbol from 'es6-symbol'
import Header from '../common/Header'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import {publishTopicFormData, TOPIC_FORM_SUBMIT_TYPE} from '../../action/topicActions'
import {fetchTopicDraft, handleDestroyTopicDraft} from '../../action/draftAction'
import {inputFormOnDestroy} from '../../action/inputFormActions'
import uuid from 'react-native-uuid'
import {getTopicCategories} from '../../selector/configSelector'
import CommonTextInput from '../common/Input/CommonTextInput'
import ModalBox from 'react-native-modalbox';
import {Actions} from 'react-native-router-flux'
import * as Toast from '../common/Toast'
import {isUserLogined, activeUserInfo} from '../../selector/authSelector'
import ArticleEditor from '../common/Input/ArticleEditor'
import TimerMixin from 'react-timer-mixin'
import THEME from '../../constants/themes/theme1'
import Icon from 'react-native-vector-icons/Ionicons'
import * as AVUtils from '../../util/AVUtils'
import {getGeopoint} from '../../selector/locSelector'
import Popup from '@zzzkk2009/react-native-popup'


const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

let topicForm = Symbol('topicForm')
const topicName = {
  formKey: topicForm,
  stateKey: Symbol('topicName'),
  type: "topicName",
  checkValid: (data) => {
    if (data && data.text) {
      return {isVal: true, errMsg: '验证通过'}
    }
    return {isVal: false, errMsg: '请输入标题'}
  },
}

const topicContent = {
  formKey: topicForm,
  stateKey: Symbol('topicContent'),
  type: 'topicContent',
  checkValid: (data) => {
    let textLen = 0
    if (data && data.text) {
      data.text.forEach((content) => {
        if (content.type === 'COMP_TEXT') {
          textLen += content.text.length
        }
      })
    }
    if (textLen >= 20) {
      return {isVal: true, errMsg: '验证通过'}
    }
    return {isVal: false, errMsg: '正文内容不少于20字'}
  },
}

const rteHeight = {
  height: normalizeH(64),
}

const wrapHeight = normalizeH(118)

class PublishTopics extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isDisabled: false,
      selectedTopic: undefined,
      rteFocused: false,    // 富文本获取到焦点
      extraHeight: rteHeight.height,
      headerHeight: wrapHeight,
    };
    this.insertImages = []
    this.isPublishing = false
    this.draftId=uuid.v1()
    this.draftMonth=new Date().getMonth() + 1
    this.draftDay = new Date().getDate()
  }

  submitSuccessCallback(context) {
    this.isPublishing = false
    Toast.show('恭喜您,发布成功!')

    //Actions.pop()
    // Actions.FIND({categoryId: this.state.selectedTopic.objectId})
    AVUtils.switchTab('FIND', {categoryId: this.state.selectedTopic.objectId})

    this.props.handleDestroyTopicDraft({id:this.draftId})
    this.props.inputFormOnDestroy({formKey: topicForm})
  }

  submitErrorCallback(error) {
    this.isPublishing = false
    Toast.show(error.message)
  }
  componentWillUnmount(){
    // console.log('unmount')
    // this.timer&&clearInterval(this.timer)
  }

  onButtonPress = () => {
    if (this.props.isLogin) {
      if (this.state.selectedTopic) {
        if (this.isPublishing) {
          Toast.show('正在发布，请稍后！', {duration: 2000})
          return
        }
        this.isPublishing = true
        Toast.show('开始发布...', {
          duration: 500,
          onHidden: ()=> {
            this.publishTopic()
          }
        })
      }
      else {
        Toast.show("请选择一个话题类别")
        this.isPublishing = false
      }
    }
    else {
      Actions.LOGIN()
    }
  }

  publishTopic() {
    let geoPoint = this.props.geoPoint
    if (geoPoint && geoPoint.latitude == 0 && geoPoint.longitude == 0) {
      Popup.confirm({
        title: '系统提示',
        content: '确定话题不使用位置信息吗？',
        ok: {
          text: '确定',
          style: {color: THEME.base.mainColor},
          callback: ()=> {
            this.props.publishTopicFormData({
              formKey: topicForm,
              images: this.insertImages,
              categoryId: this.state.selectedTopic.objectId,
              userId: this.props.userInfo.id,
              submitType: TOPIC_FORM_SUBMIT_TYPE.PUBLISH_TOPICS,
              success: ()=> {
                this.submitSuccessCallback(this)
              },
              error: (err) => this.submitErrorCallback(err)
            })
          }
        },
        cancel: {
          text: '取消',
          callback: ()=>{
            this.isPublishing = false
          }
        }
      })
    } else {
      this.props.publishTopicFormData({
        formKey: topicForm,
        images: this.insertImages,
        categoryId: this.state.selectedTopic.objectId,
        userId: this.props.userInfo.id,
        submitType: TOPIC_FORM_SUBMIT_TYPE.PUBLISH_TOPICS,
        success: ()=> {
          this.submitSuccessCallback(this)
        },
        error: (err) => this.submitErrorCallback(err)
      })
    }
  }

  componentDidMount() {
    if (this.props.topicId && this.props.topicId.objectId) {
      this.setState({selectedTopic: this.props.topicId});
    }
    let geoPoint = this.props.geoPoint
    if (geoPoint && geoPoint.latitude == 0 && geoPoint.longitude == 0) {
      Popup.confirm({
        title: '系统提示',
        content: '请确认已打开位置权限！没有获取到地理位置的情况下发表话题，将不能在本地显示！',
        ok: {
          text: '确定',
          style: {color: THEME.base.mainColor},
          callback: ()=> {
          }
        },
      })
    }
    this.setInterval(()=>{
      this.props.fetchTopicDraft({
        userId:this.props.userInfo.id,
        draftId:this.draftId,
        formKey: topicForm,
        images: this.insertImages,
        draftDay:this.draftDay,
        draftMonth:this.draftMonth,
        categoryId: this.state.selectedTopic?this.state.selectedTopic.objectId:'',
      })
    },5000)
  }

  openModal() {
    Keyboard.dismiss()
    setTimeout(()=>{
      this.refs.modal3.open();
    }, 500)
  }

  closeModal(value) {
    this.setState({selectedTopic: value})
    this.refs.modal3.close();
  }

  renderTopicsSelected() {
    if (this.props.topics) {
      return (
        this.props.topics.map((value, key)=> {
          if (value && value.objectId) {
            return (
              <View key={key} style={styles.modalTopicButtonStyle}>
                <TouchableOpacity style={styles.modalTopicStyle}
                                  onPress={()=>this.closeModal(value)}>
                  <Text style={styles.ModalTopicTextStyle}>
                    {value.title}
                  </Text>
                </TouchableOpacity>
              </View>
            )
          }
        })
      )
    }
  }

  renderSelectedTopic() {
    if (this.state.selectedTopic) {
      return (
        <View style={styles.selectedTopicStyle}>
          <Text style={styles.selectedTopicTextStyle}>
            {this.state.selectedTopic.title}
          </Text>
        </View>
      )
    }
    else {
      return (
        <View/>
      )
    }
  }

  getRichTextImages(images) {
    this.insertImages = images
    // console.log('images list', this.insertImages)
  }

  renderArticleEditorToolbar() {
    return (
      <View style={{width: normalizeW(64), backgroundColor: THEME.base.mainColor}}>
        <TouchableOpacity onPress={() => {Keyboard.dismiss()}}
                          style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize: em(15), color: 'white'}}>收起</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderRichText() {
    return (
      <ArticleEditor
        {...topicContent}
        wrapHeight={this.state.extraHeight}
        renderCustomToolbar={() => {return this.renderArticleEditorToolbar()}}
        getImages={(images) => this.getRichTextImages(images)}
        onFocusEditor={() => {this.setState({headerHeight: 0})}}
        onBlurEditor={() => {this.setState({headerHeight: wrapHeight})}}
        placeholder="分享吃喝玩乐、共享周边生活信息"
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>

        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => {
            this.props.fetchTopicDraft({
              userId:this.props.userInfo.id,
              draftId:this.draftId,
              formKey: topicForm,
              images: this.insertImages,
              draftDay:this.draftDay,
              draftMonth:this.draftMonth,
              categoryId: this.state.selectedTopic?this.state.selectedTopic.objectId:'',
            })
            Actions.pop({type:'refresh'})}}
          title="发布话题"
          rightType="text"
          rightText="发布"
          rightPress={() => this.onButtonPress()}
        />

        <View style={styles.body}>

          <View>
            <View style={{height: this.state.headerHeight, overflow: 'hidden'}}
                  onLayout={(event) => {this.setState({extraHeight: rteHeight.height + event.nativeEvent.layout.height})}}>
              <View style={styles.toSelectContainer}>
                <Text style={styles.topicTypeTitleStyle}>主题板块</Text>
                <TouchableOpacity style={styles.selectBtnView} onPress={this.openModal.bind(this)}>
                  {this.renderSelectedTopic()}
                  <Image style={styles.imageStyle} source={require("../../assets/images/PinLeft_gray.png")}/>
                </TouchableOpacity>
              </View>
              <View style={{height: normalizeH(59)}}>
                <CommonTextInput maxLength={36}
                                 autoFocus={true}
                                 outerContainerStyle={{backgroundColor: '#FFFFFF'}}
                                 containerStyle={styles.titleContainerStyle}
                                 inputStyle={styles.titleInputStyle}
                                 {...topicName}
                                 placeholder="标题"/>
              </View>
            </View>

            {this.renderRichText()}
          </View>

          

        </View>


        <ModalBox style={styles.modalStyle} entry='top' position="top" ref={"modal3"}>
            <View style={styles.modalTitleContainer}>
              <Text style={styles.modalTitleTxt}>选择一个主题</Text>
              <TouchableOpacity onPress={()=>{this.closeModal(this.state.selectedTopic)}} style={{position:'absolute',right:0,top:0}}>
                <Icon name='ios-close' style={{fontSize:24,height:24}} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{flex: 1, height: PAGE_HEIGHT}}>
              <View style={{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start'}}>
                {this.renderTopicsSelected()}
              </View>
            </ScrollView>
          </ModalBox>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const topics = getTopicCategories(state)
  const isLogin = isUserLogined(state)
  const userInfo = activeUserInfo(state)
  let geoPoint = getGeopoint(state)
  return {
    topics: topics,
    isLogin: isLogin,
    userInfo: userInfo,
    geoPoint: geoPoint,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  publishTopicFormData,
  fetchTopicDraft,
  handleDestroyTopicDraft,
  inputFormOnDestroy
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PublishTopics)

Object.assign(PublishTopics.prototype, TimerMixin)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  body: {
    marginTop: normalizeH(64),
    height: PAGE_HEIGHT,
    width: PAGE_WIDTH
  },

  //选择话题的对话框的样式
  toSelectContainer: {
    height: normalizeH(59),
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  selectBtnView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedTopicStyle: {
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: 'white',
    height: normalizeH(29),
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderRadius: 5,
    borderColor: THEME.base.mainColor,
  },
  selectedTopicTextStyle: {
    fontSize: em(15),
    color: THEME.base.mainColor,
    marginLeft: normalizeW(16),
    marginRight: normalizeW(16),
    alignSelf: 'center',
  },
  imageStyle: {
    marginRight: normalizeH(20),
    width: normalizeW(13),
    height: normalizeH(22),
  },
  titleContainerStyle: {
    flex: 1,
    paddingLeft: 0,
    paddingRight: 0,
    borderBottomWidth: 0,
  },
  titleInputStyle: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    color: '#5a5a5a',
    paddingLeft: normalizeW(10),
  },
  topicTypeTitleStyle: {
    fontSize: em(15),
    color: '#5a5a5a',
    paddingLeft: normalizeW(10),
    paddingRight: normalizeW(18),
    alignSelf: 'center',
  },
  //modal 所有子组件的样式
  modalStyle: {
    width: PAGE_WIDTH,
    backgroundColor: '#f5f5f5',
    height: PAGE_HEIGHT,
    alignItems: 'flex-start',
    paddingTop: normalizeH(20),
  },
  modalTextStyle: {
    marginTop: normalizeH(17),
    marginBottom: normalizeH(18),
    alignSelf: 'center',
    color: "#5a5a5a",
    fontSize: em(12)
  },
  modalTitleContainer: {
    height: 24,
    width: PAGE_WIDTH - 30,
    margin:15,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  modalTitleTxt: {
    color: "#4a4a4a",
    fontSize: em(12),
    lineHeight: 24,
  },
  modalTopicButtonStyle: {
    alignItems: 'flex-start',
    marginLeft: normalizeW(15),
    marginBottom: normalizeH(20)
  },
  modalTopicStyle: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#E9E9E9',
    height: normalizeH(41),
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderRadius: 5
  },
  ModalTopicTextStyle: {
    fontSize: em(17),
    color: "#5a5a5a",
    paddingLeft: normalizeW(16),
    paddingRight: normalizeW(16),
    justifyContent: 'center',
    alignItems: 'center',
  },

})