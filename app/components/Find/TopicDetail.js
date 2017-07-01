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

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export class TopicDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      commentY: 0,
      comment: undefined,
      hideBottomView: false,
      loadComment: false,
      showPayModal: false,
      pay: '',
    }
    this.replyInput = null
    this.isReplying = false
  }

  componentWillMount() {
    this.refreshData()
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchTopicLikesCount({topicId: this.props.topic.objectId, upType: 'topic'})
    })
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchTopicLikeUsers({topicId: this.props.topic.objectId, isRefresh: true})
    })
    InteractionManager.runAfterInteractions(() => {
      if (this.props.isLogin) {
        this.props.fetchTopicIsLiked({topicId: this.props.topic.objectId, upType: 'topic'})
      }
    })
    InteractionManager.runAfterInteractions(() => {
      if(this.props.topic && this.props.topic.userId) {
        this.props.fetchOtherUserFollowersTotalCount({userId: this.props.topic.userId})
      }
    })
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchShareDomain()
    })
  }

  componentDidMount() {

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
      this.props.publishTopicFormData({
        content: content,
        topicId: this.props.topic.objectId,
        userId: this.props.userInfo.id,
        replyTo: (this.state.comment) ? this.state.comment.userId : this.props.topic.userId,
        commentId: (this.state.comment) ? this.state.comment.objectId : undefined,
        submitType: TOPIC_FORM_SUBMIT_TYPE.PUBLISH_TOPICS_COMMENT,
        success: () => this.submitSuccessCallback(),
        error: (error) => this.submitErrorCallback(error)
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
      if(this.isSubmiting) {
        return 
      }

      this.isSubmiting = true
      if (this.props.isLiked) {
        this.props.unLikeTopic({
          topicId: this.props.topic.objectId,
          upType: 'topic',
          success: this.likeSuccessCallback.bind(this),
          error: this.likeErrorCallback.bind(this)
        })
      }
      else {
        this.props.likeTopic({
          topicId: this.props.topic.objectId,
          upType: 'topic',
          success: this.likeSuccessCallback.bind(this),
          error: this.likeErrorCallback.bind(this)
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
    this.isSubmiting = false
    Toast.show(error.message)
  }

  likeSuccessCallback() {
    this.isSubmiting = false
    this.props.fetchTopicIsLiked({topicId: this.props.topic.objectId, upType: 'topic'})
    // this.props.fetchTopicLikesCount({topicId: this.props.topic.objectId, upType: 'topic'})
    this.props.fetchTopicLikeUsers({topicId: this.props.topic.objectId, isRefresh: true})
  }

  renderTopicLikeOneUser(value, key) {
    return (
      <TouchableOpacity key={key} style={{alignSelf: 'center'}}>
        <CachedImage mutable  style={styles.zanAvatarStyle}
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
        <CachedImage mutable style={{width: normalizeW(25), height: normalizeH(6)}} resizeMode="contain"
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

  onShare = () => {
    let shareUrl = this.props.shareDomain? this.props.shareDomain + "topicShare/" + this.props.topic.objectId:
      DEFAULT_SHARE_DOMAIN + "topicShare/" + this.props.topic.objectId


    console.log("topicShare url:", shareUrl)

    Actions.SHARE({
      title: this.props.topic.title || "邻家话题",
      url: shareUrl,
      author: this.props.topic.nickname || "邻家小二",
      abstract: this.props.topic.abstract || "",
      cover: this.props.topic.avatar,
    })
  }

  renderHeaderView() {
    let topic = this.props.topic
    if (topic.picked || this.props.enableShare) {
      return (
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="详情"
          rightComponent={()=>{
            return (
              <TouchableOpacity onPress={this.onShare} style={{marginRight:10}}>
                <CachedImage mutable source={require('../../assets/images/active_share.png')}/>
              </TouchableOpacity>
            )
          }}
        />
      )
    } else {
      return (
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="详情"
        />
      )
    }
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
    let topic = this.props.topic
    return (
      <View style={{flex:1}}>
        <TopicContent
          lazyHost={lazyHost}
          topic={this.props.topic}
          userFollowersTotalCount={this.props.userFollowersTotalCount}
          isSelfTopic={this.isSelfTopic()}
        />
        <TouchableOpacity style={styles.likeStyle}
                          onLayout={this.measureMyComponent.bind(this)}
                          onPress={()=>Actions.LIKE_USER_LIST({topicId: topic.objectId})}>
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
        {this.renderTopicCommentPage()}
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

    InteractionManager.runAfterInteractions(() => {
      this.props.fetchTopicCommentsByTopicId(payload)
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

  renderPaymentModal() {
    return (
      <View>
        <Modal
          visible={this.state.showPayModal}
          transparent={true}
          animationType='fade'
          onRequestClose={()=>{this.setState({showPayModal: false})}}
        >
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
            <View style={{backgroundColor: '#FFF', borderRadius: 10, alignItems: 'center'}}>
              <View style={{paddingBottom: normalizeH(20), paddingTop: normalizeH(20)}}>
                <Text style={{fontSize: em(20), color: '#5A5A5A', fontWeight: 'bold'}}>设置打赏金额</Text>
              </View>
              <View style={{paddingBottom: normalizeH(15), flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontSize: em(17), color: THEME.base.mainColor, paddingRight: 8}}>¥</Text>
                <TextInput
                  placeholder='打赏金额'
                  underlineColorAndroid="transparent"
                  onChangeText={(text) => this.setState({pay: text})}
                  value={this.state.pay}
                  keyboardType="numeric"
                  maxLength={6}
                  style={{
                    height: normalizeH(42),
                    fontSize: em(17),
                    textAlignVertical: 'center',
                    borderColor: '#0f0f0f',
                    width: normalizeW(100),
                  }}
                />
                <Text style={{fontSize: em(17), color: '#5A5A5A', paddingLeft: 8}}>元</Text>
              </View>
              <View style={{width: PAGE_WIDTH-100, height: normalizeH(50), padding: 0, flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderColor: '#F5F5F5'}}>
                <View style={{flex: 1, borderRightWidth: 1, borderColor: '#F5F5F5'}}>
                  <TouchableOpacity style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
                                    onPress={() => this.setState({showPayModal: false})}>
                    <Text style={{fontSize: em(17), color: '#5A5A5A'}}>取消</Text>
                  </TouchableOpacity>
                </View>
                <View style={{flex: 1}}>
                  <TouchableOpacity style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
                                    onPress={() => this.onPaymentPress()}>
                    <Text style={{fontSize: em(17), color: THEME.base.mainColor}}>确定</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    )
  }

  render() {
    let lazyHost = "detailList" + this.props.topic.objectId
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
                placeholder={(this.state.comment) ? "回复 " + this.state.comment.nickname + ": " : "回复 楼主: "}
              />
            : null
          }
        </KeyboardAwareToolBar>

        {this.renderPaymentModal()}

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
          <CachedImage mutable style={{marginRight:10}} source={require('../../assets/images/shop_edite.png')}/>
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
              <CachedImage mutable style={{width:24,height:24}} resizeMode='contain' source={likeImgSource}/>
              <Text style={[styles.vItemTxt, styles.bottomZanTxt]}>{isLiked ? '已赞' : '点赞'}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.shopCommentInputBox]} onPress={() => this.openModel()}>
            <View style={[styles.vItem]}>
              <CachedImage mutable style={{width:24,height:24}} resizeMode='contain' source={require('../../assets/images/message.png')}/>
              <Text style={[styles.vItemTxt, styles.bottomZanTxt]}>评论</Text>
            </View>
          </TouchableOpacity>
          <View style={{flex:1}}/>
          <TouchableOpacity style={styles.contactedWrap} onPress={() => this.openPaymentModal()}>
            <View style={[styles.contactedBox]}>
              <CachedImage mutable style={{}} source={require('../../assets/images/reward.png')}/>
              <Text style={[styles.contactedTxt]}>打赏</Text>
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

  let topicCategory = getTopicCategoriesById(state, ownProps.topic.categoryId)
  let enableShare = topicCategory.enableShare

  let shareDomain = getShareDomain(state)

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
    lastTopicCommentsCreatedAt: lastTopicCommentsCreatedAt,
    shareDomain: shareDomain,
    enableShare: enableShare,
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
  fetchShareDomain
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(TopicDetail)

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
})