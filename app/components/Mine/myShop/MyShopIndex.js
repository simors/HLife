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
  TextInput
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import * as Communications from 'react-native-communications'
import SendIntentAndroid from 'react-native-send-intent'
import Header from '../../common/Header'
import ImageGroupViewer from '../../common/Input/ImageGroupViewer'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'
import * as Toast from '../../common/Toast'
import ScoreShow from '../../common/ScoreShow'
import ShopPromotionModule from '../../shop/ShopPromotionModule'

import {fetchUserOwnedShopInfo, fetchShopFollowers, fetchShopFollowersTotalCount, fetchSimilarShopList, fetchShopDetail, fetchGuessYouLikeShopList, fetchShopAnnouncements, userIsFollowedShop, followShop, submitShopComment, fetchShopCommentList, fetchShopCommentTotalCount, userUpShop, userUnUpShop, fetchUserUpShopInfo} from '../../../action/shopAction'
import {followUser, unFollowUser, userIsFollowedTheUser, fetchUserFollowees} from '../../../action/authActions'
import {selectUserOwnedShopInfo, selectShopFollowers, selectShopFollowersTotalCount, selectSimilarShopList, selectShopDetail,selectShopList, selectGuessYouLikeShopList, selectLatestShopAnnouncemment, selectUserIsFollowShop, selectShopComments, selectShopCommentsTotalCount, selectUserIsUpedShop} from '../../../selector/shopSelector'
import * as authSelector from '../../../selector/authSelector'
import ImageGallery from '../../common/ImageGallery'
import {PERSONAL_CONVERSATION} from '../../../constants/messageActionTypes'
import * as numberUtils from '../../../util/numberUtils'
import Icon from 'react-native-vector-icons/Ionicons'
import MyShopPromotionModule from './MyShopPromotionModule'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class MyShopIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible : false
    }
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{
      this.props.fetchUserOwnedShopInfo()
      if(this.props.userOwnedShopInfo.id) {
        this.props.fetchShopFollowers({id: this.props.userOwnedShopInfo.id})
        this.props.fetchShopFollowersTotalCount({id: this.props.userOwnedShopInfo.id})
        this.props.fetchShopCommentList({isRefresh: true, id: this.props.userOwnedShopInfo.id})
        this.props.fetchShopCommentTotalCount({id: this.props.userOwnedShopInfo.id})

        this.props.fetchSimilarShopList({
          id: this.props.userOwnedShopInfo.id,
          targetShopCategoryId: this.props.userOwnedShopInfo.targetShopCategory.id
        })

      }
      if(this.props.isUserLogined) {
        this.props.fetchUserFollowees()
      }
    })
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(()=>{

    })
  }

  componentWillReceiveProps(nextProps) {

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
                    {item &&
                    <Text style={[styles.subTxt]}>{shopTag}</Text>
                    }
                    <View style={{flex:1,flexDirection:'row'}}>
                      <Text style={styles.subTxt}>{item.geoDistrict && item.geoDistrict}</Text>
                    </View>
                    {item.distance &&
                    <Text style={[styles.subTxt]}>{item.distance + item.distanceUnit}</Text>
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

  renderSimilarShops() {
    if(this.props.similarShopList.length) {
      return (
        <View style={styles.guessYouLikeWrap}>
          <View style={styles.guessYouLikeTitleWrap}>
            <Text style={styles.guessYouLikeTitle}>同类店铺</Text>
          </View>
          {this.renderSimilarShopList()}
        </View>
      )
    }
  }

  renderSimilarShopList() {
    let similarShopListView = <View/>
    if(this.props.similarShopList.length) {
      similarShopListView = this.props.similarShopList.map((item, index)=> {
        return (
          <TouchableWithoutFeedback key={"similar_shop_" + index} onPress={()=>{Actions.SHOP_DETAIL({id: item.id})}}>
            <View style={styles.shopInfoWrap}>
              <View style={styles.coverWrap}>
                <Image style={styles.cover} source={{uri: item.coverUrl}}/>
              </View>
              <View style={[styles.shopIntroWrap]}>
                <Text style={styles.gylShopName} numberOfLines={1}>{item.shopName}</Text>
                <ScoreShow
                  score={item.score}
                />
                <View style={styles.subInfoWrap}>
                  {item.pv
                    ? <Text style={styles.subTxt}>{item.pv}人看过</Text>
                    : null
                  }
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        )
      })
    }
    return similarShopListView
  }

  renderComments() {
    if(this.props.shopComments && this.props.shopComments.length) {
      let avatar = require('../../../assets/images/default_portrait.png')

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
            <TouchableOpacity onPress={()=>{Actions.SHOP_COMMENT_LIST({shopId: this.props.shopDetail.id})}}>
              <Text style={styles.allCommentsLink}>查看全部评价</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
  }

  showShopAlbum() {
    let album = this.props.shopDetail.album || []
    let allAlbum = [this.props.shopDetail.coverUrl].concat(album)
    // this.props.shopDetail.album.unshift(this.props.shopDetail.coverUrl)
    // console.log('this.props.shopDetail.album==', this.props.shopDetail.album)
    ImageGallery.show({
      images: allAlbum
    })
  }

  render() {
    // console.log('this.props.shopDetail===', this.props.shopDetail)

    let shopDetail = this.props.shopDetail
    let albumLen = (shopDetail.album && shopDetail.album.length) ? (shopDetail.album.length + 1) : 1

    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="店铺管理"
          rightType="none"
        />
        <View style={styles.body}>
          <View style={styles.detailWrap}>
            <ScrollView
              contentContainerStyle={[styles.contentContainerStyle]}
            >
              <TouchableOpacity onPress={()=>{this.showShopAlbum()}} style={{flex:1}}>
                {this.props.shopDetail.coverUrl
                  ? <Image style={{width:PAGE_WIDTH,height: normalizeH(200)}} source={{uri: this.props.shopDetail.coverUrl}}>
                      <View style={{position:'absolute',right:15,bottom:15,paddingLeft:6,paddingRight:6,backgroundColor:'gray',borderRadius:2,}}>
                        <Text style={{color:'white',fontSize:15}}>{albumLen}</Text>
                      </View>
                    </Image>
                  : <Image style={{width:PAGE_WIDTH,height: normalizeH(200)}} source={require('../../../assets/images/background_shop.png')}/>
                }
              </TouchableOpacity>
              <View style={styles.shopHead}>
                <View style={styles.shopHeadLeft}>
                  <Text style={styles.shopName} numberOfLines={1}>{this.props.shopDetail.shopName}</Text>
                  <View style={styles.shopOtherInfo}>
                    <ScoreShow
                      containerStyle={{flex:1}}
                      score={this.props.shopDetail.score}
                    />
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
                      <Image style={styles.locationIcon} source={require('../../../assets/images/shop_loaction.png')}/>
                      <View style={styles.locationTxtWrap}>
                        <Text style={styles.locationTxt} numberOfLines={2}>{this.props.shopDetail.shopAddress}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.contactNumberWrap}>
                    <TouchableOpacity style={styles.contactNumberContainer} onPress={()=>{this.makePhoneCall(this.props.shopDetail.contactNumber)}}>
                      <Image style={styles.contactNumberIcon} source={require('../../../assets/images/shop_call.png')}/>
                      <View style={styles.contactNumberTxtWrap}>
                        <Text style={styles.contactNumberTxt} numberOfLines={1}>{this.props.shopDetail.contactNumber}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
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

              <TouchableOpacity onPress={()=>{Actions.SHOP_FANS_INDEX({shopId: this.props.shopDetail.id})}}>
                <View style={styles.followersWrap}>
                  <View style={{flexDirection:'row'}}>
                    <View style={styles.titleLine}/>
                    <Text style={styles.titleTxt}>粉丝·{this.props.shopFollowersTotalCount}</Text>
                  </View>
                  <View style={{flexDirection:'row'}}>
                    {this.renderShopFollowers()}
                  </View>
                </View>
              </TouchableOpacity>

              {this.renderComments()}

            </ScrollView>
          </View>

          <View style={styles.shopCommentWrap}>
            <TouchableOpacity style={[styles.shopCommentInputBox]} onPress={()=>{this.editShop()}}>
              <View style={[styles.vItem]}>
                <Image style={{}} source={require('../../../assets/images/shop_edite.png')}/>
                <Text style={[styles.vItemTxt, styles.shopCommentInput]}>编辑店铺</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.contactedWrap]} onPress={() => this.activityManage()}>
              <Image style={{}} source={require('../../../assets/images/activity_edite.png')}/>
              <Text style={[styles.contactedTxt]}>活动管理</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    )
  }

  editShop() {
    if(!this.props.isUserLogined) {
      Actions.LOGIN()
      return
    }
    Actions.EDIT_SHOP()
    // Actions.COMPLETE_SHOP_INFO()
  }

  activityManage() {
    if(!this.props.isUserLogined) {
      Actions.LOGIN()
      return
    }
    Actions.MY_SHOP_PROMOTION_MANAGE_INDEX()
  }

  renderShopFollowers() {
    let shopFollowers = this.props.shopFollowers
    let shopFollowersTotalCount = this.props.shopFollowersTotalCount
    // shopFollowersTotalCount = 5
    // shopFollowers = [{},{},{},{},{}]
    // console.log('shopFollowersTotalCount====', shopFollowersTotalCount)
    // console.log('shopFollowers====', shopFollowers)
    if(shopFollowersTotalCount) {
      let shopFollowersView = shopFollowers.map((item, index)=>{
        if(index > 2) {
          return null
        }
        let source = require('../../../assets/images/default_portrait.png')
        if(item.avatar) {
          source = {uri: item.avatar}
        }

        return (
          <Image
            key={'shop_follower_' + index}
            style={{width:20,height:20,marginRight:5,borderRadius:10}}
            source={source}
          />
        )
      })
      return (
        <View style={{flexDirection:'row',alignItems:'center'}}>
          {shopFollowersView}
          <Icon
            name="ios-arrow-forward"
            style={{marginLeft:6,color:'#8f8e94',fontSize:17}}/>
        </View>
      )
    }
    return (
      <Text style={{color:'#8f8e94'}}>暂无粉丝,赶紧开始推广吧!</Text>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const userOwnedShopInfo = selectUserOwnedShopInfo(state)
  // console.log('userOwnedShopInfo====', userOwnedShopInfo)
  const isUserLogined = authSelector.isUserLogined(state)
  const userFollowees = authSelector.selectUserFollowees(state)

  let shopFollowers = []
  let shopFollowersTotalCount = 0
  let latestShopAnnouncement = {}
  let shopComments = []
  let shopCommentsTotalCount = 0
  let similarShopList = []
  if(userOwnedShopInfo.id) {
    shopFollowers = selectShopFollowers(state, userOwnedShopInfo.id)
    shopFollowersTotalCount = selectShopFollowersTotalCount(state, userOwnedShopInfo.id)
    latestShopAnnouncement = selectLatestShopAnnouncemment(state, userOwnedShopInfo.id)
    shopComments = selectShopComments(state, userOwnedShopInfo.id)
    // console.log('shopComments==***==', shopComments)
    shopCommentsTotalCount = selectShopCommentsTotalCount(state, userOwnedShopInfo.id)
    similarShopList = selectSimilarShopList(state, userOwnedShopInfo.id)
  }
  // console.log('userOwnedShopInfo===', userOwnedShopInfo)
  // console.log('shopFollowers===', shopFollowers)
  // console.log('shopFollowersTotalCount===', shopFollowersTotalCount)

  return {
    shopDetail: userOwnedShopInfo,
    userOwnedShopInfo: userOwnedShopInfo,
    isUserLogined: isUserLogined,
    shopFollowers: shopFollowers,
    shopFollowersTotalCount: shopFollowersTotalCount,
    latestShopAnnouncement: latestShopAnnouncement,
    shopComments: shopComments,
    shopCommentsTotalCount: shopCommentsTotalCount,
    userFollowees: userFollowees,
    similarShopList: similarShopList,
    currentUser: authSelector.activeUserId(state),
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchShopCommentList,
  fetchShopCommentTotalCount,
  fetchUserFollowees,
  fetchGuessYouLikeShopList,
  fetchUserOwnedShopInfo,
  fetchShopFollowers,
  fetchShopFollowersTotalCount,
  fetchSimilarShopList,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MyShopIndex)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)'
  },
  body: {
    marginTop: normalizeH(64),
    flex: 1,
  },
  detailWrap: {
    marginBottom: 54
  },
  contentContainerStyle: {

  },
  followersWrap: {
    flex:1,
    flexDirection:'row',
    padding: 15,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor:'white',
    justifyContent: 'space-between',
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: THEME.colors.lighterA,
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
    paddingRight: 20,
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: THEME.colors.lighterA,
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

  },
  openTime: {
    flexDirection: 'row',
    paddingTop: normalizeH(15)
  },
  shopSpecial: {
    flexDirection: 'row',
    paddingTop: normalizeH(15),
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
    backgroundColor: '#FF7819',
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