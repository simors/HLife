/**
 * Created by lilu on 2017/7/8.
 */
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
  Modal,
  TextInput,
} from 'react-native'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import TopicComment from './NewTopicComment'
import dismissKeyboard from 'react-native-dismiss-keyboard'
import TopicContent from './TopicContent'
import KeyboardAwareToolBar from '../common/KeyboardAwareToolBar'
import ToolBarContent from '../shop/ShopCommentReply/ToolBarContent'
import {fetchOtherUserFollowersTotalCount} from '../../action/authActions'
import {publishTopicFormData, TOPIC_FORM_SUBMIT_TYPE} from '../../action/topicActions'
import {isUserLogined, activeUserInfo} from '../../selector/authSelector'
import * as authSelector from '../../selector/authSelector'
import Icon from 'react-native-vector-icons/Ionicons'
import {getCommentsByTopicId,isCommentLiked,getCommentsByCommentId} from '../../selector/newTopicSelector'
import {getTopicLikedTotalCount, getTopicComments, isTopicLiked, getTopicLikeUsers} from '../../selector/topicSelector'
import {
  fetchTopicLikesCount,
  fetchTopicIsLiked,
  likeTopic,
  unLikeTopic,
  fetchTopicLikeUsers,
} from '../../action/topicActions'
import ActionSheet from 'react-native-actionsheet'
import CommonListView from '../common/CommonListView'
import {fetchShareDomain} from '../../action/configAction'
import {getShareDomain, getTopicCategoriesById} from '../../selector/configSelector'
import {REWARD} from '../../constants/appConfig'
import * as Toast from '../common/Toast'
import {fetchTopicCommentsByTopicId} from '../../action/topicActions'
import {DEFAULT_SHARE_DOMAIN} from '../../util/global'
import {CachedImage} from "react-native-img-cache"
import {LazyloadView} from '../common/Lazyload'
import {getThumbUrl} from '../../util/ImageUtil'
import {fetchAllComments,fetchUpItem,fetchPublishTopicComment} from '../../action/newTopicAction'
import shallowequal from 'shallowequal'
import TopicCommentList from './TopicCommentList'
const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export class TopicCommentDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      commentY: 0,
      comment: undefined,
      hideBottomView: false,
      loadComment: false,
      showPayModal: false,
      pay: '',
      upCount:0
    }
    this.replyInput = null
    this.isReplying = false
  }

  componentWillMount() {
    this.refreshData()

  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!shallowequal(this.props, nextProps)) {
      return true;
    }
    if (!shallowequal(this.state, nextState)) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    this.setState({
      upCount:this.props.comment.upCount
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
    this.setState({hideBottomView: false})
    // dismissKeyboard()
    // console.log('publishCommentSuccesss=========>')
    Toast.show('评论成功', {duration: 1000})
    this.isReplying = false
  }

  submitErrorCallback(error) {
    Toast.show(error.message)
    this.isReplying = false
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
    if (this.isReplying) {
      Toast.show('正在发表评论，请稍后')
      return
    }
    if (!this.props.isLogin) {
      Actions.LOGIN()
    } else {
      this.isReplying = true
      this.props.fetchPublishTopicComment({
        content: content,
        topicId: this.props.comment.topicId,
        userId: this.props.userInfo.id,
        replyTo: (this.state.comment&&this.state.comment.commentId) ? this.state.comment.authorId : this.props.comment.authorId,
        replyId: (this.state.comment) ? this.state.comment.commentId : undefined,
        commentId:this.props.comment.commentId,
        submitType: TOPIC_FORM_SUBMIT_TYPE.PUBLISH_TOPICS_COMMENT,
        success: () => this.submitSuccessCallback(),
        error: (error) => this.submitErrorCallback(error)
      })
    }
  }



  onCommentButton(topic) {
    this.setState({
      comment: topic
    })
    this.openModel()
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
      if(this.isSubmiting) {
        return
      }

      this.isSubmiting = true

        this.props.likeTopic({
          topicId: this.props.topic.objectId,
          upType: 'topic',
          success: this.likeSuccessCallback.bind(this),
          error: this.likeErrorCallback.bind(this)
        })

    }
    else {
      Actions.LOGIN()
    }
  }

  onLikeCommentButton(payload) {
    if (this.props.isLogin) {
      this.props.fetchUpItem({
        targetId: payload.comment.commentId,
        upType: 'topicComment',
        success: this.upCommentSuccess(),
        error: this.likeErrorCallback
      })

    }
    else {
      Actions.LOGIN()
    }
  }

  upCommentSuccess(){
    this.setState({
      upCount:this.state.upCount+1
    })
  }

  likeErrorCallback(error) {
    this.isSubmiting = false
    Toast.show(error.message)
  }

  likeSuccessCallback() {
    this.isSubmiting = false
    // this.props.fetchTopicLikesCount({topicId: this.props.topic.objectId, upType: 'topic'})
  }

  renderTopicLikeOneUser(value, key) {
    return (
      <TouchableOpacity key={key} style={{alignSelf: 'center'}}>
        <CachedImage mutable  style={styles.zanAvatarStyle}
                     source={value.avatar ? {uri: value.avatar} : require("../../assets/images/default_portrait.png")}/>
      </TouchableOpacity>
    )
  }






  renderHeaderView() {

      return (
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title={this.props.comment.commentCount+"条回复"}
        />
      )

  }

  renderTopicLikeUsersView() {
    let topicLikeUsers = this.props.topicLikeUsers
    let likesCount = this.props.likesCount
    if(likesCount && topicLikeUsers && topicLikeUsers.length) {
      let topicLikeUsersView = topicLikeUsers.map((item, index)=>{
        if(index > 2) {
          return null
        }
        let source = require('../../assets/images/default_portrait.png')
        if(item.avatar) {
          source = {uri: getThumbUrl(item.avatar, 20, 20)}
        }

        return (
          <CachedImage
            mutable
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

  renderRow(rowData, rowId, lazyHost) {
    switch (rowData.type) {
      case 'COLUMN_1':
        return this.renderTopicContentColumn(lazyHost)
      case 'COLUMN_2':
        return this.renderTopicCommentsColumn()
      default:
        return <View />
    }
  }

  renderTopicContentColumn(lazyHost) {
    let comment = this.props.comment
    return (
      <View style={{flex:1}}>
        <View style={[styles.containerStyle, this.props.containerStyle]}>

          <View style={styles.avatarViewStyle}>
            <TouchableOpacity onPress={() => Actions.PERSONAL_HOMEPAGE({userId: comment.authorId})}>
              <CachedImage mutable style={styles.avatarStyle}
                           source={comment.authorAvatar ? {uri: getThumbUrl(comment.authorAvatar, normalizeW(35), normalizeH(35))} : require("../../assets/images/default_portrait.png")}/>
            </TouchableOpacity>
          </View>

          <View style={styles.commentContainerStyle}>

            <TouchableOpacity onPress={() => Actions.PERSONAL_HOMEPAGE({userId: comment.authorId})}>
              <Text style={styles.userNameStyle}>{comment.authorNickname}</Text>
            </TouchableOpacity>


            <Text style={styles.contentStyle}>
              {comment.content}
            </Text>

            <View style={styles.timeLocationStyle}>
              <Text style={styles.timeTextStyle}>{this.props.comment.upCount+'人赞过'}</Text>
              <TouchableOpacity style={styles.commentStyle} onPress={()=>this.onLikeCommentButton({comment:comment})}>
                <Image style={styles.commentImageStyle}
                       resizeMode='contain'
                       source={this.props.isLiked ?
                         require("../../assets/images/like_selected.png") :
                         require("../../assets/images/like_unselect.png")}/>
                <Text style={styles.commentTextStyle}>{this.state.upCount?this.state.upCount:0}</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </View>
    )
  }

  renderTopicCommentsColumn() {
    if (!this.state.loadComment) {
      return (
        <LazyloadView host="detailList" style={{flex:1}}>
          <View style={{flexDirection: 'row',padding:15,paddingTop:20,backgroundColor:'white'}}>
            <View style={styles.titleLine}/>
            <Text style={styles.titleTxt}>邻友点评</Text>
          </View>
        </LazyloadView>
      )
    }

    return (
      <View style={{flex:1}}>
        {/*{this.renderTopicCommentPage()}*/}
        <View style={{flexDirection: 'row', padding: 15, paddingTop: 20, backgroundColor: 'white'}}>
          <View style={styles.titleLine}/>
          <Text
            style={styles.titleTxt}>邻友点评·{this.props.comment.commentNum > 999 ? '999+' : this.props.comment.commentNum}</Text>
        </View>
        <TopicCommentList
          viewType = 'topicComment'
          allTopicComments={this.props.allTopicComments}
          commentsArray = {this.props.commentsArray}
          topic = {this.props.topic}
          onCommentButton={(payload)=>{this.onCommentButton(payload)}}
        />
      </View>
    )
  }

  refreshData() {
    // this.loadMoreData(true)
    this.setState({loadComment: false})
  }

  loadMoreData(isRefresh) {
    if (!this.state.loadComment) {
      this.setState({loadComment: true}, () => this.loadMoreData(true))
      return
    }

    if(this.isQuering) {
      return
    }
    this.isQuering = true

    let topic = this.props.topic
    let lastTopicCommentsCreatedAt = this.props.lastTopicCommentsCreatedAt
    // console.log('lastTopicCommentsCreatedAt------>', lastTopicCommentsCreatedAt)

    let payload = {
      topicId: this.props.comment.topicId,
      isRefresh: !!isRefresh,
      lastCreatedAt: lastTopicCommentsCreatedAt,
      commentId: this.props.comment.commentId,
      more:!isRefresh,
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

    InteractionManager.runAfterInteractions(() => {
      // this.props.fetchTopicCommentsByTopicId(payload)
      this.props.fetchAllComments(payload)
    })
  }

  onPaymentPress() {
    this.setState({showPayModal: false})
    let pay = this.state.pay
    let decimal_part = pay.toString().split('.')[1]
    if (decimal_part && decimal_part.length > 2) {
      Toast.show('最多2位小数')
      return
    }
    let topic = this.props.topic
    Actions.PAYMENT({
      title: '打赏支付',
      price: pay,
      metadata: {
        'fromUser': this.props.userInfo.id,
        'toUser': topic.userId,
        'dealType': REWARD
      },
      subject: '话题打赏费',
      paySuccessJumpScene: 'REWARD_OK',
      paySuccessJumpSceneParams: {
      },
      payErrorJumpBack: true,
    })
  }

  openPaymentModal() {
    if (!this.props.isLogin) {
      Actions.LOGIN()
    } else {
      this.setState({showPayModal: true})
    }
  }


  render() {
    let lazyHost = "commentList" + this.props.comment.topicId
    return (
      <View style={styles.containerStyle}>
        {this.renderHeaderView()}
        <View style={styles.body}>
          <CommonListView
            name={lazyHost}
            contentContainerStyle={{backgroundColor: '#fff'}}
            dataSource={this.props.ds}
            renderRow={(rowData, rowId) => this.renderRow(rowData, rowId, lazyHost)}
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
            placeholder={(this.state.comment) ? "回复 " + this.state.comment.authorNickname + ": " : "回复 楼主: "}
          />
            : null
          }
        </KeyboardAwareToolBar>

      </View>
    )
  }



  renderBottomView() {
      let isLiked = this.props.isLiked
      let likeImgSource = require("../../assets/images/like_unselect_main.png")
      if(isLiked) {
        likeImgSource = require("../../assets/images/like_selected.png")
      }

      return (
        <View style={[styles.shopCommentWrap, {position:'absolute',bottom:0,left:0,right:0}]}>
          <TouchableOpacity style={[styles.shopCommentInputBox]} onPress={()=>{this.onLikeCommentButton({comment:this.props.comment})}}>
            <View style={[styles.vItem]}>
              <CachedImage mutable style={{width:24,height:24}} resizeMode='contain' source={likeImgSource}/>
              <Text style={[styles.vItemTxt, styles.bottomZanTxt]}>{isLiked ? '已赞' : '点赞'}</Text>
            </View>
          </TouchableOpacity>
          <View style={{flex:1}}/>
          <TouchableOpacity style={[styles.contactedWrap]} onPress={() => this.openModel()}>
            <View style={[styles.contactedBox]}>
              <CachedImage mutable style={{}} resizeMode='contain' source={require('../../assets/images/message.png')}/>
              <Text style={styles.contactedTxt}>评论</Text>
            </View>
          </TouchableOpacity>
          {/*<TouchableOpacity style={styles.contactedWrap} onPress={() => this.openPaymentModal()}>*/}
            {/*<View style={[styles.contactedBox]}>*/}
              {/*<CachedImage mutable style={{}} source={require('../../assets/images/reward.png')}/>*/}
              {/*<Text style={[styles.contactedTxt]}>打赏</Text>*/}
            {/*</View>*/}
          {/*</TouchableOpacity>*/}
        </View>
      )


  }

}

TopicCommentDetail.defaultProps = {}

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
  const comments = getCommentsByCommentId(state,ownProps.comment.commentId)
  const isLogin = isUserLogined(state)
  const userInfo = activeUserInfo(state)
  const allTopicComments = getTopicComments(state)
  const topicComments = allTopicComments[ownProps.comment.topicId]
  let lastTopicCommentsCreatedAt = ''
  if(comments.commentList && comments.commentList.length) {
    lastTopicCommentsCreatedAt = comments.commentList[comments.commentList.length-1].createdAt
  }
  const isLiked = isCommentLiked(state, ownProps.comment.commentId)






  return {
    ds: ds.cloneWithRows(dataArray),
    topicComments: topicComments,

    isLogin: isLogin,
    isLiked: isLiked,
    userInfo: userInfo,
    allTopicComments : comments.commentList,
    commentsArray : comments.comments,
    lastTopicCommentsCreatedAt: lastTopicCommentsCreatedAt,
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
  fetchOtherUserFollowersTotalCount,
  fetchShareDomain,
  fetchAllComments,
  fetchUpItem,
  fetchPublishTopicComment
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(TopicCommentDetail)

//export
const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },

  body: {
    marginTop: normalizeH(64),
    flex: 1,
    backgroundColor: '#E5E5E5',
    paddingBottom: normalizeH(50),
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
    width: 64,
  },
  shopCommentInput: {
    fontSize: em(17),
    color: '#8f8e94'
  },
  contactedWrap: {
    width: normalizeW(110),
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
  containerStyle: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    width: PAGE_WIDTH,
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: THEME.colors.lighterA,
  },
  commentUserStyle: {
    fontSize: em(12),
    color: "#5A5A5A"
  },
  avatarViewStyle: {
    width: normalizeW(57),
  },
  avatarStyle: {
    height: normalizeH(35),
    width: normalizeW(35),
    borderRadius: 17.5,
    borderWidth: 1,
    borderColor: 'transparent',
    marginTop: normalizeH(10),
    marginLeft: normalizeW(12),
  },

  parentCommentStyle: {
    width: normalizeW(300),
    backgroundColor: '#f2f2f2',
    marginRight: 8,
    marginTop: normalizeH(10),
    marginBottom: normalizeH(15),
  },

  parentCommentContentStyle: {
    marginBottom: normalizeH(8),
    marginTop: normalizeH(6),
    marginLeft: normalizeW(6),
    marginRight: normalizeW(4),
    fontSize:em(12),
  },
  commentContainerStyle: {
    width: normalizeW(318),
  },
  userNameStyle: {
    fontSize: em(12),
    marginTop: normalizeH(10),
    color: "#5A5A5A"
  },
  parentCommentTextStyle: {
    color: '#000000',
    letterSpacing: 0.15,
    lineHeight: 20
  },
  contentStyle: {
    fontSize: em(17),
    lineHeight: 20,
    paddingTop: normalizeH(10),
    paddingRight: normalizeW(8),
    color: "#4a4a4a"
  },
  likeStyle: {
    position: 'absolute',
    left: normalizeW(189),
    backgroundColor: '#FFFFFF',
    height: normalizeH(16),
    alignItems: 'center',
    flexDirection: 'row',
  },
  likeImageStyle: {
    height: normalizeW(16),
    width: normalizeH(18),
    marginRight: 3,
    resizeMode: 'stretch'
  },
  commentImageStyle: {
    height: normalizeH(16),
    width: normalizeW(16),
    marginRight: 3,
    resizeMode: 'stretch'
  },
  commentTextStyle: {
    fontSize: em(12),
    letterSpacing: 0.14,
    color: THEME.colors.lighter
  },
  commentStyle: {
    position: 'absolute',
    left: normalizeW(259),
    backgroundColor: '#FFFFFF',
    height: normalizeH(16),
    alignItems: 'center',
    flexDirection: 'row',
  },
  attentionStyle: {
    position: "absolute",
    right: normalizeW(10),
    top: normalizeH(6),
    width: normalizeW(56),
    height: normalizeH(25)
  },
  timeLocationStyle: {
    marginTop: normalizeH(14),
    marginBottom: normalizeH(15),
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeTextStyle: {
    marginRight: normalizeW(26),
    fontSize: em(12),
    color: THEME.colors.lighter
  },
  positionStyle: {
    marginRight: normalizeW(4),
    width: normalizeW(8),
    height: normalizeH(12)
  },
})