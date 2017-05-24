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
  Animated
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import * as Communications from 'react-native-communications'
import SendIntentAndroid from 'react-native-send-intent'
import Header from '../common/Header'
import ImageGroupViewer from '../common/Input/ImageGroupViewer'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import * as Toast from '../common/Toast'
import ScoreShow from '../common/ScoreShow'
import ShopPromotionModule from './ShopPromotionModule'

import {fetchUserFollowShops, fetchUserOwnedShopInfo, fetchShopDetail, fetchGuessYouLikeShopList, fetchShopAnnouncements, userIsFollowedShop, unFollowShop, followShop, submitShopComment, fetchShopCommentList, fetchShopCommentTotalCount, userUpShop, userUnUpShop, fetchUserUpShopInfo} from '../../action/shopAction'
import {followUser, unFollowUser, userIsFollowedTheUser, fetchUserFollowees, fetchUsers} from '../../action/authActions'
import {selectUserOwnedShopInfo, selectShopDetail,selectShopList, selectGuessYouLikeShopList, selectLatestShopAnnouncemment, selectUserIsFollowShop, selectShopComments, selectShopCommentsTotalCount, selectUserIsUpedShop} from '../../selector/shopSelector'
import * as authSelector from '../../selector/authSelector'
import * as configSelector from '../../selector/configSelector'
import Comment from '../common/Comment'
import ImageGallery from '../common/ImageGallery'
import {PERSONAL_CONVERSATION} from '../../constants/messageActionTypes'
import ChatroomShopCustomTopView from './ChatroomShopCustomTopView'

