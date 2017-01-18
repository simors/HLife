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
  InteractionManager,
  ScrollView
} from 'react-native'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import TopicComment from './TopicComment'
import TopicContent from './TopicContent'
import Comment from '../common/Comment'
import {publishTopicFormData, TOPIC_FORM_SUBMIT_TYPE} from '../../action/topicActions'
import {isUserLogined, activeUserInfo} from '../../selector/authSelector'
import {getTopicLikedTotalCount,getTopicComments, isTopicLiked,getTopicLikeUsers} from '../../selector/topicSelector'
import {fetchTopicLikesCount, fetchTopicIsLiked, likeTopic, unLikeTopic,fetchTopicLikeUsers} from '../../action/topicActions'

import * as Toast from '../common/Toast'
import {fetchTopicCommentsByTopicId} from '../../action/topicActions'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export class TopicDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      commentY: 0,
      comment: undefined
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchTopicCommentsByTopicId({topicId: this.props.topic.objectId, upType: 'topic'})
      this.props.fetchTopicLikesCount({topicId: this.props.topic.objectId, upType: 'topic'})
      this.props.fetchTopicLikeUsers({topicId: this.props.topic.objectId})
      if( this.props.isLogin ){
        this.props.fetchTopicIsLiked({topicId: this.props.topic.objectId, upType: 'topic'})
      }
    })
  }

  onRightPress = () => {
  }

  submitSuccessCallback() {
    Toast.show('评论成功')
    this.props.fetchTopicCommentsByTopicId({topicId: this.props.topic.objectId, upType: 'topic'})
    this.closeModal(()=> {
      Toast.show('发布成功', {duration: 1000})
    })
  }

  submitErrorCallback(error) {
    Toast.show(error.message)
  }

  openModel(callback) {
    this.setState({
      modalVisible: true
    })
    if (callback && typeof callback == 'function') {
      callback()
    }
  }

  closeModal(callback) {
    this.setState({
      modalVisible: false,
      comment: undefined
    })
    if (callback && typeof callback == 'function') {
      callback()
    }
  }

  submitComment(commentData) {
    if (!this.props.isLogin) {
      Actions.LOGIN()
    }
    else {
      this.props.publishTopicFormData({
        ...commentData,
        topicId: this.props.topic.objectId,
        userId: this.props.userInfo.id,
        replyTo: (this.state.comment)?this.state.comment.userId:this.props.topic.userId,
        commentId: (this.state.comment) ? this.state.comment.objectId : undefined,
        submitType: TOPIC_FORM_SUBMIT_TYPE.PUBLISH_TOPICS_COMMENT,
        success: this.submitSuccessCallback.bind(this),
        error: this.submitErrorCallback
      })
    }
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

  onCommentButton(topic) {
    this.setState({
      comment: topic
    })
    this.openModel()
  }

  renderTopicCommentItem(value, key) {
    return (
      <TopicComment key={key}
                    topic={value}
                    onCommentButton={this.onCommentButton.bind(this)}
                    onLikeCommentButton={(payload)=>this.onLikeCommentButton(payload)}
      />
    )
  }

  renderNoComment() {
    if (this.props.commentsTotalCount == 0) {
      return (
        <Text style={{alignSelf: 'center', paddingTop: 20}}>
          目前没有评论，快来抢沙发吧！~~~
        </Text>
      )
    }
  }

  measureMyComponent(event) {
    this.setState({commentY: (event.nativeEvent.layout.height + event.nativeEvent.layout.y)})
  }

  scrollToComment() {
    this.refs.scrollView.scrollTo(this.state.commentY)
  }

  onLikeButton() {
    if(this.props.isLogin) {
      if (this.props.isLiked) {
        this.props.unLikeTopic({
          topicId: this.props.topic.objectId,
          upType: 'topic',
          success: this.likeSuccessCallback.bind(this),
          error: this.likeErrorCallback
        })
      }
      else {
        this.props.likeTopic({
          topicId: this.props.topic.objectId,
          upType: 'topic',
          success: this.likeSuccessCallback.bind(this),
          error: this.likeErrorCallback
        })
      }
    }
    else{
      Actions.LOGIN()
    }
  }

  onLikeCommentButton(payload) {
    if (payload.isLiked) {
      this.props.unLikeTopic({
        topicId: payload.topic.objectId,
        upType: 'topicComment',
        success: payload.success,
        error: this.likeErrorCallback
      })
    }
    else {
      this.props.likeTopic({
        topicId: payload.topic.objectId,
        upType: 'topicComment',
        success: payload.success,
        error: this.likeErrorCallback
      })
    }
  }

  likeErrorCallback(error) {
    Toast.show(error.message)
  }

  likeSuccessCallback() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchTopicIsLiked({topicId: this.props.topic.objectId, upType: 'topic'})
      this.props.fetchTopicLikesCount({topicId: this.props.topic.objectId, upType: 'topic'})
      this.props.fetchTopicLikeUsers({topicId: this.props.topic.objectId})
    })
  }

  renderTopicLikeOneUser(value, key) {
    return (
        <TouchableOpacity style={{alignSelf: 'center'}}>
          <Image style={styles.zanAvatarStyle} source={value.avatar ? {uri: value.avatar} : require("../../assets/images/default_portrait@2x.png")}/>
        </TouchableOpacity>
    )
  }

  renderTopicLikeUsers() {
    if (this.props.topicLikeUsers) {
      return (
        this.props.topicLikeUsers.map((value, key)=> {
          if(key < 6) {
            return (
              this.renderTopicLikeOneUser(value, key)
            )
          }
        })
      )
    }
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
        <View style={styles.body} >
          <ScrollView style={{}} ref={"scrollView"}>
            <TopicContent topic={this.props.topic}/>
            <TouchableOpacity style={styles.likeStyle}
                              onLayout={this.measureMyComponent.bind(this)}
                              onPress={()=>Actions.LIKE_USER_LIST({topicLikeUsers:this.props.topicLikeUsers})}>
              <View style={styles.zanStyle}>
                <Text style={styles.zanTextStyle}>
                  赞
                </Text>
              </View>
              {this.renderTopicLikeUsers()}
              <View style={styles.zanStyle}>
                <Text style={styles.zanTextStyle}>
                  {this.props.likesCount}
                </Text>
              </View>
            </TouchableOpacity>
            {this.renderTopicCommentPage()}
            {this.renderNoComment()}
          </ScrollView>

          <View style={styles.shopCommentWrap}>
            <TouchableOpacity style={styles.shopCommentInputBox} onPress={this.openModel.bind(this)}>
              <Text style={styles.shopCommentInput}>写评论...</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.commentBtnWrap} onPress={this.scrollToComment.bind(this)}>
              <Image style={{}} source={require('../../assets/images/artical_comments_unselect.png')}/>
              <View style={styles.commentBtnBadge}>
                <Text style={styles.commentBtnBadgeTxt}>
                  {this.props.commentsTotalCount > 99 ? '99+' : this.props.commentsTotalCount}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shopUpWrap} onPress={this.onLikeButton.bind(this)}>
              <Image style={{}} source={this.props.isLiked ?
                require("../../assets/images/like_select.png") :
                require("../../assets/images/like_unselect.png")}/>
            </TouchableOpacity>
          </View>
          <Comment
            showModules={["content"]}
            modalVisible={this.state.modalVisible}
            modalTitle="写评论"
            textAreaPlaceholder={(this.state.comment) ? "回复 " + this.state.comment.nickname + ": " : "回复 楼主: "}
            closeModal={() => this.closeModal()}
            submitComment={this.submitComment.bind(this)}
          />
        </View>
      </View>
    )
  }
}

