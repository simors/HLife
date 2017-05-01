/**
 * Created by lilu on 2017/4/8.
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
import {publishAdviseFormData} from '../../action/adviseAction'
import {getTopicCategories} from '../../selector/configSelector'
import CommonTextInput from '../common/Input/CommonTextInput'
import ModalBox from 'react-native-modalbox';
import {Actions} from 'react-native-router-flux'
import * as Toast from '../common/Toast'
import {isUserLogined, activeUserInfo} from '../../selector/authSelector'
import ArticleEditor from '../common/Input/ArticleEditor'
import TimerMixin from 'react-timer-mixin'
import THEME from '../../constants/themes/theme1'


const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

let adviseForm = Symbol('adviseForm')


const adviseContent = {
  formKey: adviseForm,
  stateKey: Symbol('adviseContent'),
  type: 'adviseContent',
}

const rteHeight = {
  height: normalizeH(64),
}

const wrapHeight = normalizeH(118)

class AdviseFeedback extends Component {
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
  }

  submitSuccessCallback(context) {
    this.isPublishing = false
    // Toast.show('恭喜您,发布成功!')
    Actions.SUBMIT_ADVISE_SUCCESS({type: 'reset'})
  }

  submitErrorCallback(error) {
    this.isPublishing = false
    Toast.show(error.message)
  }


  onButtonPress = () => {
    // console.log('hahahahahahahha')

    if (this.props.isLogin) {
        if (this.isPublishing) {
          return
        }
      console.log('hahahahahahahha>>>>>>>>>>>>>>>')

      this.isPublishing = true
        Toast.show('开始发布...', {
          duration: 1000,
          onHidden: ()=> {
            this.publishAdvise()
          }
        })
      // this.publishAdvise()
    }
    else {
      Actions.LOGIN()
    }
  }

  publishAdvise() {
    console.log('>>>>>>>>>>>>>>>>>hahahahahahahha')

    this.props.publishAdviseFormData({
      formKey: adviseForm,
      images: this.insertImages,
      // categoryId: this.state.selectedTopic.objectId,
      userId: this.props.userInfo.id,
      //submitType: TOPIC_FORM_SUBMIT_TYPE.PUBLISH_TOPICS,
      success: ()=> {
        this.submitSuccessCallback(this)
      },
      error: this.submitErrorCallback
    })
  }

  componentDidMount() {

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
        {...adviseContent}
        wrapHeight={this.state.extraHeight}
        renderCustomToolbar={() => {return this.renderArticleEditorToolbar()}}
        getImages={(images) => this.getRichTextImages(images)}
        onFocusEditor={() => {this.setState({headerHeight: 0})}}
        onBlurEditor={() => {this.setState({headerHeight: wrapHeight})}}
        placeholder="请详细描述使用中遇到的问题，并附上问题截图。诚挚邀请您加入用户体验俱乐部QQ群：312458688"
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
          title="意见反馈"
          rightType="text"
          rightText="发布"
          rightPress={() => this.onButtonPress()}
        />

        <View style={styles.body}>

          <View>
            {this.renderRichText()}
          </View>


        </View>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  // const topics = getTopicCategories(state)
  const isLogin = isUserLogined(state)
  const userInfo = activeUserInfo(state)
  return {
    // topics: topics,
    isLogin: isLogin,
    userInfo: userInfo
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  publishAdviseFormData
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(AdviseFeedback)

Object.assign(AdviseFeedback.prototype, TimerMixin)

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
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#F5F5F5',
  },
  titleInputStyle: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    color: '#5a5a5a',
  },
  titleCleanBtnStyle: {
    position: 'absolute',
    right: normalizeW(25),
    top: normalizeH(17),
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
  },
  modalTextStyle: {
    marginTop: normalizeH(17),
    marginBottom: normalizeH(18),
    alignSelf: 'center',
    color: "#5a5a5a",
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