import * as numberUtils from '../../util/numberUtils'
import * as AVUtils from '../../util/AVUtils'
import * as ShopDetailTestData from './ShopDetailTestData'
import ActionSheet from 'react-native-actionsheet'
import TimerMixin from 'react-timer-mixin'
import Loading from '../common/Loading'
import {DEFAULT_SHARE_DOMAIN} from '../../util/global'
import {fetchShareDomain, fetchAppServicePhone} from '../../action/configAction'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class ShopDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible : false,
      fade: new Animated.Value(0),
    }
  }

  componentWillMount() {
    this.isFetchingShopDetail = true
    InteractionManager.runAfterInteractions(()=>{
      this.props.fetchShopDetail({
        id: this.props.id,
        success: () => {
          this.isFetchingShopDetail = false
        },
        error: () => {
          this.isFetchingShopDetail = false
        }
      })
      // this.props.fetchShopAnnouncements({id: this.props.id})

      this.setTimeout(() => {
        this.isFetchingShopCommentList = true
        this.props.fetchShopCommentList({
          isRefresh: true, id: this.props.id,
          success: () => {
            this.isFetchingShopCommentList = false
          },
          error: () => {
            this.isFetchingShopCommentList = false
          }
        })

        this.isFetchingShopCommentTotalCount = true
        this.props.fetchShopCommentTotalCount({
          id: this.props.id,
          success: () => {
            this.isFetchingShopCommentTotalCount = false
          },
          error: () => {
            this.isFetchingShopCommentTotalCount = false
          }
        })

        // this.isFetchingGuessYouLikeShopList = true
        // this.props.fetchGuessYouLikeShopList({
        //   id: this.props.id,
        //   success: () => {
        //     this.isFetchingGuessYouLikeShopList = false
        //   },
        //   error: () => {
        //     this.isFetchingGuessYouLikeShopList = false
        //   }
        // })
      }, 1500)

      if(this.props.isUserLogined) {
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

        this.isFetchingUserFollowees = true
        this.props.fetchUserFollowees({
          success: () => {
            this.isFetchingUserFollowees = false
          },
          error: () => {
            this.isFetchingUserFollowees = false
          }
        })
        // this.props.fetchUserUpShopInfo({id: this.props.id})
        this.isFetchingUserOwnedShopInfo = true
        this.props.fetchUserOwnedShopInfo({
          success: () => {
            this.isFetchingUserOwnedShopInfo = false
          },
          error: () => {
            this.isFetchingUserOwnedShopInfo = false
          }
        })
      }
      this.props.fetchShareDomain()
      // this.props.fetchShopCommentList({id: this.props.shopDetail.id})
    })
  }

  ifHideLoading() {
    if(!this.isFetchingShopDetail && !this.isFetchingUserIsFollowedShop) {
      if(this.loading) {
        Loading.hide(this.loading)
      }
    }
  }

  componentDidMount() {
    this.loading = Loading.show()
    this.setInterval(() => {
      this.ifHideLoading()
    }, 1000)
    // InteractionManager.runAfterInteractions(()=>{
    //   if(!this.props.shopDetail.id) {
    //     this.props.fetchShopDetail({id: this.props.id})
    //   }
    // })
  }

  componentWillReceiveProps(nextProps) {

  }

  userUpShop() {
    if(!this.props.isUserLogined) {
      Actions.LOGIN()
      return
    }
    let payload = {
      id: this.props.id,
      success: function(result) {
        Toast.show(result.message, {duration: 1500})
      },
      error: function(error) {
        Toast.show(error.message, {duration: 1500})
      }
    }
    this.props.userUpShop(payload)
  }

  userUnUpShop() {
    if(!this.props.isUserLogined) {
      Actions.LOGIN()
      return
    }
    let payload = {
      id: this.props.id,
      success: function(result) {
        Toast.show(result.message, {duration: 1500})
      },
      error: function(error) {
        Toast.show(error.message, {duration: 1500})
      }
    }
    this.props.userUnUpShop(payload)
  }

  followShop() {
    if(!this.props.isUserLogined) {
      Actions.LOGIN()
      return
    }
    const that = this
    let payload = {
      id: this.props.id,
      success: function(result) {
        Toast.show(result.message, {duration: 1500})
        that.props.fetchUserFollowShops()
      },
      error: function(error) {
        Toast.show(error.message, {duration: 1500})
      }
    }
    this.props.followShop(payload)
  }

  unFollowShop() {
    if(!this.props.isUserLogined) {
      Actions.LOGIN()
      return
    }
    const that = this
    let payload = {
      id: this.props.id,
      success: function(result) {
        Toast.show(result.message, {duration: 1500})
        that.props.fetchUserFollowShops()
      },
      error: function(error) {
        Toast.show(error.message, {duration: 1500})
      }
    }
    this.props.unFollowShop(payload)
  }

  followUser(userId) {
    if(!this.props.isUserLogined) {
      Actions.LOGIN()
      return
    }
    const that = this
    let payload = {
      userId: userId,
      success: function(result) {
        // that.props.fetchUserFollowees()
        Toast.show(result.message, {duration: 1500})
      },
      error: function(error) {
        Toast.show(error.message, {duration: 1500})
      }
    }
    this.props.followUser(payload)

  }

  unFollowUser(userId) {
    if(!this.props.isUserLogined) {
      Actions.LOGIN()
      return
    }
    const that = this
    let payload = {
      userId: userId,
      success: function(result) {
        // that.props.fetchUserFollowees()
        Toast.show(result.message, {duration: 1500})
      },
      error: function(error) {
        Toast.show(error.message, {duration: 1500})
      }
    }
    this.props.unFollowUser(payload)

  }

  //deprecated
  openModel(callback) {
    this.setState({
      modalVisible: true
    })
    if(callback && typeof callback == 'function'){
      callback()
    }
  }

  //deprecated
  closeModal(callback) {
    this.setState({
      modalVisible: false
    })
    if(callback && typeof callback == 'function'){
      callback()
    }
  }

  //deprecated
  submitComment(commentData) {
    if(!this.props.isUserLogined) {
      Actions.LOGIN()
      return
    }
    const that = this
    let payload = {
      id: this.props.id,
      shopOwnerId: this.props.shopDetail.owner.id,
      ...commentData,
      success: () => {
        that.props.fetchShopCommentList({isRefresh: true, id: that.props.id})
        that.props.fetchShopCommentTotalCount({id: that.props.id})
        that.closeModal(()=>{
          Toast.show('发布成功', {duration: 1000})
        })
      },
      error: (err) => {
        that.closeModal(()=>{
          Toast.show(err.message, {duration: 1000})
        })
      }
    }
    this.props.submitShopComment(payload)
  }

  makePhoneCall(contactNumber) {
    if(Platform.OS === 'android') {
      SendIntentAndroid.sendPhoneCall(contactNumber)
    }else {
      Communications.phonecall(contactNumber, false)
    }
  }

  gotoShopDetailScene(id) {
    Actions.SHOP_DETAIL({id: id})
  }

  renderGuessYouLikeList() {
    let guessYouLikeView = <View/>
    if(this.props.guessYouLikeList.length) {
      guessYouLikeView = this.props.guessYouLikeList.map((item, index)=> {
        // console.log('renderGuessYouLikeList.item***====', item)
        let shopTag = null
        if(item.containedTag && item.containedTag.length) {
          shopTag = item.containedTag[0].name
        }
        return (
          <TouchableOpacity key={'gyl_'+ index} onPress={()=>{this.gotoShopDetailScene(item.id)}}>
            <View style={[styles.shopInfoWrap]}>
              <View style={styles.coverWrap}>
                <Image style={styles.cover} source={{uri: item.coverUrl}}/>
              </View>
              <View style={styles.shopIntroWrap}>
                <View style={styles.shopInnerIntroWrap}>
                  <Text style={styles.shopName} numberOfLines={1}>{item.shopName}</Text>
                  <ScoreShow
                    containerStyle={{flex:1}}
                    score={item.score}
                  />
                  <View style={styles.subInfoWrap}>
                    {shopTag 
                      ? <Text style={[styles.subTxt]}>{shopTag}</Text>
                      : null
                    }
                    <View style={{flex:1,flexDirection:'row'}}>
                      <Text style={styles.subTxt}>{item.geoDistrict && item.geoDistrict}</Text>
                    </View>
                    {item.distance 
                      ? <Text style={[styles.subTxt]}>{item.distance + item.distanceUnit}</Text>
                      : null
                    }
                  </View>
                </View>
                {this.renderShopPromotion(item)}
              </View>
            </View>
          </TouchableOpacity>
        )
      })
    }
    return guessYouLikeView
  }

  renderShopPromotion(shopInfo) {
    // console.log('renderShopPromotion.shopInfo=**********==', shopInfo)
    let containedPromotions = shopInfo.containedPromotions
    if(containedPromotions && containedPromotions.length) {
      let shopPromotionView = containedPromotions.map((promotion, index)=>{
        return (
          <View key={'promotion_' + index} style={styles.shopPromotionBox}>
            <View style={styles.shopPromotionBadge}>
              <Text style={styles.shopPromotionBadgeTxt}>{promotion.type}</Text>
            </View>
            <View style={styles.shopPromotionContent}>
              <Text numberOfLines={1} style={styles.shopPromotionContentTxt}>{promotion.typeDesc}</Text>
            </View>
          </View>
        )
      })
      return (
        <View style={styles.shopPromotionWrap}>
          {shopPromotionView}
        </View>
      )
    }
    return null
  }

  renderGuessYouLike() {
    if(this.props.guessYouLikeList.length) {
      return (
        <View style={styles.guessYouLikeWrap}>
          <View style={styles.guessYouLikeTitleWrap}>
            <View style={styles.titleLine}/>
            <Text style={styles.guessYouLikeTitle}>猜你喜欢</Text>
          </View>
          {this.renderGuessYouLikeList()}
        </View>
      )
    }
  }

  userIsFollowedTheUser(userId) {
    let userFollowees = this.props.userFollowees
    if(userFollowees && userFollowees.length) {
      for(let i = 0; i < userFollowees.length; i++) {
        if(userFollowees[i].id == userId) {
          return true
        }
      }
      return false
    }
  }

  openCommentScene() {
    if(!this.props.isUserLogined) {
      Actions.LOGIN()
      return
    }
    Actions.PUBLISH_SHOP_COMMENT({id: this.props.id, shopOwnerId: this.props.shopDetail.owner.id})
  }

  renderComments() {
    if(this.props.shopComments && this.props.shopComments.length) {
      let avatar = require('../../assets/images/default_portrait.png')

      const commentsView = this.props.shopComments.map((item, index) => {
        if(index > 2) return
        if(item.user.avatar) {
          avatar = {uri: item.user.avatar}
        }
        return (
          <View key={"shop_comment_" + index} style={styles.commentContainer}>
            <View style={styles.commentAvatarBox}>
              <TouchableOpacity onPress={()=>{Actions.PERSONAL_HOMEPAGE({userId: item.user.id})}}>
                <Image style={styles.commentAvatar} source={avatar}/>
              </TouchableOpacity>
            </View>
            <View style={styles.commentRight}>
              <TouchableOpacity onPress={()=>{Actions.PERSONAL_HOMEPAGE({userId: item.user.id})}}>
                <View style={[styles.commentLine, styles.commentHeadLine]}>
                  <Text style={styles.commentTitle}>{item.user.nickname}</Text>
                  <Text style={styles.commentTime}>{item.createdDate}</Text>
                </View>
              </TouchableOpacity>
              <View style={[styles.commentLine, {marginBottom: 10}]}>
                <ScoreShow score={item.score} />
              </View>
              <View style={[styles.commentLine, {marginBottom: 10}]}>
                <Text numberOfLines={2} style={styles.comment}>{item.content}</Text>
              </View>

              {
                item.blueprints && item.blueprints.length
                  ? <View style={[styles.commentLine, {marginBottom: 10}]}>
                      <ImageGroupViewer
                        images={item.blueprints}
                        containerStyle={{marginLeft:0,marginRight:0}}
                        imageStyle={{margin:0,marginRight:2}}
                      />
                    </View>
                  : null
              }
            </View>
          </View>
        )
      })

      return (
        <View style={styles.commentWrap}>
          <View style={styles.titleWrap}>
            <View style={styles.titleLine}/>
            <Text style={styles.titleTxt}>邻友点评·{this.props.shopCommentsTotalCount}</Text>
          </View>

          {commentsView}

          <View style={styles.commentFoot}>
            <TouchableOpacity onPress={()=>{Actions.SHOP_COMMENT_LIST({shopId: this.props.id})}}>
              <Text style={styles.allCommentsLink}>查看全部评价</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }else{
      return (
        <View style={styles.commentWrap}>
          <View style={styles.titleWrap}>
            <View style={styles.titleLine}/>
            <Text style={styles.titleTxt}>邻友点评·0</Text>
          </View>

          <View style={{backgroundColor:'white',padding:20,paddingTop:30,paddingBottom:30,justifyContent:'center',alignItems:'center'}}>
            <Image style={{marginBottom:20}} source={require('../../assets/images/none_message.png')}/>
            <Text style={{color:'#d8d8d8',fontSize:15}}>留言墙是空的，快来抢占沙发吧!</Text>
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

  renderShopAnnouncement(){
    let announcementCover = {uri: this.props.latestShopAnnouncement.coverUrl}
    return (
      <View style={styles.shopAnnouncementContainer}>
        <View style={styles.shopAnnouncementCoverWrap}>
          <Image style={styles.shopAnnouncementCover} source={announcementCover}/>
        </View>
        <View style={styles.shopAnnouncementCnt}>
          <View style={styles.shopAnnouncementTitleWrap}>
            <Text numberOfLines={3} style={styles.shopAnnouncementTitle}>
              {this.props.latestShopAnnouncement.content}
            </Text>
          </View>
        </View>
      </View>
    )
  }

  onShare = () => {
    let shareUrl = this.props.shareDomain? this.props.shareDomain + "shopShare/" + this.props.shopDetail.id:
      DEFAULT_SHARE_DOMAIN + "shopShare/" + this.props.shopDetail.id

    console.log("shopShare url:", shareUrl)

    Actions.SHARE({
      title: this.props.shopDetail.shopName || "汇邻优店",
      url: shareUrl,
      author: this.props.shopDetail.shopName || "邻家小二",
      abstract: this.props.shopDetail.shopAddress || "未知地址",
      cover: this.props.shopDetail.coverUrl || '',
    })
  }

  handleOnScroll(e) {
    let offset = e.nativeEvent.contentOffset.y
    let comHeight = normalizeH(200)
    if (offset >= 0 && offset < 10) {
      Animated.timing(this.state.fade, {
        toValue: 0,
        duration: 100,
      }).start()
    } else if (offset > 10 && offset < comHeight) {
      Animated.timing(this.state.fade, {
        toValue: (offset - 10)/comHeight,
        duration: 100,
      }).start()
    } else if (offset >= comHeight) {
      Animated.timing(this.state.fade, {
        toValue: 1,
        duration: 100,
      }).start()
    }
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
          rightComponent={()=>{
            return (
              <TouchableOpacity onPress={this.onShare} style={{marginRight:10}}>
                <Image source={require('../../assets/images/active_share.png')}/>
              </TouchableOpacity>
            )
          }}
        />
      </Animated.View>
    )
  }

  render() {
    // console.log('this.props.shopDetail===', this.props.shopDetail)

    let shopDetail = this.props.shopDetail

    return (
      <View style={styles.container}>
        {this.renderMainHeader()}
        <View style={styles.body}>
          {this.renderDetailContent()}
        </View>
        {this.renderIllegal()}
      </View>
    )
  }

  renderIllegal() {
    let shopDetail = this.props.shopDetail
    // console.log('renderIllegal.this.isFetchingShopDetail===', this.isFetchingShopDetail)
    if(!this.isFetchingShopDetail && shopDetail && 1 != shopDetail.status) {
      return (
        <View style={{position:'absolute',left:0,right:0,bottom:0,top:0,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'flex-end'}}>
          <View style={{height:PAGE_HEIGHT*0.487, backgroundColor: 'white',justifyContent:'center',alignItems:'center',padding:20}}>
            <Image style={{marginBottom:30}} source={require('../../assets/images/sad_105.png')}/>
            <Text style={{marginBottom:10,fontSize:17,color:'#5a5a5a'}}>此店铺涉嫌违规，被用户举报</Text>
            <Text style={{marginBottom:10,fontSize:17,color:'#5a5a5a',textAlign:'center'}}>平台已禁止此店铺显示，如需申诉请联系客服：{this.props.appServicePhone}</Text>

              <TouchableOpacity onPress={()=>{Actions.pop()}} style={{
                position:'absolute',
                left:0,
                right:0,
                bottom:0,
                borderTopWidth:normalizeBorder(),
                borderTopColor: THEME.colors.lighterA,
                backgroundColor:'#fafafa',
                flexDirection:'row',
                justifyContent:'center',
                alignItems:'center',
                padding:12
              }}>
                <Image style={{marginRight:23}} source={require('../../assets/images/Shape.png')}/>
                <Text style={{fontSize:17,color:'#ff7819'}}>退出</Text>
              </TouchableOpacity>
            
          </View>
        </View>
      )
    }

    return null
  }

  renderFollowShop() {
    if(this.isSelfShop()) {
      return null
    }

    if(this.props.isFollowedShop) {
      return (
        <TouchableOpacity onPress={this.unFollowShop.bind(this)}>
          <Image source={require('../../assets/images/followed.png')} />
        </TouchableOpacity>
      )
    }else {
      return (
        <TouchableOpacity onPress={this.followShop.bind(this)}>
          <Image style={styles.shopAttention} source={require('../../assets/images/add_follow.png')}/>
        </TouchableOpacity>
      )
    }
  }

  renderDetailContent() {
    let shopDetail = this.props.shopDetail

    let detailWrapStyle = {}
    if(!this.isSelfShop()) {
      detailWrapStyle = styles.detailWrap
    }

    let albumLen = (shopDetail.album && shopDetail.album.length) ? (shopDetail.album.length + 1) : 1

    return (
      <View style={{flex:1}}>
        <View style={detailWrapStyle}>
          <ScrollView
            contentContainerStyle={[styles.contentContainerStyle]}
            onScroll={e => this.handleOnScroll(e)}
          >
            <TouchableOpacity onPress={()=>{this.showShopAlbum()}} style={{flex:1}}>
              <Image style={{width:PAGE_WIDTH,height: normalizeH(200)}} source={{uri: this.props.shopDetail.coverUrl}}>
                <View style={{position:'absolute',right:15,bottom:15,padding:3,paddingLeft:6,paddingRight:6,backgroundColor:'gray',borderRadius:2,}}>
                  <Text style={{color:'white',fontSize:15}}>{albumLen}</Text>
                </View>
              </Image>
            </TouchableOpacity>
            <View style={styles.shopHead}>
              <View style={styles.shopHeadLeft}>
                <Text style={styles.shopName} numberOfLines={1}>{this.props.shopDetail.shopName}</Text>
                <View style={styles.shopOtherInfo}>
                  <ScoreShow
                    containerStyle={{flex:1}}
                    score={this.props.shopDetail.score}
                  />
                  {this.props.shopDetail.distance &&
                  <Text style={styles.distance}>距你{this.props.shopDetail.distance + this.props.shopDetail.distanceUnit}</Text>
                  }
                  {this.props.shopDetail.pv
                    ? <Text style={[styles.distance, styles.pv]}>{this.props.shopDetail.pv}人看过</Text>
                    : null
                  }
                </View>
              </View>
            </View>

            <View style={styles.shopXYZWrap}>
              <View style={styles.shopXYZLeft}>
                <View style={styles.locationWrap}>
                  <TouchableOpacity style={styles.locationContainer} onPress={()=>{}}>
                    <Image style={styles.locationIcon} source={require('../../assets/images/shop_loaction.png')}/>
                    <View style={styles.locationTxtWrap}>
                      <Text style={styles.locationTxt} numberOfLines={2}>{this.props.shopDetail.shopAddress}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.contactNumberWrap}>
                  <TouchableOpacity style={styles.contactNumberContainer} onPress={()=>{this.handleServicePhoneCall()}}>
                    <Image style={styles.contactNumberIcon} source={require('../../assets/images/shop_call.png')}/>
                    <View style={styles.contactNumberTxtWrap}>
                      <Text style={styles.contactNumberTxt} numberOfLines={1}>{this.props.shopDetail.contactNumber}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.shopXYZRight}>
                {this.renderFollowShop()}
              </View>
            </View>

            <ShopPromotionModule
              title="近期活动"
              noDistance={true}
              shopPromotionList={this.props.shopDetail.containedPromotions}
            />

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
                  <View style={{flex:1, paddingRight:10}}>
                    <Text numberOfLines={5} style={styles.serviceTxt}>{this.props.shopDetail.ourSpecial}</Text>
                  </View>
                </View>
              </View>
            </View>

            {this.renderComments()}

            {/*{this.renderGuessYouLike()}*/}

          </ScrollView>
        </View>

        {this.renderBottomView()}

        <Comment
          modalVisible={this.state.modalVisible}
          modalTitle="写评论"
          closeModal={() => this.closeModal()}
          submitComment={this.submitComment.bind(this)}
        />

        {this.renderServicePhoneAction()}
      </View>
      
    )
  }

  handleServicePhoneCall() {
    if(this.ServicePhoneActionSheet) {
      this.ServicePhoneActionSheet.show()
    }else{
      this.makePhoneCall(this.props.shopDetail.contactNumber)
    }
  }

  renderServicePhoneAction() {
    let shopDetail = this.props.shopDetail

    if(shopDetail.contactNumber && shopDetail.contactNumber2) {
      return (
        <ActionSheet
          ref={(o) => this.ServicePhoneActionSheet = o}
          title="客服电话"
          options={[shopDetail.contactNumber, shopDetail.contactNumber2,'取消']}
          cancelButtonIndex={2}
          onPress={this._handleActionSheetPress.bind(this)}
        />
      )
    }
    return null
  }

  _handleActionSheetPress(index) {
    if(0 == index) { //分享
      this.makePhoneCall(this.props.shopDetail.contactNumber)
    }else if(1 == index) { //删除
      this.makePhoneCall(this.props.shopDetail.contactNumber2)
    }
  }

  isSelfShop() {
    if(this.props.userOwnedShopInfo && (this.props.userOwnedShopInfo.id == this.props.shopDetail.id)) {
      return true
    }
    return false
  }

  renderBottomView() {
    if(this.isSelfShop()) {
      return null
    }

    return (
      <View style={styles.shopCommentWrap}>
        <TouchableOpacity style={[styles.shopCommentInputBox]} onPress={()=>{this.openCommentScene()}}>
          <View style={[styles.vItem]}>
            <Image style={{}} source={require('../../assets/images/message.png')}/>
            <Text style={[styles.vItemTxt, styles.shopCommentInput]}>点评</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.contactedWrap]} onPress={() => this.sendPrivateMessage()}>
          <Image style={{}} source={require('../../assets/images/contacted.png')}/>
          <Text style={[styles.contactedTxt]}>私信</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let shopDetail = selectShopDetail(state, ownProps.id)
  // console.log('shopDetail=====>>>>>>', shopDetail)
  let latestShopAnnouncement = selectLatestShopAnnouncemment(state, ownProps.id)
  // const shopList = selectShopList(state) || []
  const isUserLogined = authSelector.isUserLogined(state)
  const shopComments = selectShopComments(state, ownProps.id)
  const shopCommentsTotalCount = selectShopCommentsTotalCount(state, ownProps.id)
  let isFollowedShop = false
  if(isUserLogined) {
    isFollowedShop = selectUserIsFollowShop(state, ownProps.id)
  }
  

  // const userFollowees = authSelector.selectUserFollowees(state)

  // const userIsUpedShop = selectUserIsUpedShop(state, ownProps.id)

  const guessYouLikeList = selectGuessYouLikeShopList(state)

  const userOwnedShopInfo = selectUserOwnedShopInfo(state)

  const appServicePhone = configSelector.selectServicePhone(state)

  let shareDomain = configSelector.getShareDomain(state)

  // let shopDetail = ShopDetailTestData.shopDetail
  // const shopComments = ShopDetailTestData.shopComments
  // const shopCommentsTotalCount = 1368
  // let latestShopAnnouncement = ShopDetailTestData.latestShopAnnouncement
  // const shopList = ShopDetailTestData.shopList
  // const isUserLogined = true
  // const isFollowedShop = true

  // if(shopList.length > 3) {
  //   shopList.splice(0, shopList.length-3)
  // }

  return {
    shopDetail: shopDetail,
    latestShopAnnouncement: latestShopAnnouncement,
    guessYouLikeList: guessYouLikeList,
    isUserLogined: isUserLogined,
    isFollowedShop: isFollowedShop,
    shopComments: shopComments,
    shopCommentsTotalCount: shopCommentsTotalCount,
    // userFollowees: userFollowees,
    // userIsUpedShop: userIsUpedShop,
    currentUser: authSelector.activeUserId(state),
    userOwnedShopInfo: userOwnedShopInfo,
    appServicePhone: appServicePhone,
    shareDomain: shareDomain,
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
  fetchUserOwnedShopInfo,
  fetchAppServicePhone,
  fetchUserFollowShops,
  fetchUsers,
  fetchShareDomain
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ShopDetail)

Object.assign(ShopDetail.prototype, TimerMixin)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)'
  },
  body: {
    // marginTop: normalizeH(64),
    flex: 1,
  },
  detailWrap: {
    marginBottom: 54
  },
  contentContainerStyle: {

  },
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
  shopAttentioned: {

  },
  shopAttentionedTxt: {
    color: '#fff',
    fontSize: em(14),
  },
  userAttentioned: {
    
  },
  userAttentionedTxt: {
    color: '#fff',
    fontSize: em(9),
  },
  shopName: {
    fontSize: em(17),
    color: '#030303'
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
    width:84,
    height: 84
  },
  shopAnnouncementCnt: {
    flex: 1,
    justifyContent: 'space-between'
  },
  shopAnnouncementTitleWrap: {

  },
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
    backgroundColor: '#fff'
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
  commentAttention: {

  },
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
    alignItems: 'center',
    paddingTop: normalizeH(10),
    paddingBottom: normalizeH(10),
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
    padding: 20,
    paddingBottom:15,
    backgroundColor: '#fff',
    borderBottomWidth:normalizeBorder(),
    borderBottomColor: '#f5f5f5'
  },
  shopInnerIntroWrap: {
    height: 80,
  },
  guessYouLikeIntroWrap: {

  },
  coverWrap: {
    width: 80,
    height: 80
  },
  cover: {
    flex: 1
  },
  shopIntroWrap: {
    flex: 1,
    paddingLeft: 10,
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
    position:'absolute',
    left:0,
    bottom:0,
    borderTopWidth:normalizeBorder(),
    borderTopColor: THEME.colors.lighterA,
    backgroundColor:'#fafafa',
    flexDirection:'row',
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
    marginTop: 6,
    fontSize: em(10),
    color: '#aaa'
  },
  shopCommentInputBox: {
    flex: 1,
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
  shopCommentInput:{

  },
  commentBtnWrap: {
    flex: 1
  },
  commentBtnBadge:{
    alignItems: 'center',
    width: 30,
    backgroundColor:'#FF9D4E',
    position:'absolute',
    right:10,
    top:6,
    borderRadius:10,
    borderWidth:normalizeBorder(),
    borderColor: '#FF9D4E'
  },
  commentBtnBadgeTxt:{
    fontSize: em(9),
    color: '#fff'
  },
  shopUpWrap:{
    flex: 1,

  },
  shopPromotionWrap: {
    flex: 1,
    marginTop: 10,
    borderTopWidth:normalizeBorder(),
    borderTopColor: '#f5f5f5'
  },
  shopPromotionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  shopPromotionBadge: {
    backgroundColor: '#F6A623',
    borderRadius: 2,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  shopPromotionBadgeTxt: {
    color:'white',
    fontSize: em(12)
  },
  shopPromotionContent: {
    flex: 1,
    marginLeft: 10
  },
  shopPromotionContentTxt: {
    color: '#aaaaaa',
    fontSize: em(12)
  },
})