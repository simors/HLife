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
  StatusBar,
  Keyboard,
  BackAndroid,
  ListView,
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
import {fetchOtherUserFollowersTotalCount} from '../../action/authActions'
import {publishTopicFormData, TOPIC_FORM_SUBMIT_TYPE} from '../../action/topicActions'
import {isUserLogined, activeUserInfo} from '../../selector/authSelector'
import * as authSelector from '../../selector/authSelector'
import Icon from 'react-native-vector-icons/Ionicons'
import {getTopicLikedTotalCount, getTopicComments, isTopicLiked, getTopicLikeUsers} from '../../selector/topicSelector'
import {
  fetchTopicLikesCount,
  fetchTopicIsLiked,
  likeTopic,
  unLikeTopic,
  fetchTopicLikeUsers
} from '../../action/topicActions'
import ActionSheet from 'react-native-actionsheet'
import CommonListView from '../common/CommonListView'


import * as Toast from '../common/Toast'
import {fetchTopicCommentsByTopicId} from '../../action/topicActions'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export class TopicDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      commentY: 0,
      comment: undefined,
      hideBottomView: false,
    }
    this.replyInput = null
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.refreshData()
      this.props.fetchTopicLikesCount({topicId: this.props.topic.objectId, upType: 'topic'})
      this.props.fetchTopicLikeUsers({topicId: this.props.topic.objectId})
      if (this.props.isLogin) {
        this.props.fetchTopicIsLiked({topicId: this.props.topic.objectId, upType: 'topic'})
      }

      if(this.props.topic && this.props.topic.userId) {
        this.props.fetchOtherUserFollowersTotalCount({userId: this.props.topic.userId})
      }
    })

    if (Platform.OS == 'ios') {
      Keyboard.addListener('keyboardWillShow', this.onKeyboardWillShow)
      Keyboard.addListener('keyboardWillHide', this.onKeyboardWillHide)
    } else {
      Keyboard.addListener('keyboardDidShow', this.onKeyboardDidShow)
      Keyboard.addListener('keyboardDidHide', this.onKeyboardDidHide)

    }
  }
  componentWillUnmount(){
    // console.log('unmount component')

    if (Platform.OS == 'ios') {
      Keyboard.removeListener('keyboardWillShow', this.onKeyboardWillShow)
      Keyboard.removeListener('keyboardWillHide', this.onKeyboardWillHide)
    } else {
      Keyboard.removeListener('keyboardDidShow', this.onKeyboardDidShow)
      Keyboard.removeListener('keyboardDidHide', this.onKeyboardDidHide)

    }
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
      this.setState({
        hideBottomView: true
      }, ()=>{
        // console.log('openModel===', this.replyInput)
        if (this.replyInput) {
          this.replyInput.focus()
        }
        if (callback && typeof callback == 'function') {
          callback()
        }
      })
      
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
    let commentsView = <View/>
    let topicComments = this.props.topicComments
    let commentsTotalCount = this.props.commentsTotalCount
    if (commentsTotalCount && topicComments && topicComments.length) {
      commentsView = topicComments.map((value, key)=> {
            return (
              this.renderTopicCommentItem(value, key)
            )
          })
    }else {
      commentsView = <View style={{padding:15,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                      <Text style={{}}>
                        目前没有评论，快来抢沙发吧！~~~
                      </Text>
                    </View>
    }

    return (
      <View style={{flex:1}}>
        <View style={{flexDirection: 'row',padding:15,paddingTop:20,backgroundColor:'white'}}>
          <View style={styles.titleLine}/>
          <Text style={styles.titleTxt}>邻友点评·{commentsTotalCount > 999 ? '999+' : commentsTotalCount}</Text>
        </View>
        <View style={{flex:1}}>
          {commentsView}
        </View>
      </View>
    )
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
        <View style={{padding:15,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
          <Text style={{}}>
            目前没有评论，快来抢沙发吧！~~~
          </Text>
        </View>
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

  isSelfTopic() {
    if(this.props.topic && this.props.userInfo && this.props.topic.userId == this.props.userInfo.id) {
      return true
    }
    return false
  }

  renderHeaderView() {
    // if (this.props.topic && this.props.topic.userId == this.props.userInfo.id) {
    //   return (
    //     <Header
    //       leftType="icon"
    //       leftIconName="ios-arrow-back"
    //       leftPress={() => Actions.pop()}
    //       title="详情"
    //       rightComponent={() => {return this.renderMoreBtn()}}
    //     />
    //   )
    // }
    return (
      <Header
        leftType="icon"
        leftIconName="ios-arrow-back"
        leftPress={() => Actions.pop()}
        title="详情"
      />
    )
  }

  renderTopicLikeUsersView() {
    let topicLikeUsers = this.props.topicLikeUsers
    let likesCount = this.props.likesCount
    // likesCount = 5
    // topicLikeUsers = [{},{},{},{},{}]
    // console.log('likesCount====', likesCount)
    // console.log('topicLikeUsers====', topicLikeUsers)
    if(likesCount && topicLikeUsers && topicLikeUsers.length) {
      let topicLikeUsersView = topicLikeUsers.map((item, index)=>{
        if(index > 2) {
          return null
        }
        let source = require('../../assets/images/default_portrait.png')
        if(item.avatar) {
          source = {uri: item.avatar}
        }

        return (
          <Image
            key={'topick_like_' + index}
            style={{width:20,height:20,marginRight:5,borderRadius:10}}
            source={source}
          />
        )
      })
      return (
        <View style={{flexDirection:'row',alignItems:'center'}}>
          {topicLikeUsersView}
          <Icon
            name="ios-arrow-forward"
            style={{marginLeft:6,color:'#f5f5f5',fontSize:17}}/>
        </View>
      )
    }
    return (
      <Text style={{color:'#8f8e94'}}>暂无点赞!</Text>
    )
  }

  onKeyboardWillShow = (e) => {
    // this.setState({
    //   hideBottomView: true
    // })
  }

  onKeyboardWillHide = (e) => {
    // console.log('onKeyboardWillHide')
    this.setState({
      hideBottomView: false
    })
  }

  onKeyboardDidShow = (e) => {
    if (Platform.OS === 'android') {
      this.onKeyboardWillShow(e)
    }
  }

  onKeyboardDidHide = (e) => {
    if (Platform.OS === 'android') {
      this.onKeyboardWillHide(e)
    }
  }

  renderRow(rowData, rowId) {
    switch (rowData.type) {
      case 'COLUMN_1':
        return this.renderTopicContentColumn()
      case 'COLUMN_2':
        return this.renderTopicCommentsColumn()
      default:
        return <View />
    }
  }

  renderTopicContentColumn() {
    return (
      <View style={{flex:1}}>
        <TopicContent 
          topic={this.props.topic}
          userFollowersTotalCount={this.props.userFollowersTotalCount}
          isSelfTopic={this.isSelfTopic()}
        />
        <TouchableOpacity style={styles.likeStyle}
                          onLayout={this.measureMyComponent.bind(this)}
                          onPress={()=>Actions.LIKE_USER_LIST({topicLikeUsers: this.props.topicLikeUsers})}>
          <View style={styles.topicLikesWrap}>
            <View style={{flexDirection:'row'}}>
              <View style={styles.titleLine}/>
              <Text style={styles.titleTxt}>点赞·{this.props.likesCount}</Text>
            </View>
            <View style={{flexDirection:'row'}}>
              {this.renderTopicLikeUsersView()}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  renderTopicCommentsColumn() {
    return (
      <View style={{flex:1}}>
        {this.renderTopicCommentPage()}
      </View>
    )
  }

  refreshData() {
    this.loadMoreData(true)
  }

  loadMoreData(isRefresh) {
    if(this.isQuering) {
      return
    }
    this.isQuering = true

    let topic = this.props.topic
    let lastTopicCommentsCreatedAt = this.props.lastTopicCommentsCreatedAt
    // console.log('lastTopicCommentsCreatedAt------>', lastTopicCommentsCreatedAt)

    let payload = {
      topicId: topic.objectId,
      isRefresh: !!isRefresh,
      lastCreatedAt: lastTopicCommentsCreatedAt,
      upType: 'topic',
      success: (isEmpty) => {
        this.isQuering = false
        if(!this.listView) {
          return
        }
        if(isEmpty) {
          this.listView.isLoadUp(false)
        }else {
          this.listView.isLoadUp(true)
        }
      },
      error: (err)=>{
        this.isQuering = false
        Toast.show(err.message, {duration: 1000})
      }
    }

    this.props.fetchTopicCommentsByTopicId(payload)
  }

  render() {
    return (
      <View style={styles.containerStyle}>
        <StatusBar barStyle="dark-content"/>
        {this.renderHeaderView()}
        <View style={styles.body}>

          <CommonListView
            contentContainerStyle={{backgroundColor: '#F5F5F5'}}
            dataSource={this.props.ds}
            renderRow={(rowData, rowId) => this.renderRow(rowData, rowId)}
            loadNewData={()=> {
              this.refreshData()
            }}
            loadMoreData={()=> {
              this.loadMoreData()
            }}
            ref={(listView) => this.listView = listView}
          />  

          {this.state.hideBottomView
            ? null
            : this.renderBottomView()
          }
        </View>

        {this.state.hideBottomView
          ? <TouchableOpacity style={{position:'absolute',left:0,right:0,bottom:0,top:0,backgroundColor:'rgba(0,0,0,0.5)'}} onPress={()=>{dismissKeyboard()}}>
              <View style={{flex: 1}}/>
            </TouchableOpacity>
          : null
        }

        <KeyboardAwareToolBar
          initKeyboardHeight={-normalizeH(50)}
          hideOverlay={true}
        >
          {this.state.hideBottomView
            ? <ToolBarContent
                replyInputRefCallBack={(input)=> {
                  this.replyInput = input
                }}
                onSend={(content) => {
                  this.sendReply(content)
                }}
                placeholder={(this.state.comment) ? "回复 " + this.state.comment.nickname + ": " : "回复 楼主: "}
              />
            : null
          }
        </KeyboardAwareToolBar>

        {this.renderActionSheet()}
      </View>
    )
  }

  renderBottomView() {
    if(this.isSelfTopic()) {
      return (
        <TouchableOpacity 
          style={{
            position:'absolute',bottom:0,left:0,right:0,
            height:50,
            borderTopWidth: normalizeBorder(),
            borderTopColor: THEME.colors.lighterA,
            backgroundColor: '#f5f5f5',
            justifyContent: 'center',
            alignItems:'center',
            flexDirection:'row'
          }}
          onPress={()=>{Actions.TOPIC_EDIT({topic: this.props.topic})}}
        >
          <Image style={{marginRight:10}} source={require('../../assets/images/shop_edite.png')}/>
          <Text style={{color:'#ff7819',fontSize:17}}>编辑话题</Text>
        </TouchableOpacity>
      )
    }else {
      let isLiked = this.props.isLiked
      let likeImgSource = require("../../assets/images/like_unselect_main.png")
      if(isLiked) {
        likeImgSource = require("../../assets/images/like_selected.png")
      }

      return (
        <View style={[styles.shopCommentWrap, {position:'absolute',bottom:0,left:0,right:0}]}>
          <TouchableOpacity style={[styles.shopCommentInputBox]} onPress={()=>{this.onLikeButton()}}>
            <View style={[styles.vItem]}>
              <Image style={{width:24,height:24}} source={likeImgSource}/>
              <Text style={[styles.vItemTxt, styles.bottomZanTxt]}>点赞</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.contactedWrap]} onPress={() => this.openModel()}>
            <View style={[styles.contactedBox]}>
              <Image style={{}} source={require('../../assets/images/topic_message.png')}/>
              <Text style={[styles.contactedTxt]}>评论</Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    }
    
  }

}

TopicDetail.defaultProps = {}

const mapStateToProps = (state, ownProps) => {

  let ds = undefined
  if (ownProps.ds) {
    ds = ownProps.ds
  } else {
    ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2,
    })
  }

  let dataArray = []
  dataArray.push({type: 'COLUMN_1'})
  dataArray.push({type: 'COLUMN_2'})

  const isLogin = isUserLogined(state)
  const userInfo = activeUserInfo(state)
  const allTopicComments = getTopicComments(state)
  const topicComments = allTopicComments[ownProps.topic.objectId]
  let lastTopicCommentsCreatedAt = ''
  if(topicComments && topicComments.length) {
    lastTopicCommentsCreatedAt = topicComments[topicComments.length-1].createdAt
  }
  const likesCount = getTopicLikedTotalCount(state, ownProps.topic.objectId)
  const topicLikeUsers = getTopicLikeUsers(state, ownProps.topic.objectId)
  const isLiked = isTopicLiked(state, ownProps.topic.objectId)
  const commentsTotalCount = topicComments ? topicComments.length : undefined


  let userFollowersTotalCount = 0
  if(ownProps.topic && ownProps.topic.userId) {
    userFollowersTotalCount = authSelector.selectUserFollowersTotalCount(state, ownProps.topic.userId)
  }

  return {
    ds: ds.cloneWithRows(dataArray),
    topicComments: topicComments,
    topicLikeUsers: topicLikeUsers,
    likesCount: likesCount,
    isLogin: isLogin,
    isLiked: isLiked,
    userInfo: userInfo,
    commentsTotalCount: commentsTotalCount,
    userFollowersTotalCount: userFollowersTotalCount,
    lastTopicCommentsCreatedAt: lastTopicCommentsCreatedAt
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchTopicCommentsByTopicId,
  publishTopicFormData,
  fetchTopicIsLiked,
  fetchTopicLikeUsers,
  fetchTopicLikesCount,
  likeTopic,
  unLikeTopic,
  fetchOtherUserFollowersTotalCount
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
    paddingBottom: 50
  },
  topicLikesWrap: {
    flex:1,
    flexDirection:'row',
    marginTop:8,
    padding: 15,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor:'white',
    justifyContent: 'space-between',
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: THEME.colors.lighterA,
  },
  titleLine: {
    width: 3,
    backgroundColor: '#ff7819',
    marginRight: 5,
  },
  titleTxt: {
    color: '#FF7819',
    fontSize: em(15)
  },
  likeStyle: {
    flex:1
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
    borderTopWidth: normalizeBorder(),
    borderTopColor: THEME.colors.lighterA,
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    height:50
  },
  vItem: {
    flex: 1,
    alignSelf:'flex-start',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingBottom: 3,
    paddingLeft: 30
  },
  vItemTxt: {
    marginTop: 2,
    fontSize: em(10),
    color: '#aaa'
  },
  bottomZanTxt: {
    color:'#ff7819'
  },
  shopCommentInputBox: {
    flex: 1,
  },
  shopCommentInput: {
    fontSize: em(17),
    color: '#8f8e94'
  },
  contactedWrap: {
    width: normalizeW(135),
    backgroundColor: '#FF9D4E',
    justifyContent: 'center',
    alignItems: 'center'
  },
  contactedBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  contactedTxt: {
    color: 'white',
    fontSize: em(15),
    marginLeft: normalizeW(9)
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