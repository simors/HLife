/**
 * Created by lilu on 2017/8/22.
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
import {
  fetchUserFollowShops,
  fetchUserOwnedShopInfo,
  fetchShopDetail,
  fetchGuessYouLikeShopList,
  fetchShopAnnouncements,
  userIsFollowedShop,
  unFollowShop,
  followShop,
  submitShopComment,
  fetchShopCommentList,
  fetchShopCommentTotalCount,
  userUpShop,
  userUnUpShop,
  fetchUserUpShopInfo,
  getShopGoodsList,
  fetchAllComments,
  userUpShopComment
} from '../../action/shopAction'
import {
  selectUserOwnedShopInfo,
  selectShopDetail,
  selectGuessYouLikeShopList,
  selectLatestShopAnnouncemment,
  selectUserIsFollowShop,
  selectShopComments,
  selectShopCommentsTotalCount,
  selectGoodsList,
  selectCommentsForShop,
  selectCommentsForComment,
  isCommentLiked,
} from '../../selector/shopSelector'

import THEME from '../../constants/themes/theme1'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import dismissKeyboard from 'react-native-dismiss-keyboard'
import KeyboardAwareToolBar from '../common/KeyboardAwareToolBar'
import  ToolBarContent from '../shop/ShopCommentReply/ToolBarContent'
import {fetchOtherUserFollowersTotalCount} from '../../action/authActions'
import {publishTopicFormData, TOPIC_FORM_SUBMIT_TYPE} from '../../action/topicActions'
import {isUserLogined, activeUserInfo} from '../../selector/authSelector'
import * as authSelector from '../../selector/authSelector'
import Icon from 'react-native-vector-icons/Ionicons'
import {getCommentsByTopicId,getCommentsByCommentId} from '../../selector/newTopicSelector'
import {getTopicLikedTotalCount, getTopicComments, isTopicLiked, getTopicLikeUsers} from '../../selector/topicSelector'
import ShopCommentListV2 from './ShopCommentListV2'
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
import shallowequal from 'shallowequal'
const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export class ShopCommentDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      commentY: 0,
      comment: undefined,
      hideBottomView: false,
      loadComment: true,
      showPayModal: false,
      pay: '',
      upCount: 0,
      isLike:false
    }
    this.replyInput = null
    this.isReplying = false
  }

  componentWillMount() {
    this.refreshData()
    // let lastTopicCommentsCreatedAt = this.props.lastTopicCommentsCreatedAt
    // let payload = {
    //   topicId: this.props.comment.topicId,
    //   isRefresh: false,
    //   lastCreatedAt: lastTopicCommentsCreatedAt,
    //   commentId: this.props.comment.commentId,
    //   more: false,
    //   success: (isEmpty) => {
    //     this.isQuering = false
    //     if (!this.listView) {
    //       return
    //     }
    //     if (isEmpty) {
    //       this.listView.isLoadUp(false)
    //     } else {
    //       this.listView.isLoadUp(true)
    //     }
    //   },
    //   error: (err)=> {
    //     this.isQuering = false
    //     Toast.show(err.message, {duration: 1000})
    //   }
    // }
    //
    // // InteractionManager.runAfterInteractions(() => {
    //   // this.props.fetchTopicCommentsByTopicId(payload)
    //   this.props.fetchAllComments(payload)
    // // })
    this.loadMoreData(true)
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
      upCount: this.props.comment.upCount
    })
    if (Platform.OS == 'ios') {
      Keyboard.addListener('keyboardWillShow', this.onKeyboardWillShow)
      Keyboard.addListener('keyboardWillHide', this.onKeyboardWillHide)
    } else {
      Keyboard.addListener('keyboardDidShow', this.onKeyboardDidShow)
      Keyboard.addListener('keyboardDidHide', this.onKeyboardDidHide)
    }
  }

  componentWillUnmount() {
    if (Platform.OS == 'ios') {
      Keyboard.removeListener('keyboardWillShow', this.onKeyboardWillShow)
      Keyboard.removeListener('keyboardWillHide', this.onKeyboardWillHide)
    } else {
      Keyboard.removeListener('keyboardDidShow', this.onKeyboardDidShow)
      Keyboard.removeListener('keyboardDidHide', this.onKeyboardDidHide)

    }
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
      }, ()=> {
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
      this.props.submitShopComment({
        content: content,
        shopId: this.props.comment.shopId,
        userId: this.props.userInfo.id,
        replyTo: (this.state.comment && this.state.comment.id) ? this.state.comment.authorId : this.props.comment.authorId,
        replyId: (this.state.comment) ? this.state.comment.id : undefined,
        commentId: this.props.comment.id,
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

  measureMyComponent(event) {
    this.setState({commentY: (event.nativeEvent.layout.height + event.nativeEvent.layout.y)})
  }

  scrollToComment() {
    this.refs.scrollView.scrollTo(this.state.commentY)
  }


  onLikeCommentButton(payload) {
    if (this.props.isLogin) {
      this.props.userUpShopComment({
        shopCommentId: this.props.comment.id,
        success: ()=>{this.upCommentSuccess()},
        error: (err)=>{this.likeErrorCallback(err)}
      })

    }
    else {
      Actions.LOGIN()
    }
  }

  upCommentSuccess() {
    this.isSubmiting = false
    this.setState({
      upCount: this.state.upCount + 1,
      isLike:true
    })
  }

  likeErrorCallback(error) {
    this.isSubmiting = false
    Toast.show(error.message)
  }

  renderHeaderView() {
    return (
      <Header
        leftType="icon"
        leftIconName="ios-arrow-back"
        leftPress={() => Actions.pop()}
        title={this.props.comment.commentCount + "条回复"}
      />
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
      <View style={{flex: 1}}>
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
              <Text style={styles.timeTextStyle}>{this.props.comment.upCount + '人赞过'}</Text>
              <TouchableOpacity style={styles.commentStyle} onPress={()=>this.onLikeCommentButton({comment: comment})}>
                <Image style={styles.commentImageStyle}
                       resizeMode='contain'
                       source={(this.props.isLiked||this.state.isLike) ?
                         require("../../assets/images/like_selected.png") :
                         require("../../assets/images/like_unselect.png")}/>
                <Text style={styles.commentTextStyle}>{this.state.upCount ? this.state.upCount : 0}</Text>
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
        <LazyloadView host="detailList" style={{flex: 1}}>
          <View style={{flexDirection: 'row', padding: 15, paddingTop: 20, backgroundColor: 'white'}}>
            <Text style={styles.titleTxt}>全部回复</Text>
          </View>
        </LazyloadView>
      )
    }
    return (
      <View style={{flex: 1}}>
        {/*{this.renderTopicCommentPage()}*/}
        <View style={{flexDirection: 'row', padding: 15, paddingTop: 20, backgroundColor: 'white'}}>
          <Text
            style={[styles.titleTxt,{color:'#030303'}]}>全部回复</Text>
        </View>
        <ShopCommentListV2
          viewType='shopComment'
          allShopComments={this.props.shopCommentList}
          commentsArray = {this.props.shopCommentIdList}
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
    if (this.isQuering) {
      return
    }
    console.log('isrefresh===>',isRefresh)
    this.isQuering = true
    let lastShopCommentsCreatedAt = this.props.lastShopCommentsCreatedAt
    let payload = {
      shopId: this.props.comment.shopId,
      isRefresh: !!isRefresh,
      lastCreatedAt: lastShopCommentsCreatedAt,
      commentId: this.props.comment.id,
      more: !isRefresh,
      success: (isEmpty) => {
        this.isQuering = false
        if (!this.listView) {
          return
        }
        if (isEmpty) {
          this.listView.isLoadUp(false)
        } else {
          this.listView.isLoadUp(true)
        }
      },
      error: (err)=> {
        this.isQuering = false
        Toast.show(err.message, {duration: 1000})
      }
    }

    InteractionManager.runAfterInteractions(() => {
      // this.props.fetchTopicCommentsByTopicId(payload)
      this.props.fetchAllComments(payload)
    })
  }

  render() {
    let lazyHost = "commentList" + this.props.comment.id
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
          ? <TouchableOpacity
          style={{position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, backgroundColor: 'rgba(0,0,0,0.5)'}}
          onPress={()=> {
            dismissKeyboard()
          }}>
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

  commentForComment(){
    this.setState({
      comment: undefined
    })
    this.openModel()
  }
  renderBottomView() {
    let isLiked = this.props.isLiked||this.state.isLike
    let likeImgSource = require("../../assets/images/like_unselect_main.png")
    if (isLiked) {
      likeImgSource = require("../../assets/images/like_selected.png")
    }

    return (
      <View style={[styles.shopCommentWrap, {position: 'absolute', bottom: 0, left: 0, right: 0}]}>
        <TouchableOpacity style={[styles.shopCommentInputBox]} onPress={()=> {
          this.onLikeCommentButton({comment: this.props.comment})
        }}>
          <View style={[styles.vItem]}>
            <CachedImage mutable style={{width: 24, height: 24}} resizeMode='contain' source={likeImgSource}/>
            <Text style={[styles.vItemTxt, styles.bottomZanTxt]}>{isLiked ? '已赞' : '点赞'}</Text>
          </View>
        </TouchableOpacity>
        <View style={{flex: 1}}/>
        <TouchableOpacity style={[styles.contactedWrap]} onPress={() => this.commentForComment()}>
          <View style={[styles.contactedBox]}>
            <CachedImage mutable style={{}} resizeMode='contain' source={require('../../assets/images/none_message.png')}/>
            <Text style={styles.contactedTxt}>评论</Text>
          </View>
        </TouchableOpacity>

      </View>
    )


  }

}

