/**
 * Created by zachary on 2016/12/13.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  ListView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Platform,
  InteractionManager,
  TextInput,
  Animated,
  Linking,
  Keyboard,
} from 'react-native'
import CommonListView from '../common/CommonListView'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import * as Communications from 'react-native-communications'
import SendIntentAndroid from 'react-native-send-intent'
import Header from '../common/Header'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import * as Toast from '../common/Toast'
import ScoreShow from '../common/ScoreShow'
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons'

import {
  fetchUserFollowShops,
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
} from '../../action/shopAction'
import dismissKeyboard from 'react-native-dismiss-keyboard'
import KeyboardAwareToolBar from '../common/KeyboardAwareToolBar'
import ToolBarContent from '../shop/ShopCommentReply/ToolBarContent'
import {followUser, unFollowUser, userIsFollowedTheUser, fetchUserFollowees, fetchUsers} from '../../action/authActions'
import {
  selectUserOwnedShopInfo,
  selectShopDetail,
  selectGuessYouLikeShopList,
  selectLatestShopAnnouncemment,
  selectUserIsFollowShop,
  selectShopCommentsTotalCount,
  selectGoodsList,
  selectCommentsForShop
} from '../../selector/shopSelector'
import * as authSelector from '../../selector/authSelector'
import * as configSelector from '../../selector/configSelector'
import {PERSONAL_CONVERSATION} from '../../constants/messageActionTypes'
import ChatroomShopCustomTopView from './ChatroomShopCustomTopView'
import ShopCommentListV2 from './ShopCommentListV2'
import * as AVUtils from '../../util/AVUtils'
import ActionSheet from 'react-native-actionsheet'
import TimerMixin from 'react-timer-mixin'
import Loading from '../common/Loading'
import {DEFAULT_SHARE_DOMAIN} from '../../util/global'
import ShopGoodsList from './ShopGoodsList'
import {CachedImage} from "react-native-img-cache"
import {getThumbUrl} from '../../util/ImageUtil'
import Svg from '../common/Svgs'


const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class ShopDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fade: new Animated.Value(0),
      height: 0,
      showOverlay: false,
      hideBottomView: false,
      comment: undefined,
    }
    this.replyInput = null
    this.isReplying = false
    this.isQuering = false
  }

  componentWillMount() {
    this.isFetchingShopDetail = true
    InteractionManager.runAfterInteractions(()=> {

      this.props.fetchShopDetail({
        id: this.props.id,
        success: () => {
          this.isFetchingShopDetail = false
        },
        error: () => {
          this.isFetchingShopDetail = false
        }
      })

      this.props.getShopGoodsList({
        shopId: this.props.id,
        status: 1,
        limit: 6,
      })

      if (this.props.isUserLogined) {
        this.isFetchingUserIsFollowedShop = true
        this.props.userIsFollowedShop({
          id: this.props.id,
          success: () => {
            this.isFetchingUserIsFollowedShop = false
          },
          error: () => {
            this.isFetchingUserIsFollowedShop = false
          }
        })
      }

      this.refreshData()
    })
  }

  ifHideLoading() {
    if (!this.isFetchingShopDetail && !this.isFetchingUserIsFollowedShop) {
      if (this.loading) {
        Loading.hide(this.loading)
      }
    }
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

  onKeyboardWillShow = (e) => {
  }

  onKeyboardWillHide = (e) => {
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

  userUpShop() {
    if (!this.props.isUserLogined) {
      Actions.LOGIN()
      return
    }
    let payload = {
      id: this.props.id,
      success: function (result) {
        Toast.show(result.message, {duration: 1500})
      },
      error: function (error) {
        Toast.show(error.message, {duration: 1500})
      }
    }
    this.props.userUpShop(payload)
  }

  userUnUpShop() {
    if (!this.props.isUserLogined) {
      Actions.LOGIN()
      return
    }
    let payload = {
      id: this.props.id,
      success: function (result) {
        Toast.show(result.message, {duration: 1500})
      },
      error: function (error) {
        Toast.show(error.message, {duration: 1500})
      }
    }
    this.props.userUnUpShop(payload)
  }

  followShop() {
    if (!this.props.isUserLogined) {
      Actions.LOGIN()
      return
    }
    const that = this
    let payload = {
      id: this.props.id,
      success: function (result) {
        Toast.show(result.message, {duration: 1500})
        that.props.fetchUserFollowShops()
      },
      error: function (error) {
        Toast.show(error.message, {duration: 1500})
      }
    }
    this.props.followShop(payload)
  }

  unFollowShop() {
    if (!this.props.isUserLogined) {
      Actions.LOGIN()
      return
    }
    const that = this
    let payload = {
      id: this.props.id,
      success: function (result) {
        Toast.show(result.message, {duration: 1500})
        that.props.fetchUserFollowShops()
      },
      error: function (error) {
        Toast.show(error.message, {duration: 1500})
      }
    }
    this.props.unFollowShop(payload)
  }

  followUser(userId) {
    if (!this.props.isUserLogined) {
      Actions.LOGIN()
      return
    }
    const that = this
    let payload = {
      userId: userId,
      success: function (result) {
        // that.props.fetchUserFollowees()
        Toast.show(result.message, {duration: 1500})
      },
      error: function (error) {
        Toast.show(error.message, {duration: 1500})
      }
    }
    this.props.followUser(payload)

  }

  unFollowUser(userId) {
    if (!this.props.isUserLogined) {
      Actions.LOGIN()
      return
    }
    const that = this
    let payload = {
      userId: userId,
      success: function (result) {
        // that.props.fetchUserFollowees()
        Toast.show(result.message, {duration: 1500})
      },
      error: function (error) {
        Toast.show(error.message, {duration: 1500})
      }
    }
    this.props.unFollowUser(payload)

  }

  renderRow(rowData, rowId) {
    switch (rowData.type) {
      //   return this.renderNearbyTopic()
      case 'SHOP_INFO':
        return this.renderShopDetail()
      case 'SHOP_COMMENTS':
        return this.renderComments()
      default:
        return <View />
    }
  }

  renderShopDetail() {
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          <TouchableOpacity onPress={()=> {
            this.showShopAlbum()
          }} style={{flex: 1}}>
            <CachedImage mutable style={{width: PAGE_WIDTH, height: normalizeH(300)}}
                         source={{uri: this.props.shopDetail.coverUrl}}>
            </CachedImage>
          </TouchableOpacity>
          {this.state.height < 100 ? this.renderShopLeftHeader() : null}
          {this.state.height < 100 ? this.renderShopRightHeader() : null}

          {this.renderShopAbstract()}
        </View>
        {this.renderOwnerBanner()}
        <View style={styles.shopXYZWrap}>
          <View style={styles.shopXYZLeft}>
            <View style={styles.locationWrap}>
              <TouchableOpacity style={styles.locationContainer} onPress={()=> {
              }}>
                <Image style={styles.locationIcon} source={require('../../assets/images/shop_loaction.png')}/>
                <View style={styles.locationTxtWrap}>
                  <Text style={styles.locationTxt} numberOfLines={2}>{this.props.shopDetail.shopAddress}</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.contactNumberWrap}>
              <TouchableOpacity style={styles.contactNumberContainer} onPress={()=> {
                this.handleServicePhoneCall()
              }}>
                <Image style={styles.contactNumberIcon} source={require('../../assets/images/shop_call.png')}/>
                <View style={styles.contactNumberTxtWrap}>
                  <Text style={styles.contactNumberTxt}
                        numberOfLines={1}>{this.props.shopDetail.contactNumber}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.headerView}>
          <View style={styles.headerItem}>
            <Image source={require('../../assets/images/activity.png')} width={12} height={14}></Image>
            <Text style={styles.headerText} numberOfLines={1}>{'热卖商品'}</Text>
          </View>
        </View>
        <ShopGoodsList shopGoodsList={this.props.goodList} size={6}/>
        <View style={styles.commentWrap}>
          <View style={styles.commentFoot}>
            { this.props.goodList && this.props.goodList.length ? <TouchableOpacity onPress={()=> {
              Actions.SHOP_GOODSLIST_VIEW({
                id: this.props.shopDetail.id,
              })
            }}>
              <Text style={styles.allCommentsLink}>查看全部商品</Text>
            </TouchableOpacity> : <View style={styles.noDataContainer}>
              <Text style={{fontSize: 12, color: '#5A5A5A'}}>暂无商品</Text>
            </View>}
          </View>
        </View>
        <View style={styles.shopAnnouncementWrap}>
          <View style={styles.titleWrap}>
            <View style={styles.titleLine}/>
            <Text style={styles.titleTxt}>店铺公告</Text>
          </View>
          <View style={styles.serviceInfoContainer}>
            <View style={styles.openTime}>
              <Text style={[styles.serviceTxt, styles.serviceLabel]}>营业时间:</Text>
              <Text style={styles.serviceTxt}>{this.props.shopDetail.openTime}</Text>
            </View>
            <View style={styles.shopSpecial}>
              <Text style={[styles.serviceTxt, styles.serviceLabel]}>本店特色:</Text>
              <View style={{flex: 1, paddingRight: 10}}>
                <Text numberOfLines={5} style={styles.serviceTxt}>{this.props.shopDetail.ourSpecial}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }

  makePhoneCall(contactNumber) {
    if (Platform.OS === 'android') {
      SendIntentAndroid.sendPhoneCall(contactNumber)
    } else {
      Communications.phonecall(contactNumber, false)
    }
  }

  userIsFollowedTheUser(userId) {
    let userFollowees = this.props.userFollowees
    if (userFollowees && userFollowees.length) {
      for (let i = 0; i < userFollowees.length; i++) {
        if (userFollowees[i].id == userId) {
          return true
        }
      }
      return false
    }
  }

  openCommentScene() {
    if (!this.props.isUserLogined) {
      Actions.LOGIN()
      return
    }
    Actions.PUBLISH_SHOP_COMMENT({id: this.props.id, shopOwnerId: this.props.shopDetail.owner.id})
  }

  renderOwnerBanner() {
    let avatar = require('../../assets/images/default_portrait.png')
    if (this.props.shopDetail.owner.avatar) {
      avatar = {uri: getThumbUrl(this.props.shopDetail.owner.avatar, 32, 32)}
    }
    return (
      <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
        <View style={styles.ownerWrap}>
          <View style={styles.ownerLeft}>
            <CachedImage style={{marginLeft: normalizeW(15), marginRight: normalizeW(15)}}
                         source={require('../../assets/images/shopkeeper.png')}/>
            <CachedImage mutable source={avatar} style={styles.ownerAvatar}/>
            <Text style={styles.ownerName}>{this.props.shopDetail.owner.nickname}</Text>
          </View>
          <TouchableOpacity onPress={() => this.sendPrivateMessage()}>
            <Svg key={this.props.shopDetail.owner.objectId} style={{marginRight: normalizeW(15)}} size={normalizeH(32)}
                 color="#FF9D4E"
                 icon='service'/>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  onCommentButton(comment) {

      this.setState({
        comment: comment
      })
      this.openModel()

  }

  openModel(callback) {
    if (!this.props.isUserLogined) {
      Actions.LOGIN()
    }
    else {
      this.setState({
        hideBottomView: true
      }, ()=> {
        if (this.replyInput) {
          this.replyInput.focus()
        }
        if (callback && typeof callback == 'function') {
          callback()
        }
      })

    }
  }

  renderComments() {
    if (this.props.shopCommentList && this.props.shopCommentList.length) {
      return (
        <View style={styles.commentWrap}>
          <View style={styles.titleWrap}>
            <View style={styles.titleLine}/>
            <Text style={styles.titleTxt}>留言板·{this.props.shopDetail.commentNum}</Text>
          </View>

          <ShopCommentListV2 viewType='shop'
                             allShopComments={this.props.shopCommentList}
                             commentsArray={this.props.shopCommentIdList}
                             onCommentButton={(payload)=> {
                               this.onCommentButton(payload)
                             }}
          />

        </View>
      )
    } else {
      return (
        <View style={styles.commentWrap}>
          <View style={styles.titleWrap}>
            <View style={styles.titleLine}/>
            <Text style={styles.titleTxt}>留言板·0</Text>
          </View>

          <View style={{
            backgroundColor: 'white',
            padding: 20,
            paddingTop: 30,
            paddingBottom: 30,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Image style={{marginBottom: 20}} source={require('../../assets/images/none_message.png')}/>
            <Text style={{color: '#d8d8d8', fontSize: 15}}>留言墙是空的，快来抢占沙发吧!</Text>
          </View>
        </View>
      )
    }
  }

  showShopAlbum() {
    let album = this.props.shopDetail.album || []
    let allAlbum = [this.props.shopDetail.coverUrl].concat(album)
    // console.log('this.props.shopDetail.album==', this.props.shopDetail.album)
    // ImageGallery.show({
    //   images: allAlbum
    // })
    Actions.SHOP_ALBUM_VIEW({album: allAlbum})
  }

  sendPrivateMessage() {
    if (!this.props.isUserLogined) {
      Actions.LOGIN()
    } else {

      this.props.fetchUsers({userIds: [this.props.shopDetail.owner.id]})

      let payload = {
        name: this.props.shopDetail.owner.nickname,
        members: [this.props.currentUser, this.props.shopDetail.owner.id],
        conversationType: PERSONAL_CONVERSATION,
        title: this.props.shopDetail.shopName,
        customTopView: this.customTopView()
      }
      Actions.CHATROOM(payload)
    }
  }

  customTopView() {
    return (
      <ChatroomShopCustomTopView
        shopInfo={this.props.shopDetail}
      />
    )
  }

  onShare = () => {
    let shareUrl = this.props.shareDomain ? this.props.shareDomain + "shopShare/" + this.props.shopDetail.id + '?userId=' + this.props.currentUser :
    DEFAULT_SHARE_DOMAIN + "shopShare/" + this.props.shopDetail.id + '?userId=' + this.props.currentUser

    Actions.SHARE({
      title: this.props.shopDetail.shopName || "汇邻优店",
      url: shareUrl,
      author: this.props.shopDetail.shopName || "邻家小二",
      abstract: this.props.shopDetail.shopAddress || "未知地址",
      cover: this.props.shopDetail.coverUrl || '',
    })
  }

  handleOnScroll(e) {
    let offset = e.nativeEvent.contentOffset?e.nativeEvent.contentOffset.y:0
    let comHeight = normalizeH(200)
    this.setState({
      height: offset
    })
    if (offset >= 0 && offset < 10) {
      Animated.timing(this.state.fade, {
        toValue: 0,
        duration: 100,
      }).start()
    } else if (offset > 10 && offset < comHeight) {
      Animated.timing(this.state.fade, {
        toValue: (offset - 10) / comHeight,
        duration: 100,
      }).start()
    } else if (offset >= comHeight) {
      Animated.timing(this.state.fade, {
        toValue: 1,
        duration: 100,
      }).start()
    }
  }

  renderShopLeftHeader() {
    return (
      <View style={{
        backgroundColor: 'rgba(0,0,0,0.3)',
        opacity: 30,
        position: 'absolute',
        top: normalizeH(24),
        left: normalizeW(9),
        flex: 1,
        borderRadius: normalizeH(18)
      }}
      >
        <TouchableOpacity onPress={() => {
          AVUtils.pop({
            backSceneName: this.props.backSceneName,
            backSceneParams: this.props.backSceneParams
          })
        }} style={{
          paddingTop: normalizeH(3),
          borderRadius: normalizeH(18),
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.3)',
          width: normalizeW(36),
          height: normalizeH(36),
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Icon name="ios-arrow-back" style={{fontSize: em(28), color: '#FAFAFA'}}/>
        </TouchableOpacity>
      </View>
    )
  }

  renderShopRightHeader() {
    return (
      <View style={{
        backgroundColor: 'rgba(0,0,0,0.3)',
        opacity: 30,
        position: 'absolute',
        top: normalizeH(24),
        left: normalizeW(330),
        flex: 1,
        borderRadius: normalizeH(18),
        width: normalizeW(36),
        height: normalizeH(36)
      }}
      >
        <TouchableOpacity onPress={this.onShare} style={{
          borderRadius: normalizeH(18),
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.3)',
          width: normalizeW(36),
          height: normalizeH(36),
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Icon name="md-more" style={{fontSize: em(28), color: '#FAFAFA'}}/>
        </TouchableOpacity>
      </View>

    )
  }

  renderMainHeader() {
    return (
      <Animated.View style={{
        backgroundColor: THEME.base.mainColor,
        opacity: this.state.fade,
        position: 'absolute',
        top: 0,
        left: 0,
        width: PAGE_WIDTH,
        height: normalizeH(64),
        zIndex: 10,
      }}
      >
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => {
            AVUtils.pop({
              backSceneName: this.props.backSceneName,
              backSceneParams: this.props.backSceneParams
            })
          }}
          title="店铺详情"
          rightComponent={()=> {
            return (
              <TouchableOpacity onPress={this.onShare} style={{marginRight: 10}}>
                <Image source={require('../../assets/images/active_share.png')}/>
              </TouchableOpacity>
            )
          }}
        />
      </Animated.View>
    )
  }

  renderShopTags() {
    let tags = this.props.shopDetail.containedTag
    if (tags && tags.length) {
      let showTags = tags.map((item, key)=> {
        if (key < 5) {
          return <View key={key} style={styles.shopTagBadge}>
            <Text style={styles.shopTagBadgeTxt}>{item.name}</Text>
          </View>
        }
      })
      return <View style={styles.shopTagBox}>
        {showTags }
      </View>
    } else {
      return <View/>
    }


  }

  renderShopAbstract() {
    return (
      <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']} style={{
        position: 'absolute',
        left: 0,
        top: normalizeH(185),
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: PAGE_WIDTH,
        height: normalizeH(115),
        paddingTop: normalizeH(58)
      }}>
        <View style={{flex: 1,marginLeft:normalizeW(15)}}>
          <Text style={styles.shopAbstractName} numberOfLines={1}>{this.props.shopDetail.shopName}</Text>
          {this.renderShopTags()}
        </View>

        <View style={{flexDirection: 'row',width:normalizeW(125),marginRight: normalizeW(15),alignItems:'center',justifyContent:'center'}}>
          {this.renderFollowerNum()}
          {this.renderIsFollow()}
        </View>
      </LinearGradient>
    )
  }

  renderFollowerNum(){
    return(
      <View style={styles.followerNumBox}>
        <Text style={styles.followerNumText}>{this.props.shopDetail.followerNum>999?'999+':this.props.shopDetail.followerNum}</Text>
        <Text style={styles.followerNumText}>粉丝数</Text>
      </View>
    )
  }

  renderIsFollow() {
    if (this.props.isFollowedShop) {
      return (
        <TouchableOpacity style={styles.shopAbstractLikeWrap} onPress={()=> {
          this.unFollowShop()
        }}>
        <Text style={styles.shopAbstractLike}>已关注</Text>
          </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity style={styles.shopAbstractLikeWrap} onPress={()=> {
          this.followShop()
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          <Svg icon='follow_shop' size={normalizeH(25)} color="#FFFFFF"/>
          <Text style={styles.shopAbstractLike}>关注</Text>
        </View>
          </TouchableOpacity>
      )

    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderMainHeader()}
        <View style={{flex:1}}>
          {this.renderDetailContent()}
        </View>
        {this.renderIllegal()}
      </View>
    )
  }

  renderIllegal() {
    let shopDetail = this.props.shopDetail
    if (!this.isFetchingShopDetail && shopDetail && 1 != shopDetail.status) {
      return (
        <View style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'flex-end'
        }}>
          <View style={{
            height: PAGE_HEIGHT * 0.487,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20
          }}>
            <Image style={{marginBottom: 30}} source={require('../../assets/images/sad_105.png')}/>
            <Text style={{marginBottom: 10, fontSize: 17, color: '#5a5a5a'}}>此店铺涉嫌违规，被用户举报</Text>
            <Text style={{
              marginBottom: 10,
              fontSize: 17,
              color: '#5a5a5a',
              textAlign: 'center'
            }}>平台已禁止此店铺显示，如需申诉请联系客服：{this.props.appServicePhone}</Text>

            <TouchableOpacity onPress={()=> {
              Actions.pop()
            }} style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              borderTopWidth: normalizeBorder(),
              borderTopColor: THEME.colors.lighterA,
              backgroundColor: '#fafafa',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 12
            }}>
              <Image style={{marginRight: 23}} source={require('../../assets/images/Shape.png')}/>
              <Text style={{fontSize: 17, color: '#ff7819'}}>退出</Text>
            </TouchableOpacity>

          </View>
        </View>
      )
    }

    return null
  }

  sendReply(content) {
    if (this.isReplying) {
      Toast.show('正在发表评论，请稍后')
      return
    }
    if (!this.props.isUserLogined) {
      Actions.LOGIN()
    } else {
      this.isReplying = true
      this.props.submitShopComment({
        content: content,
        shopId: this.props.id,
        userId: this.props.currentUser,
        replyTo: (this.state.comment && this.state.comment.id) ? this.state.comment.authorId : this.props.shopDetail.owner.id,
        commentId: this.state.comment ? this.state.comment.id : undefined,
        success: () => this.submitSuccessCallback(),
        error: (error) => this.submitErrorCallback(error)
      })
    }
  }

  submitSuccessCallback() {
    this.setState({hideBottomView: false})
    Toast.show('评论成功', {duration: 1000})
    this.refreshData()
    this.isReplying = false
  }

  submitErrorCallback(error) {
    Toast.show(error.message)
    this.isReplying = false
  }

  renderFollowShop() {
    if (this.isSelfShop()) {
      return null
    }

    if (this.props.isFollowedShop) {
      return (
        <TouchableOpacity onPress={this.unFollowShop.bind(this)}>
          <Image source={require('../../assets/images/followed.png')}/>
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity onPress={this.followShop.bind(this)}>
          <Image style={styles.shopAttention} source={require('../../assets/images/add_follow.png')}/>
        </TouchableOpacity>
      )
    }
  }


  loadMoreData(isRefresh) {
    if (this.isQuering) {
      return
    }
    this.isQuering = true
    let lastCommentsCreatedAt = undefined
    if(!isRefresh){
      lastCommentsCreatedAt = this.props.lastCommentsCreatedAt
    }
    let payload = {
      shopId: this.props.id,
      lastCreatedAt: lastCommentsCreatedAt,
      isRefresh: !!isRefresh,
      nowDate: new Date(),
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
    this.props.fetchAllComments(payload)
  }

  refreshData(payload) {
    this.loadMoreData(true)
  }

  renderDetailContent() {
    let shopDetail = this.props.shopDetail
    let selfStyle = {}
    if (this.isSelfShop()) {
      selfStyle = {marginBottom: 0}
    }
    return (
      <View style={{flex: 1}}>
        <View style={[styles.body, selfStyle]}>
          <CommonListView
            name="shopDetail"
            contentContainerStyle={{backgroundColor: '#F5F5F5'}}
            dataSource={this.props.ds}
            renderRow={(rowData, rowId, lazyHost) => this.renderRow(rowData, rowId, lazyHost)}
            loadNewData={()=> {
              this.refreshData()
            }}
            loadMoreData={()=> {
              this.loadMoreData(false)
            }}
            ref={(listView) => this.listView = listView}
            onScroll={e => this.handleOnScroll(e)}
            scrollEventThrottle={80}
          />
        </View>
        {this.state.hideBottomView
          ? null
          : this.renderBottomView()
        }

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
        {this.renderServicePhoneAction()}
      </View>

    )
  }

  handleServicePhoneCall() {
    if (this.ServicePhoneActionSheet) {
      this.ServicePhoneActionSheet.show()
    } else {
      this.makePhoneCall(this.props.shopDetail.contactNumber)
    }
  }

  renderServicePhoneAction() {
    let shopDetail = this.props.shopDetail

    if (shopDetail.contactNumber && shopDetail.contactNumber2) {
      return (
        <ActionSheet
          ref={(o) => this.ServicePhoneActionSheet = o}
          title="客服电话"
          options={[shopDetail.contactNumber, shopDetail.contactNumber2, '取消']}
          cancelButtonIndex={2}
          onPress={this._handleActionSheetPress.bind(this)}
        />
      )
    }
    return null
  }

  _handleActionSheetPress(index) {
    if (0 == index) { //分享
      this.makePhoneCall(this.props.shopDetail.contactNumber)
    } else if (1 == index) { //删除
      this.makePhoneCall(this.props.shopDetail.contactNumber2)
    }
  }

  isSelfShop() {
    if (this.props.userOwnedShopInfo && (this.props.userOwnedShopInfo.id == this.props.shopDetail.id)) {
      return true
    }
    return false
  }

  renderBottomView() {
    if (this.isSelfShop()) {
      return null
    }

    return (
      <View style={styles.shopCommentWrap}>
        <View style={{width: normalizeW(241), flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity style={[styles.shopCommentInputBox]} onPress={()=> {
            this.openCommentScene()
          }}>
            <View style={[styles.vItem]}>
              <Svg size={normalizeH(32)} icon="message"/>
              <Text style={[styles.vItemTxt, styles.shopCommentInput]}>留言</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.shopCommentInputBox]} onPress={()=> {
            this.handleServicePhoneCall()
          }}>
            <View style={[styles.vItem]}>
              <Svg size={normalizeH(32)} icon="call"/>
              <Text style={[styles.vItemTxt, styles.shopCommentInput]}>电话</Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.contactedWrap]} onPress={() => this.sendPrivateMessage()}>
          <Svg size={normalizeH(32)} color="#FFFFFF" icon="service"/>
          <Text style={[styles.contactedTxt]}>联系客服</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let shopDetail = selectShopDetail(state, ownProps.id)
  let latestShopAnnouncement = selectLatestShopAnnouncemment(state, ownProps.id)
  const isUserLogined = authSelector.isUserLogined(state)
  const shopCommentsTotalCount = selectShopCommentsTotalCount(state, ownProps.id)
  let isFollowedShop = false
  let shopCommentList = selectCommentsForShop(state, ownProps.id)
  if (isUserLogined) {
    isFollowedShop = selectUserIsFollowShop(state, ownProps.id)
  }
  let ds = undefined
  if (ownProps.ds) {
    ds = ownProps.ds
  } else {
    ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2,
    })
  }

  let dataArray = []
  dataArray.push({type: 'SHOP_INFO'})
  dataArray.push({type: 'SHOP_COMMENTS'})

  const guessYouLikeList = selectGuessYouLikeShopList(state)

  const userOwnedShopInfo = selectUserOwnedShopInfo(state)
  const appServicePhone = configSelector.selectServicePhone(state)
  const goodList = selectGoodsList(state, ownProps.id, 1)
  let shareDomain = configSelector.getShareDomain(state)
  let lastCommentsCreatedAt = ''
  if (shopCommentList.commentList && shopCommentList.commentList.length) {
    lastCommentsCreatedAt = shopCommentList.commentList[shopCommentList.commentList.length - 1].createdAt
  }
  return {
    goodList: goodList,
    ds: ds.cloneWithRows(dataArray),
    shopDetail: shopDetail,
    latestShopAnnouncement: latestShopAnnouncement,
    guessYouLikeList: guessYouLikeList,
    isUserLogined: isUserLogined,
    isFollowedShop: isFollowedShop,
    shopCommentsTotalCount: shopCommentsTotalCount,
    currentUser: authSelector.activeUserId(state),
    userOwnedShopInfo: userOwnedShopInfo,
    appServicePhone: appServicePhone,
    shareDomain: shareDomain,
    shopCommentList: shopCommentList.commentList,
    shopCommentIdList: shopCommentList.commentIdList,
    lastCommentsCreatedAt: lastCommentsCreatedAt
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchShopDetail,
  fetchShopAnnouncements,
  userIsFollowedShop,
  unFollowShop,
  followShop,
  submitShopComment,
  fetchShopCommentList,
  fetchShopCommentTotalCount,
  followUser,
  unFollowUser,
  userIsFollowedTheUser,
  fetchUserFollowees,
  fetchUserUpShopInfo,
  userUpShop,
  userUnUpShop,
  fetchGuessYouLikeShopList,
  fetchUserFollowShops,
  fetchUsers,
  getShopGoodsList,
  fetchAllComments
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ShopDetail)

Object.assign(ShopDetail.prototype, TimerMixin)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)'
  },

  body: {
    flex: 1,
    marginBottom: normalizeH(50),
  },
  detailWrap: {
    // marginBottom: 54
  },
  contentContainerStyle: {},
  shopHead: {
    flexDirection: 'row',
    padding: 12,
    height: 70,
    backgroundColor: '#fff',
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: THEME.colors.lighterA,
  },
  shopHeadLeft: {
    flex: 1,
    justifyContent: 'space-between'
  },
  shopHeadRight: {
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  shopXYZWrap: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 10
  },
  shopXYZLeft: {
    flex: 1,
  },
  shopXYZRight: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalizeW(14)
  },
  titleWrap: {
    flexDirection: 'row',
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
  shopAttentioned: {},
  shopAttentionedTxt: {
    color: '#fff',
    fontSize: em(14),
  },
  userAttentioned: {},
  userAttentionedTxt: {
    color: '#fff',
    fontSize: em(9),
  },
  shopName: {
    fontSize: em(17),
    color: '#030303'
  },
  shopAbstractName: {
    fontSize: em(17),
    color: '#FFFFFF',
    backgroundColor: 'transparent'
  },
  shopAbstractLike: {
    fontSize: em(14),
    color: '#FFFFFF'
  },
  shopAbstractLikeWrap: {
    height: normalizeH(25),
    width: normalizeW(65),
    borderRadius: normalizeH(12),
    backgroundColor: '#FF9D4E',
    // marginRight: normalizeW(15),
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // marginRight: normalizeW(15)
  },
  shopOtherInfo: {
    flexDirection: 'row'
  },
  score: {
    marginLeft: 5,
    color: '#f5a623',
    fontSize: em(12)
  },
  scoresWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: normalizeW(36)
  },
  scoreIconGroup: {
    width: 62,
    height: 11,
    backgroundColor: '#d8d8d8'
  },
  scoreBackDrop: {
    height: 11,
    backgroundColor: '#f5a623'
  },
  scoreIcon: {
    position: 'absolute',
    left: 0,
    top: 0
  },
  distance: {
    color: '#8F8E94',
    fontSize: em(12),
    marginRight: normalizeW(10)
  },
  pv: {
    marginLeft: normalizeW(14)
  },
  albumWrap: {
    backgroundColor: '#fff'
  },
  locationWrap: {
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff'
  },
  locationContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  locationIcon: {
    marginRight: 10,
  },
  locationTxtWrap: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10
  },
  locationTxt: {
    fontSize: em(17),
    color: '#8f8e94',
  },
  contactNumberWrap: {
    paddingLeft: 10,
    backgroundColor: '#fff'
  },
  contactNumberContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  contactNumberIcon: {
    marginRight: 10,
  },
  contactNumberTxtWrap: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
  },
  contactNumberTxt: {
    fontSize: em(17),
    color: '#8f8e94',
  },
  shopAnnouncementWrap: {
    backgroundColor: 'white',
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20
  },
  shopAnnouncementContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff'
  },
  shopAnnouncementCoverWrap: {
    borderWidth: normalizeBorder(),
    borderColor: THEME.colors.lighterA,
    marginRight: normalizeW(15),
  },
  shopAnnouncementCover: {
    width: 84,
    height: 84
  },
  shopAnnouncementCnt: {
    flex: 1,
    justifyContent: 'space-between'
  },
  shopAnnouncementTitleWrap: {},
  shopAnnouncementTitle: {
    fontSize: em(17),
    color: '#8f8e94',
    lineHeight: em(26)
  },
  shopAnnouncementSubTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  shopAnnouncementIcon: {
    width: 20,
    height: 20,
    marginRight: 5
  },
  shopAnnouncementSubTxt: {
    marginRight: normalizeW(22),
    fontSize: em(12),
    color: '#8f8e94'
  },
  shopAnnouncementBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  shopAnnouncementBadgeIcon: {
    width: normalizeW(65),
    height: normalizeH(20),
    justifyContent: 'center',
    alignItems: 'center'
  },
  shopAnnouncementBadgeTxt: {
    fontSize: em(12),
    color: '#fff'
  },
  commentWrap: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    backgroundColor: '#fff',
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: THEME.colors.lighterA,
  },
  commentHead: {
    justifyContent: 'center',
    paddingTop: normalizeH(10),
    paddingBottom: normalizeH(10),
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: THEME.colors.lighterA,
  },
  commentTitle: {
    fontSize: em(17),
    color: "#8f8e94"
  },
  commentContainer: {
    flexDirection: 'row',
    paddingTop: normalizeH(16),
    paddingBottom: normalizeH(16),
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: THEME.colors.lighterA,
  },
  commentAvatarBox: {
    alignItems: 'center'
  },
  commentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10
  },
  commentAttention: {},
  commentRight: {
    flex: 1,
    paddingLeft: normalizeW(12),
    paddingRight: normalizeW(12)
  },
  commentLine: {
    flex: 1,
  },
  commentHeadLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalizeH(10)
  },
  commentFootLine: {
    marginTop: normalizeH(10)
  },
  commentTitle: {
    fontSize: em(17),
    color: '#8f8e94'
  },
  commentTime: {
    fontSize: em(12),
    color: '#8f8e94'
  },
  comment: {
    fontSize: em(15),
    color: '#8f8e94'
  },
  commentFoot: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: normalizeH(10),
    paddingBottom: normalizeH(10),
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: THEME.colors.lighterA,
  },
  allCommentsLink: {
    fontSize: em(15),
    color: THEME.colors.green
  },
  serviceInfoWrap: {
    marginTop: normalizeW(10),
    paddingLeft: normalizeW(10),
    marginBottom: normalizeW(10),
    backgroundColor: '#fff'
  },
  serviceInfoTitleWrap: {
    paddingTop: normalizeH(15),
    paddingBottom: normalizeH(15),
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: THEME.colors.lighterA,
  },
  serviceInfoTitle: {
    fontSize: em(17),
    color: "#8f8e94"
  },
  serviceInfoContainer: {
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: THEME.colors.lighterA,
  },
  openTime: {
    flexDirection: 'row',
    paddingTop: normalizeH(15)
  },
  shopSpecial: {
    flexDirection: 'row',
    paddingTop: normalizeH(15),
    paddingBottom: normalizeH(15)
  },
  serviceTxt: {
    fontSize: em(17),
    color: "#8f8e94"
  },
  serviceLabel: {
    marginRight: 10
  },
  guessYouLikeWrap: {
    marginBottom: normalizeW(10),
  },
  guessYouLikeTitleWrap: {
    flexDirection: 'row',
    marginTop: normalizeH(10),
    paddingLeft: 20,
    paddingTop: normalizeH(15),
    paddingBottom: normalizeH(15),
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: THEME.colors.lighterA,
    backgroundColor: '#fff',
  },
  guessYouLikeTitle: {
    fontSize: em(15),
    color: "#FF7819"
  },
  shopInfoWrap: {
    flex: 1,
    flexDirection: 'row',
    padding: normalizeW(20),
    paddingBottom: normalizeH(15),
    backgroundColor: '#fff',
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: '#f5f5f5'
  },
  shopInnerIntroWrap: {
    height: normalizeH(80),
  },
  guessYouLikeIntroWrap: {},
  coverWrap: {
    width: normalizeW(80),
    height: normalizeW(80)
  },
  cover: {
    flex: 1
  },
  shopIntroWrap: {
    flex: 1,
    paddingLeft: normalizeW(10),
  },
  gylShopName: {
    fontSize: em(17),
    color: '#8f8e94'
  },
  subInfoWrap: {
    flexDirection: 'row',
  },
  subTxt: {
    marginRight: normalizeW(10),
    color: '#d8d8d8',
    fontSize: em(12)
  },
  guessYouLikeScoresWrap: {
    flex: 1
  },
  shopCommentWrap: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    borderTopWidth: normalizeBorder(),
    borderTopColor: THEME.colors.lighterA,
    backgroundColor: '#fafafa',
    flexDirection: 'row',
  },
  vItem: {
    flex: 1,
    alignSelf: 'flex-start',
    justifyContent: 'space-between',
    alignItems: 'center',
    // padding: 10,
    paddingBottom: normalizeH(3),
    paddingLeft: normalizeW(30),
  },
  vItemTxt: {
    marginTop: 6,
    fontSize: em(10),
    color: '#aaa'
  },
  shopCommentInputBox: {
    // flex: 1,
  },
  contactedWrap: {
    width: normalizeW(135),
    backgroundColor: '#FF9D4E',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  contactedTxt: {
    color: 'white',
    fontSize: em(15),
    marginLeft: normalizeW(9)
  },
  shopCommentInput: {},
  commentBtnWrap: {
    flex: 1
  },
  commentBtnBadgeTxt: {
    fontSize: em(9),
    color: '#fff'
  },
  shopUpWrap: {
    flex: 1,

  },
  shopPromotionWrap: {
    flex: 1,
    marginTop: normalizeH(10),
    borderTopWidth: normalizeBorder(),
    borderTopColor: '#f5f5f5'
  },
  shopPromotionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalizeH(10),
  },
  shopPromotionBadge: {
    backgroundColor: '#F6A623',
    borderRadius: 2,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  shopPromotionBadgeTxt: {
    color: 'white',
    fontSize: em(12)
  },
  shopPromotionContent: {
    flex: 1,
    marginLeft: normalizeW(10)
  },
  shopPromotionContentTxt: {
    color: '#aaaaaa',
    fontSize: em(12)
  },
  headerItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: normalizeH(10),
  },
  headerText: {
    fontSize: em(12),
    color: '#5A5A5A',
    paddingLeft: 5,
  },
  headerView: {
    backgroundColor: THEME.base.backgroundColor,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: normalizeH(42),
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: THEME.colors.lighterA,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // borderBottomWidth: 1,
    // borderBottomColor: '#F5F5F5',
    // height: normalizeH(40),
  },
  ownerWrap: {
    width: normalizeW(360),
    marginTop: normalizeH(10),
    backgroundColor: 'rgba(0,0,0,0.05)',
    flex: 1,
    flexDirection: 'row',
    borderBottomRightRadius: normalizeW(50),
    borderTopRightRadius: normalizeW(50),
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  ownerTitle: {
    marginLeft: normalizeW(15),
    fontSize: em(15),
    color: '#000000',
  },
  ownerAvatar: {
    width: normalizeW(32),
    height: normalizeH(32),
    borderRadius: 15,
    marginLeft: normalizeW(5),
    marginTop: normalizeH(4),
    marginBottom: normalizeH(4)
  },
  ownerName: {
    color: '#000000',
    fontSize: em(15),
    marginLeft: normalizeW(10)

  },
  ownerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerContact: {
    // height: normalizeH(32),
    // width: normalizeW(32),
  },
  shopTagBadge: {
    backgroundColor: 'rgba(245,245,245,0.3)',
    borderRadius: normalizeW(1.5),
    padding: normalizeW(3),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalizeW(6),
  },
  shopTagBadgeTxt: {
    color: '#FFFFFF',
    fontSize: em(11),
  },
  shopTagBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalizeH(3),
    marginBottom: normalizeH(3)
  },
  followerNumBox:{
    // width:normalizeW(65),
    // height:normalizeH(20),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'transparent'
  },
  followerNumText:{
    color: '#FFFFFF',
    alignItems: 'center',
    fontSize: em(10),
    justifyContent: 'center'
  }
})