TopicDetail.defaultProps = {}

const mapStateToProps = (state, ownProps) => {
  const isLogin = isUserLogined(state)
  const userInfo = activeUserInfo(state)
  const topicComments = getTopicComments(state)
  const likesCount = getTopicLikedTotalCount(state, ownProps.topic.objectId)
  const topicLikeUsers = getTopicLikeUsers(state, ownProps.topic.objectId)
  const isLiked = isTopicLiked(state, ownProps.topic.objectId)
  const commentsTotalCount = topicComments ? topicComments.length : undefined
  return {
    topicComments: topicComments,
    topicLikeUsers:topicLikeUsers,
    likesCount:likesCount,
    isLogin: isLogin,
    isLiked: isLiked,
    userInfo: userInfo,
    commentsTotalCount: commentsTotalCount
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchTopicCommentsByTopicId,
  publishTopicFormData,
  fetchTopicIsLiked,
  fetchTopicLikeUsers,
  fetchTopicLikesCount,
  likeTopic,
  unLikeTopic
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
    borderColor: 'transparent',
    height: normalizeH(35),
    alignSelf: 'center',
    borderRadius: 100,
    marginLeft: normalizeW(12),
    width: normalizeW(35),
  },
  zanAvatarStyle: {
    borderColor: 'transparent',
    height: normalizeH(35),
    alignSelf: 'center',
    borderRadius: 17.5,
    marginLeft: normalizeW(10),
    width: normalizeW(35),
  },
  zanTextStyle: {
    fontSize: em(17),
    color: "#ffffff",
    marginTop: normalizeH(7),
    alignSelf: 'center',
  },


  shopCommentWrap: {
    height: 50,
    paddingLeft: 10,
    borderTopWidth: normalizeBorder(),
    borderTopColor: THEME.colors.lighterA,
    backgroundColor: 'rgba(0,0,0,0.005)',
    flexDirection: 'row',
    alignItems: 'center'
  },
  shopCommentInputBox: {
    flex: 1,
    marginRight: 10,
    padding: 6,
    borderWidth: normalizeBorder(),
    borderColor: THEME.colors.lighterA,
    borderRadius: 10,
    backgroundColor: '#fff'
  },
  shopCommentInput: {
    fontSize: em(17),
    color: '#8f8e94'
  },
  commentBtnWrap: {
    width: 60,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center'
  },
  commentBtnBadge: {
    alignItems: 'center',
    width: 30,
    backgroundColor: '#f5a623',
    position: 'absolute',
    right: 0,
    top: 0,
    borderRadius: 10,
    borderWidth: normalizeBorder(),
    borderColor: '#f5a623'
  },
  commentBtnBadgeTxt: {
    fontSize: 9,
    color: '#fff'
  },
  shopUpWrap: {
    width: 60,
    alignItems: 'center'
  },
})