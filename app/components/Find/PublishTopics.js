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
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Symbol from 'es6-symbol'
import Header from '../common/Header'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import {publishTopicFormData, TOPIC_FORM_SUBMIT_TYPE} from '../../action/topicActions'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {getTopicCategories} from '../../selector/configSelector'
import CommonTextInput from '../common/Input/CommonTextInput'
import RichTextInput from '../common/Input/RichTextInput'
import ModalBox from 'react-native-modalbox';
import {Actions} from 'react-native-router-flux'
import * as Toast from '../common/Toast'
import {isUserLogined, activeUserInfo} from '../../selector/authSelector'
import ArticleEditor from '../common/Input/ArticleEditor'
import * as ImageUtil from '../../util/ImageUtil'
import TimerMixin from 'react-timer-mixin'


const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

let topicForm = Symbol('topicForm')
const topicName = {
  formKey: topicForm,
  stateKey: Symbol('topicName'),
  type: "topicName",
}

const topicContent = {
  formKey: topicForm,
  stateKey: Symbol('topicContent'),
  type: 'topicContent',
}

const rteHeight = {
  ...Platform.select({
    ios: {
      height: normalizeH(65 + 88),
    },
    android: {
      height: normalizeH(45 + 88)
    }
  })
}

class PublishTopics extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isDisabled: false,
      selectedTopic: undefined,
      rteFocused: false,    // 富文本获取到焦点
      shouldUploadImgComponent: false,
    };
    this.insertImages = []
    this.leanImgUrls = []
    this.isPublishing = false
  }

  submitSuccessCallback(context) {
    this.isPublishing = false
    Toast.show('恭喜您,发布成功!')
    Actions.pop()
  }

  submitErrorCallback(error) {
    Toast.show(error.message)
  }

  uploadImgComponentCallback(leanImgUrls) {
    this.leanImgUrls = leanImgUrls
    this.publishTopic()
  }

  onButtonPress = () => {
    if (this.props.isLogin) {
      if(this.state.selectedTopic) {
        if (this.insertImages && this.insertImages.length) {
          if (this.isPublishing) {
            return
          }
          this.isPublishing = true
          Toast.show('开始发布...', {
            duration: 1000,
            onHidden: ()=> {
              this.setState({
                shouldUploadImgComponent: true
              })
            }
          })
        } else {
          if (this.isPublishing) {
            return
          }
          this.isPublishing = true
          Toast.show('开始发布...', {
            duration: 1000,
            onHidden: ()=> {
              this.publishTopic()
            }
          })
        }
      }
      else{
        Toast.show("请选择一个话题")
      }
    }
    else {
      Actions.LOGIN()
    }
  }

  publishTopic() {
    this.props.publishTopicFormData({
      formKey: topicForm,
      images: this.leanImgUrls,
      categoryId: this.state.selectedTopic.objectId,
      userId: this.props.userInfo.id,
      submitType: TOPIC_FORM_SUBMIT_TYPE.PUBLISH_TOPICS,
      success: ()=> {
        this.submitSuccessCallback(this)
      },
      error: this.submitErrorCallback
    })
  }

  componentDidMount() {
    if (this.props.topicId && this.props.topicId.objectId) {
      this.setState({selectedTopic: this.props.topicId});
    }
  }

  openModal() {
    this.refs.modal3.open();
  }

  closeModal(value) {
    this.setState({selectedTopic: value})
    this.refs.modal3.close();
  }

  renderTopicsSelected() {
    if (this.props.topics) {
      return (
        this.props.topics.map((value, key)=> {
          if(value && value.objectId ) {
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
  }

  getRichTextImages(images) {
    this.insertImages = images
    // console.log('images list', this.insertImages)
  }

  renderRichText() {
    return (
      <ArticleEditor
        {...topicContent}
        wrapHeight={rteHeight.height}
        getImages={(images) => this.getRichTextImages(images)}
        shouldUploadImgComponent={this.state.shouldUploadImgComponent}
        uploadImgComponentCallback={(leanImgUrls)=>{this.uploadImgComponentCallback(leanImgUrls)}}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>

        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="发起话题"
          rightType="text"
          rightText="发布"
          rightPress={() => this.onButtonPress()}
        />

        <View style={styles.body}>

          <View style={styles.scrollViewStyle}>
            <TouchableOpacity style={styles.toSelectContainer} onPress={this.openModal.bind(this)}>
              {this.renderSelectedTopic()}
              <Image style={styles.imageStyle} source={require("../../assets/images/unfold_topic@2x.png")}/>
            </TouchableOpacity>
            <View>
              <CommonTextInput maxLength={36}
                               autoFocus={true}
                               containerStyle={styles.titleContainerStyle}
                               inputStyle={styles.titleInputStyle}
                               {...topicName}
                               placeholder="输入文章标题"/>
            </View>

            {this.renderRichText()}
          </View>

          <ModalBox style={styles.modalStyle} entry='top' position="top" ref={"modal3"}>
            <KeyboardAwareScrollView style={styles.scrollViewStyle}>
              <Text style={styles.modalShowTopicsStyle}>选择一个主题</Text>
              <View style={{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start'}}>
                {this.renderTopicsSelected()}
              </View>
            </KeyboardAwareScrollView>
          </ModalBox>

        </View>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const topics = getTopicCategories(state)
  const isLogin = isUserLogined(state)
  const userInfo = activeUserInfo(state)
  return {
    topics: topics,
    isLogin: isLogin,
    userInfo: userInfo
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  publishTopicFormData
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PublishTopics)

Object.assign(PublishTopics.prototype, TimerMixin)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  body: {
    ...Platform.select({
      ios: {
        marginTop: normalizeH(64),
      },
      android: {
        marginTop: normalizeH(44)
      }
    }),
    height: PAGE_HEIGHT,
    width: PAGE_WIDTH
  },

  //选择话题的对话框的样式
  toSelectContainer: {
    height: normalizeH(44),
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: "#E6E6E6"
  },
  selectedTopicStyle: {
    marginTop: normalizeH(5),
    marginLeft: normalizeW(12),
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: '#50e3c2',
    height: normalizeH(34),
    alignItems: 'flex-start',
    borderRadius: 100,
    borderColor: 'transparent',
  },
  selectedTopicTextStyle: {
    fontSize: em(15),
    color: "#ffffff",
    marginLeft: normalizeW(16),
    marginRight: normalizeW(16),
    marginTop: normalizeH(7),
    alignSelf: 'center',
  },
  imageStyle: {
    position: 'absolute',
    right: normalizeW(12),
    marginTop: normalizeH(10),
    width: normalizeW(24),
    height: normalizeH(24),
    alignSelf: 'flex-end',
  },
  titleContainerStyle: {
    flex: 1,
    height: normalizeH(44),
    paddingLeft: 0,
    paddingRight: 0,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#E9E9E9',
  },
  titleInputStyle: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    color: '#4a4a4a',
    fontFamily: 'PingFangSC-Semibold'
  },
  //modal 所有子组件的样式
  modalStyle: {
    width: PAGE_WIDTH,
    backgroundColor: '#f2f2f2',
    height: normalizeH(250),
    alignItems: 'flex-start',
    // ...Platform.select({
    //   ios: {
    //     paddingTop: normalizeH(65),
    //   },
    //   android: {
    //     paddingTop: normalizeH(45)
    //   }
    // }),
  },
  modalTextStyle: {
    marginTop: normalizeH(17),
    marginBottom: normalizeH(18),
    alignSelf: 'center',
    color: "#4a4a4a",
    fontSize: em(12)
  },
  modalShowTopicsStyle: {
    marginTop: normalizeH(17),
    marginBottom: normalizeH(18),
    alignSelf: 'center',
    color: "#4a4a4a",
    fontSize: em(12)
  },
  modalTopicButtonStyle: {
    alignItems: 'flex-start',
    marginLeft: normalizeW(5),
    marginRight: normalizeW(5),
    marginBottom: normalizeH(20)
  },
  modalTopicStyle: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#E9E9E9',
    height: normalizeH(34),
    alignItems: 'flex-start',
    borderRadius: 100
  },
  ModalTopicTextStyle: {
    fontSize: em(15),
    color: "#4a4a4a",
    marginLeft: normalizeW(16),
    marginRight: normalizeW(16),
    marginTop: normalizeH(7),
    alignSelf: 'center',
  },

})