ShopCommentDetail.defaultProps = {}

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
  const comments = selectCommentsForComment(state, ownProps.comment.id)
  const isLogin = isUserLogined(state)
  const userInfo = activeUserInfo(state)
 let lastShopCommentsCreatedAt = ''
  if (comments.commentList && comments.commentList.length) {
    lastShopCommentsCreatedAt = comments.commentList[comments.commentList.length - 1].createdAt
  }

  const isLiked = isCommentLiked(state, ownProps.comment.id)
  console.log('ownProps.comment.id=====>',ownProps.comment.id)
  console.log('isLiked=====>',isLiked)

  return {
    ds: ds.cloneWithRows(dataArray),
    isLogin: isLogin,
    isLiked: isLiked,
    userInfo: userInfo,
    shopCommentList: comments.commentList,
    shopCommentIdList: comments.commentIdList,
    lastShopCommentsCreatedAt: lastShopCommentsCreatedAt,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchTopicCommentsByTopicId,
  publishTopicFormData,
  fetchOtherUserFollowersTotalCount,
  fetchShareDomain,
  fetchAllComments,
  submitShopComment,
  userUpShopComment
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ShopCommentDetail)

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
    flex: 1,
    flexDirection: 'row',
    marginTop: 8,
    padding: 15,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
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
    flex: 1
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
    height: 50
  },
  vItem: {
    flex: 1,
    alignSelf: 'flex-start',
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
    color: '#ff7819'
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
    fontSize: em(12),
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