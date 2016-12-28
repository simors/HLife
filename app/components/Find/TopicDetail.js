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
  InteractionManager
} from 'react-native'
import {em, normalizeW, normalizeH} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {TopicShow} from './TopicShow'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {TopicComment} from './TopicComment'
import CommentInput from '../common/Input/CommentInput'
import {publishTopicFormData, TOPIC_FORM_SUBMIT_TYPE} from '../../action/topicActions'
import {isUserLogined, activeUserInfo} from '../../selector/authSelector'
import {getTopicComments} from '../../selector/topicSelector'

import * as Toast from '../common/Toast'
import {fetchTopicCommentsByTopicId} from '../../action/topicActions'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

let formKey = Symbol('commentForm')
const commentInput = {
  formKey: formKey,
  stateKey: Symbol('commentInput'),
  type: 'comment'
}

export class TopicDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  onButtonPress = () => {
    if (this.props.isLogin) {
      this.props.publishTopicFormData({
        formKey: formKey,
        topicId: this.props.topic.objectId,
        userId: this.props.userInfo.id,
        commentId: (this.props.comment)?this.props.comment.id:undefined,
        submitType: TOPIC_FORM_SUBMIT_TYPE.PUBLISH_TOPICS_COMMENT,
        success: this.submitSuccessCallback.bind(this),
        error: this.submitErrorCallback
      })
    }
    else {
      Actions.LOGIN()
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchTopicCommentsByTopicId({topicId: this.props.topic.objectId})
    })
  }

  onRightPress = () => {
  }

  submitSuccessCallback() {
    Toast.show('评论成功')
    this.props.fetchTopicCommentsByTopicId({topicId: this.props.topic.objectId})
  }

  submitErrorCallback(error) {
    Toast.show(error.message)
  }

  renderTopicCommentPage() {
    if (this.props.topicComments) {
      return (
        this.props.topicComments.map((value, key)=> {
          return (
            this.renderTopicCommentItem(value, key)
          )
        })
      )
    }
  }

  renderTopicCommentItem(value, key) {
    return (
      <TopicComment key={key}
                    topic={value}
                    hasParentComment={(value.parentComment)?true:false}
      />
    )
  }

  render() {
    return (
      <View style={styles.containerStyle}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="详情"
          rightType="text"
          rightText="..."
          rightPress={() => this.onRightPress()}
        />

        <KeyboardAwareScrollView style={styles.body}>
          <TopicShow topic={this.props.topic}
                     numberOfValues={null}
                     showCommentAndLikeButton={false}/>
          <View style={styles.likeStyle}>
            <View style={styles.zanStyle}>
              <Text style={styles.zanTextStyle}>
                赞
              </Text>
            </View>
          </View>
          {this.renderTopicCommentPage()}

        </KeyboardAwareScrollView>
        <CommentInput  {...commentInput} onPublishButton={()=>this.onButtonPress()}/>
      </View>
    )
  }
}

TopicDetail.defaultProps = {}

const mapStateToProps = (state, ownProps) => {
  const isLogin = isUserLogined(state)
  const userInfo = activeUserInfo(state)
  const topicComments = getTopicComments(state)
  return {
    topicComments:topicComments,
    isLogin: isLogin,
    userInfo: userInfo
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchTopicCommentsByTopicId,
  publishTopicFormData
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(TopicDetail)

//export
const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    justifyContent: 'flex-start',
  },

  body: {
    ...Platform.select({
      ios: {
        paddingTop: normalizeH(65),
      },
      android: {
        paddingTop: normalizeH(45)
      }
    }),
    flex: 1,
    backgroundColor: '#E5E5E5',
    width: PAGE_WIDTH
  },

  likeStyle: {
    backgroundColor: '#E5E5E5',
    height: normalizeH(59),
    alignItems: 'flex-start',
    flexDirection: 'row',
  },

  zanStyle: {
    backgroundColor: THEME.colors.green,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'transparent',
    height: normalizeH(35),
    alignSelf: 'center',
    borderRadius: 100,
    marginLeft: normalizeW(12),
    width: normalizeW(35),
  },
  zanTextStyle: {
    fontSize: em(17),
    color: "#ffffff",
    marginTop: normalizeH(7),
    alignSelf: 'center',
  },
})