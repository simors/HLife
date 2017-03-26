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
  ScrollView,
  StatusBar
} from 'react-native'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import TopicComment from './TopicComment'
import dismissKeyboard from 'react-native-dismiss-keyboard'
import TopicContent from './TopicContent'
import KeyboardAwareToolBar from '../common/KeyboardAwareToolBar'
import ToolBarContent from '../shop/ShopCommentReply/ToolBarContent'
import {publishTopicFormData, TOPIC_FORM_SUBMIT_TYPE} from '../../action/topicActions'
import {isUserLogined, activeUserInfo} from '../../selector/authSelector'
import {getTopicLikedTotalCount, getTopicComments, isTopicLiked, getTopicLikeUsers} from '../../selector/topicSelector'
import {
  fetchTopicLikesCount,
  fetchTopicIsLiked,
  likeTopic,
  unLikeTopic,
  fetchTopicLikeUsers
} from '../../action/topicActions'
import ActionSheet from 'react-native-actionsheet'


import * as Toast from '../common/Toast'
import {fetchTopicCommentsByTopicId} from '../../action/topicActions'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export class TopicDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      commentY: 0,
      comment: undefined
    }
    this.replyInput = null
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchTopicCommentsByTopicId({topicId: this.props.topic.objectId, upType: 'topic'})
      this.props.fetchTopicLikesCount({topicId: this.props.topic.objectId, upType: 'topic'})
      this.props.fetchTopicLikeUsers({topicId: this.props.topic.objectId})
      if (this.props.isLogin) {
        this.props.fetchTopicIsLiked({topicId: this.props.topic.objectId, upType: 'topic'})
      }
    })
  }

  onRightPress = () => {
    this.ActionSheet.show()
  }

  submitSuccessCallback() {
    dismissKeyboard()
    Toast.show('评论成功', {duration: 1000})
  }

  submitErrorCallback(error) {
    Toast.show(error.message)
  }

  openModel(callback) {
    if (!this.props.isLogin) {
      Actions.LOGIN()
    }
    else {
      if (this.replyInput) {
        this.replyInput.focus()
      }
      if (callback && typeof callback == 'function') {
        callback()
      }
    }
  }

  sendReply(content) {
    if (!this.props.isLogin) {
      Actions.LOGIN()
    }
    else {
      this.props.publishTopicFormData({
        content: content,
        topicId: this.props.topic.objectId,
        userId: this.props.userInfo.id,
        replyTo: (this.state.comment) ? this.state.comment.userId : this.props.topic.userId,
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
    if (this.props.isLogin) {
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
    else {
      Actions.LOGIN()
    }
  }

  onLikeCommentButton(payload) {
    if (this.props.isLogin) {
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
    else {
      Actions.LOGIN()
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
      <TouchableOpacity key={key} style={{alignSelf: 'center'}}>
        <Image style={styles.zanAvatarStyle}
               source={value.avatar ? {uri: value.avatar} : require("../../assets/images/default_portrait.png")}/>
      </TouchableOpacity>
    )
  }

  renderTopicLikeUsers() {
    if (this.props.topicLikeUsers) {
      return (
        this.props.topicLikeUsers.map((value, key)=> {
          if (key < 6) {
            return (
              this.renderTopicLikeOneUser(value, key)
            )
          }
        })
      )
    }
  }
  _handleActionSheetPress(index) {
    if(0 == index) { //编辑
      Actions.TOPIC_EDIT({topic: this.props.topic})
    }
  }

  renderActionSheet() {
    return (
      <ActionSheet
        ref={(o) => this.ActionSheet = o}
        title=""
        options={['编辑', '取消']}
        cancelButtonIndex={1}
        onPress={this._handleActionSheetPress.bind(this)}
      />
    )
  }

  renderMoreBtn() {
    return (
      <TouchableOpacity style={styles.moreBtnStyle}
                        onPress={() => {this.onRightPress()}}>
        <Image style={{width: normalizeW(25), height: normalizeH(6)}} resizeMode="contain"
               source={require('../../assets/images/more.png')}/>
      </TouchableOpacity>
    )
  }

  renderHeaderView() {
    if (this.props.topic && this.props.topic.userId == this.props.userInfo.id) {
      return (
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="详情"
          rightComponent={() => {return this.renderMoreBtn()}}
        />
      )
    }
    return (
      <Header
        leftType="icon"
        leftIconName="ios-arrow-back"
        leftPress={() => Actions.pop()}
        title="详情"
      />
    )
  }

  render() {
    return (
      <View style={styles.containerStyle}>
        <StatusBar barStyle="dark-content"/>
        {this.renderHeaderView()}
        <View style={styles.body}>
          <ScrollView style={{}} ref={"scrollView"}>
            <TopicContent topic={this.props.topic}/>
            <TouchableOpacity style={styles.likeStyle}
                              onLayout={this.measureMyComponent.bind(this)}
                              onPress={()=>Actions.LIKE_USER_LIST({topicLikeUsers: this.props.topicLikeUsers})}>
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
          <KeyboardAwareToolBar
            initKeyboardHeight={-normalizeH(50)}
          >
            <ToolBarContent
              replyInputRefCallBack={(input)=> {
                this.replyInput = input
              }}
              onSend={(content) => {
                this.sendReply(content)
              }}
              placeholder={(this.state.comment) ? "回复 " + this.state.comment.nickname + ": " : "回复 楼主: "}
            />
          </KeyboardAwareToolBar>
          {this.renderActionSheet()}
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
  const commentsTotalCount = topicComments[ownProps.topic.objectId] ? topicComments[ownProps.topic.objectId].length : undefined
  return {
    topicComments: topicComments[ownProps.topic.objectId],
    topicLikeUsers: topicLikeUsers,
    likesCount: likesCount,
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
    flex: 1,
    backgroundColor: '#E5E5E5',
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
    fontSize: em(9),
    color: '#fff'
  },
  shopUpWrap: {
    width: 60,
    alignItems: 'center'
  },
  moreBtnStyle: {
    width: normalizeW(40),
    height: normalizeH(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalizeW(15)
  },
})