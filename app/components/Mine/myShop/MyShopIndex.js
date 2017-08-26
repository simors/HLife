/**
 * Created by zachary on 2016/12/13.
 */
import React, {Component} from 'react'
import {CachedImage} from "react-native-img-cache"
import {getThumbUrl} from '../../../util/ImageUtil'
import ShopCommentList from '../../shop/ShopCommentList'
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
} from 'react-native'
import ShopCommentListV2 from '../../shop/ShopCommentListV2'
import CommonListView from '../../common/CommonListView'

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
import ShopGoodsList from '../../shop/ShopGoodsList'
import Svg from '../../common/Svgs'
import {
  fetchUserOwnedShopInfo,
  fetchShopFollowers,
  fetchShopFollowersTotalCount,
  fetchSimilarShopList,
  fetchAllComments,
  fetchShopDetail,
  fetchGuessYouLikeShopList,
  fetchShopAnnouncements,
  userIsFollowedShop,
  followShop,
  submitShopComment,
  fetchShopCommentList,
  fetchShopCommentTotalCount,
  userUpShop,
  userUnUpShop,
  fetchUserUpShopInfo,
  getShopGoodsList,
} from '../../../action/shopAction'
import {followUser, unFollowUser, userIsFollowedTheUser, fetchUserFollowees} from '../../../action/authActions'
import {
  selectUserOwnedShopInfo,
  selectShopFollowers,
  selectCommentsForShop,
  selectShopFollowersTotalCount,
  selectSimilarShopList,
  selectShopDetail,
  selectShopList,
  selectGuessYouLikeShopList,
  selectLatestShopAnnouncemment,
  selectUserIsFollowShop,
  selectShopComments,
  selectShopCommentsTotalCount,
  selectUserIsUpedShop,
  selectGoodsList
} from '../../../selector/shopSelector'
import * as authSelector from '../../../selector/authSelector'
import ImageGallery from '../../common/ImageGallery'
import {PERSONAL_CONVERSATION} from '../../../constants/messageActionTypes'
import * as numberUtils from '../../../util/numberUtils'
import Icon from 'react-native-vector-icons/Ionicons'
import MyShopPromotionModule from './MyShopPromotionModule'
import {getShareUrl, fetchShareDomain} from '../../../action/configAction'
import ActionSheet from 'react-native-actionsheet'
import {DEFAULT_SHARE_DOMAIN} from '../../../util/global'
import {getShareDomain} from '../../../selector/configSelector'
import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Ionicons'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class MyShopIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      fade: new Animated.Value(0),
    }
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=> {
      // lastUpdateTime: payload.lastUpdateTime,})
      this.props.fetchUserOwnedShopInfo()   // 已在组件外获取了店铺信息，不需要重新获取
      if (this.props.userOwnedShopInfo.id) {
        this.props.getShopGoodsList({shopId: this.props.userOwnedShopInfo.id, status: 1, limit: 6, more: false})
        this.props.fetchShopFollowers({id: this.props.userOwnedShopInfo.id})
        this.props.fetchShopFollowersTotalCount({id: this.props.userOwnedShopInfo.id})
        // this.props.fetchShopCommentList({isRefresh: true, id: this.props.userOwnedShopInfo.id})
        this.refreshData()
        // this.props.fetchSimilarShopList({
        //   id: this.props.userOwnedShopInfo.id,
        //   targetShopCategoryId: this.props.userOwnedShopInfo.targetShopCategory.id
        // })

      }
      if (this.props.isUserLogined) {
        this.props.fetchUserFollowees()
      }
      this.props.fetchShareDomain()
    })
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(()=> {

    })
  }

  componentWillReceiveProps(nextProps) {

  }


  gotoShopDetailScene(id) {
    Actions.SHOP_DETAIL({id: id})
  }

  renderGuessYouLikeList() {
    let guessYouLikeView = <View/>
    if (this.props.guessYouLikeList.length) {
      guessYouLikeView = this.props.guessYouLikeList.map((item, index)=> {
        // console.log('renderGuessYouLikeList.item***====', item)
        let shopTag = null
        if (item.containedTag && item.containedTag.length) {
          shopTag = item.containedTag[0].name
        }
        return (
          <TouchableOpacity key={'gyl_' + index} onPress={()=> {
            this.gotoShopDetailScene(item.id)
          }}>
            <View style={[styles.shopInfoWrap]}>
              <View style={styles.coverWrap}>
                <Image style={styles.cover} source={{uri: item.coverUrl}}/>
              </View>
              <View style={styles.shopIntroWrap}>
                <View style={styles.shopInnerIntroWrap}>
                  <Text style={styles.shopName} numberOfLines={1}>{item.shopName}</Text>
                  <ScoreShow
                    containerStyle={{flex: 1}}
                    score={item.score}
                  />
                  <View style={styles.subInfoWrap}>
                    {item &&
                    <Text style={[styles.subTxt]}>{shopTag}</Text>
                    }
                    <View style={{flex: 1, flexDirection: 'row'}}>
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
    if (containedPromotions && containedPromotions.length) {
      let shopPromotionView = containedPromotions.map((promotion, index)=> {
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
    if (this.props.guessYouLikeList.length) {
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
    if (this.props.similarShopList.length) {
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
    if (this.props.similarShopList.length) {
      similarShopListView = this.props.similarShopList.map((item, index)=> {
        return (
          <TouchableWithoutFeedback key={"similar_shop_" + index} onPress={()=> {
            Actions.SHOP_DETAIL({id: item.id})
          }}>
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

  onCommentButton() {
    Toast.show('不允许评论自己的店铺')
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
            <Image style={{marginBottom: 20}} source={require('../../../assets/images/none_message.png')}/>
            <Text style={{color: '#d8d8d8', fontSize: 15}}>留言墙是空的，快来抢占沙发吧!</Text>
          </View>
        </View>
      )
    }
  }

  loadMoreData(isRefresh) {
    if (this.isQuering) {
      return
    }
    this.isQuering = true

    let payload = {
      shopId: this.props.shopDetail.id,
      lastCreatedAt: this.props.lastCommentsCreatedAt,
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

  showGoodDetail(value) {
    Actions.SHOP_GOODS_DETAIL({
      goodInfo: value,

    })
  }


  showShopAlbum() {
    let album = this.props.shopDetail.album || []
    let allAlbum = [this.props.shopDetail.coverUrl].concat(album)
    // this.props.shopDetail.album.unshift(this.props.shopDetail.coverUrl)
    // console.log('this.props.shopDetail.album==', this.props.shopDetail.album)
    // ImageGallery.show({
    //   images: allAlbum
    // })
    Actions.SHOP_ALBUM_VIEW({album: allAlbum})
  }

  onShare = () => {
    let shareUrl = this.props.shareDomain ? this.props.shareDomain + "shopShare/" + this.props.userOwnedShopInfo.id + '?userId=' + this.props.currentUser :
    DEFAULT_SHARE_DOMAIN + "shopShare/" + this.props.userOwnedShopInfo.id + '?userId=' + this.props.currentUser

    Actions.SHARE({
      title: this.props.userOwnedShopInfo.shopName || "汇邻优店",
      url: shareUrl,
      author: this.props.userOwnedShopInfo.shopName || "邻家小二",
      abstract: this.props.userOwnedShopInfo.shopAddress || "未知地址",
      cover: this.props.userOwnedShopInfo.coverUrl || '',
    })
  }

  renderShopTags() {
    let tags = this.props.shopDetail.containedTag
    if (tags && tags.length) {
      let showTags = tags.map((item, key)=> {
        if (key < 5) {
          return <View style={styles.shopTagBadge}>
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
          leftPress={() => Actions.pop()}
          title="店铺管理"
          rightComponent={()=> {
            return (
              <TouchableOpacity onPress={this.onShare} style={{marginRight: 10}}>
                <Image source={require('../../../assets/images/active_share.png')}/>
              </TouchableOpacity>
            )
          }}
        />
      </Animated.View>
    )
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
        paddingTop: normalizeH(64)
      }}>
        <View style={{flex: 1, marginLeft: normalizeW(15)}}>
          <Text style={styles.shopAbstractName} numberOfLines={1}>{this.props.shopDetail.shopName}</Text>
          {this.renderShopTags()}
        </View>
        <View style={{}}>
          {/*<Svg icon='follow_shop' size={normalizeH(25)} color="#FFFFFF"/>*/}
          {/*<Text style={styles.shopAbstractLike}>关注</Text>*/}
        </View>
      </LinearGradient>
    )
  }

  renderNoGood() {
    return (
      <View>
        <Text style={styles.noGoodText}>暂无商品</Text>
        <View style={styles.addGoodBox}>
          <Svg size={normalizeH(32)} icon="click_add"/>
          <Text style={styles.addGoodText}>点击添加产品</Text>

        </View>
        <CachedImage source={require('../../../assets/images/background_shop_copy.png')}/>
      </View>
    )
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
        <TouchableOpacity onPress={()=> {
          this.showShopAlbum()
        }} style={{flex: 1}}>
          <View style={{flex: 1}}>
            <TouchableOpacity onPress={()=> {
              this.showShopAlbum()
            }} style={{flex: 1}}>
              {this.props.shopDetail.coverUrl ?
                <CachedImage mutable style={{width: PAGE_WIDTH, height: normalizeH(300)}}
                             source={{uri: getThumbUrl(this.props.shopDetail.coverUrl, PAGE_WIDTH, normalizeH(300))}}>
                  {/*<View style={{*/}
                  {/*position: 'absolute',*/}
                  {/*right: 15,*/}
                  {/*bottom: 15,*/}
                  {/*padding: 3,*/}
                  {/*paddingLeft: 6,*/}
                  {/*paddingRight: 6,*/}
                  {/*backgroundColor: 'gray',*/}
                  {/*borderRadius: 2,*/}
                  {/*}}>*/}
                  {/*<Text style={{color: 'white', fontSize: 15}}>{albumLen}</Text>*/}
                  {/*</View>*/}
                </CachedImage> : <Image style={{width: PAGE_WIDTH, height: normalizeH(300)}}
                                        source={require('../../../assets/images/background_shop.png')}/>}
            </TouchableOpacity>
            {this.renderShopAbstract()}
          </View>

        </TouchableOpacity>
        {/*<View style={styles.shopHead}>*/}
        {/*<View style={styles.shopHeadLeft}>*/}
        {/*<Text style={styles.shopName} numberOfLines={1}>{this.props.shopDetail.shopName}</Text>*/}
        {/*<View style={styles.shopOtherInfo}>*/}
        {/*<ScoreShow*/}
        {/*containerStyle={{flex:1}}*/}
        {/*score={this.props.shopDetail.score}*/}
        {/*/>*/}
        {/*{this.props.shopDetail.pv*/}
        {/*? <Text style={[styles.distance, styles.pv]}>{this.props.shopDetail.pv}人看过</Text>*/}
        {/*: null*/}
        {/*}*/}
        {/*</View>*/}
        {/*</View>*/}
        {/*</View>*/}

        <View style={styles.shopXYZWrap}>
          <View style={styles.shopXYZLeft}>
            <View style={styles.locationWrap}>
              <TouchableOpacity style={styles.locationContainer} onPress={()=> {
              }}>
                <Image style={styles.locationIcon} source={require('../../../assets/images/shop_loaction.png')}/>
                <View style={styles.locationTxtWrap}>
                  <Text style={styles.locationTxt} numberOfLines={2}>{this.props.shopDetail.shopAddress}</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.contactNumberWrap}>
              <TouchableOpacity style={styles.contactNumberContainer} onPress={()=> {
                this.handleServicePhoneCall()
              }}>
                <Image style={styles.contactNumberIcon} source={require('../../../assets/images/shop_call.png')}/>
                <View style={styles.contactNumberTxtWrap}>
                  <Text style={styles.contactNumberTxt} numberOfLines={1}>{this.props.shopDetail.contactNumber}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.headerView}>
          <View style={styles.headerItem}>
            <Image source={require('../../../assets/images/activity.png')} width={12} height={14}></Image>
            <Text style={styles.headerText} numberOfLines={1}>{'热卖商品'}</Text>
          </View>
        </View>
        {this.props.goodList && this.props.goodList.length ?
          <ShopGoodsList shopGoodsList={this.props.goodList} size={6} showGoodDetail={(value)=> {
            this.showGoodDetail(value)
          }}/> : <View style={{
          flex: 1, width: PAGE_WIDTH, alignItems: 'center', backgroundColor: 'white',
        }}>
          <TouchableOpacity
            onPress={()=> {
              Actions.PUBLISH_SHOP_GOOD({shopId: this.props.shopDetail.id})
            }}
          >
            {this.renderNoGood()}
          </TouchableOpacity>
        </View>}

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

  render() {
    let shopDetail = this.props.shopDetail
    let albumLen = (shopDetail.album && shopDetail.album.length) ? (shopDetail.album.length + 1) : 1

    return (
      <View style={styles.container}>
        {this.renderMainHeader()}
        <View style={styles.body}>
          <View style={styles.detailWrap}>
            <CommonListView
              name="shopDetail"
              contentContainerStyle={{backgroundColor: '#F5F5F5'}}
              dataSource={this.props.ds}
              renderRow={(rowData, rowId) => this.renderRow(rowData, rowId)}
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

          <View style={styles.shopCommentWrap}>
            <TouchableOpacity onPress={()=> {
              this.editShop()
            }}>
              <View style={[styles.vItem]}>
                <Svg size={normalizeH(32)} color="#FF9D4E" icon="shop_edite"/>
                <Text style={[styles.vItemTxt, styles.shopCommentInput]}>编辑店铺</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.shopCommentInputBox]} onPress={()=> {
              this.activityManage()
            }}>
              <View style={[styles.vItem, {marginLeft: 19}]}>
                <Svg size={normalizeH(32)} color="#FF9D4E" icon="activity_edite"/>
                <Text style={[styles.vItemTxt, styles.shopCommentInput]}>活动管理</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.contactedWrap]} onPress={() => this.manageShopGoods()}>
              <Svg size={normalizeH(32)} color="#FFFFFF" icon="goods_20"/>
              <Text style={[styles.contactedTxt]}>商品管理</Text>
            </TouchableOpacity>
          </View>

          {this.renderServicePhoneAction()}
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
    if (0 == index) { //
      this.makePhoneCall(this.props.shopDetail.contactNumber)
    } else if (1 == index) { //
      this.makePhoneCall(this.props.shopDetail.contactNumber2)
    }
  }

  editShop() {
    if (!this.props.isUserLogined) {
      Actions.LOGIN()
      return
    }
    Actions.EDIT_SHOP()
    // Actions.COMPLETE_SHOP_INFO()
  }

  manageShopGoods() {
    if (!this.props.isUserLogined) {
      Actions.LOGIN()
      return
    }
    Actions.SHOP_GOODS_MANAGE({shopId: this.props.userOwnedShopInfo.id})
  }

  activityManage() {
    if (!this.props.isUserLogined) {
      Actions.LOGIN()
      return
    }
    Actions.SHOP_GOOD_PROMOTION_MANAGE({shopId: this.props.userOwnedShopInfo.id})
  }

  renderShopFollowers() {
    let shopFollowers = this.props.shopFollowers
    let shopFollowersTotalCount = this.props.shopFollowersTotalCount
    // shopFollowersTotalCount = 5
    // shopFollowers = [{},{},{},{},{}]
    // console.log('shopFollowersTotalCount====', shopFollowersTotalCount)
    // console.log('shopFollowers====', shopFollowers)
    if (shopFollowersTotalCount) {
      let shopFollowersView = shopFollowers.map((item, index)=> {
        if (index > 2) {
          return null
        }
        let source = require('../../../assets/images/default_portrait.png')
        if (item.avatar) {
          source = {uri: item.avatar}
        }

        return (
          <Image
            key={'shop_follower_' + index}
            style={{width: 20, height: 20, marginRight: 5, borderRadius: 10}}
            source={source}
          />
        )
      })
      return (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {shopFollowersView}
          <Icon
            name="ios-arrow-forward"
            style={{marginLeft: 6, color: '#8f8e94', fontSize: 17}}/>
        </View>
      )
    }
    return (
      <Text style={{color: '#8f8e94'}}>暂无粉丝,赶紧开始推广吧!</Text>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const userOwnedShopInfo = selectUserOwnedShopInfo(state)
  // console.log('userOwnedShopInfo====', userOwnedShopInfo)
  const isUserLogined = authSelector.isUserLogined(state)
  const userFollowees = authSelector.selectUserFollowees(state)
  let goodList = []
  let shopFollowers = []
  let shopFollowersTotalCount = 0
  let latestShopAnnouncement = {}
  let shopComments = []
  let shopCommentsTotalCount = 0
  let similarShopList = []
  if (userOwnedShopInfo.id) {
    shopFollowers = selectShopFollowers(state, userOwnedShopInfo.id)
    shopFollowersTotalCount = selectShopFollowersTotalCount(state, userOwnedShopInfo.id)
    latestShopAnnouncement = selectLatestShopAnnouncemment(state, userOwnedShopInfo.id)
    shopComments = selectShopComments(state, userOwnedShopInfo.id)
    // console.log('shopComments==***==', shopComments)
    similarShopList = selectSimilarShopList(state, userOwnedShopInfo.id)
    goodList = selectGoodsList(state, userOwnedShopInfo.id, 1)

  }
  let shopCommentList = selectCommentsForShop(state, userOwnedShopInfo.id)

  let lastCommentsCreatedAt = ''
  if (shopCommentList.commentList && shopCommentList.commentList.length) {
    lastCommentsCreatedAt = shopCommentList.commentList[shopCommentList.commentList.length - 1].createdAt
  }
  console.log('userOwnedShopInfo===', userOwnedShopInfo)
  let shareDomain = getShareDomain(state)
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
  // dataArray.push({type: 'NEARBY_TOPIC'})
  dataArray.push({type: 'SHOP_COMMENTS'})

  return {
    ds: ds.cloneWithRows(dataArray),
    goodList: goodList,
    shopDetail: userOwnedShopInfo,
    userOwnedShopInfo: userOwnedShopInfo,
    isUserLogined: isUserLogined,
    shopFollowers: shopFollowers,
    shopFollowersTotalCount: shopFollowersTotalCount,
    latestShopAnnouncement: latestShopAnnouncement,
    shopComments: shopComments,
    userFollowees: userFollowees,
    similarShopList: similarShopList,
    currentUser: authSelector.activeUserId(state),
    shareDomain: shareDomain,
    shopCommentList: shopCommentList.commentList,
    shopCommentIdList: shopCommentList.commentIdList,
    lastCommentsCreatedAt: lastCommentsCreatedAt
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchShopCommentList,
  fetchUserFollowees,
  fetchGuessYouLikeShopList,
  fetchUserOwnedShopInfo,
  fetchShopFollowers,
  fetchShopFollowersTotalCount,
  fetchSimilarShopList,
  fetchShareDomain,
  getShopGoodsList,
  fetchAllComments

}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MyShopIndex)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)'
  },
  body: {
    flex: 1,
  },
  detailWrap: {
    marginBottom: normalizeH(49),
  },
  contentContainerStyle: {},
  followersWrap: {
    flex: 1,
    flexDirection: 'row',
    padding: 15,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: 'white',
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
    marginBottom: 10,
    marginTop: normalizeH(25)
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
  serviceInfoContainer: {},
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
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: '#f5f5f5'
  },
  shopInnerIntroWrap: {
    height: 80,
  },
  guessYouLikeIntroWrap: {},
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
    position: 'absolute',
    left: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.lighterA,
    backgroundColor: '#fafafa',
    flexDirection: 'row',
    alignItems: 'center',
    height: normalizeH(49),
    width: PAGE_WIDTH,
  },
  vItem: {
    flex: 1,
    alignSelf: 'flex-start',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 3,
    paddingLeft: 30,
  },
  vItemTxt: {
    fontSize: em(10),
    color: '#aaa'
  },
  shopCommentInputBox: {
    flex: 1,
  },
  contactedWrap: {
    width: normalizeW(135),
    height: normalizeH(49),
    backgroundColor: THEME.base.mainColor,
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
  commentBtnBadge: {
    alignItems: 'center',
    width: 30,
    backgroundColor: '#FF9D4E',
    position: 'absolute',
    right: 10,
    top: 6,
    borderRadius: 10,
    borderWidth: normalizeBorder(),
    borderColor: '#FF9D4E'
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
    marginTop: 10,
    borderTopWidth: normalizeBorder(),
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
    color: 'white',
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
    width: normalizeW(60),
    borderRadius: normalizeH(12),
    backgroundColor: '#FF9D4E',
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: normalizeW(15)
  },
  shopTagBadge: {
    backgroundColor: 'rgba(245,245,245,0.3)',
    borderRadius: 2.5,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalizeW(6),

  },
  shopTagBadgeTxt: {
    color: '#FFFFFF',
    fontSize: em(11),
    height: normalizeH(11),
  },
  shopTagBox: {
    flex: 1,
    flexDirection: 'row',
    // marginTop: normalizeH(9),
    // marginBottom: normalizeH(9),
    alignItems: 'center',

  },
  noGoodText: {
    position: 'absolute',
    left: normalizeW(91),
    top: normalizeH(52),
    fontFamily: '.PingFangSC-Semibold',
    fontSize: em(40),
    color: 'rgba(255,120,25,0.30)',
    letterSpacing: em(0, 48),
    zIndex: 10,
  },
  addGoodBox: {
    position: 'absolute',
    left: normalizeW(108),
    top: normalizeH(128),
    flexDirection: 'row',
    zIndex: 10,
    alignItems: 'center'
  },
  addGoodText: {
    fontFamily: '.PingFangSC-Medium',
    fontSize: em(15),
    color: '#FF7819',
    letterSpacing: em(0.61),

  }
})