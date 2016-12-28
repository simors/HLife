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
  InteractionManager
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import ImageGroupViewer from '../common/Input/ImageGroupViewer'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import * as Toast from '../common/Toast'

import {fetchShopAnnouncements, userIsFollowedShop, followShop} from '../../action/shopAction'
import {selectShopDetail, selectLatestShopAnnouncemment, selectUserIsFollowShop} from '../../selector/shopSelector'
import {selectShopList} from '../../selector/shopSelector'
import * as authSelector from '../../selector/authSelector'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class ShopDetail extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{
      this.props.fetchShopAnnouncements({id: this.props.id})
      if(this.props.isUserLogined) {
        this.props.userIsFollowedShop({id: this.props.id})
      }
    })
  }

  componentWillReceiveProps() {

  }

  followShop() {
    if(!this.props.isUserLogined) {
      Actions.LOGIN()
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
    this.props.followShop(payload)
    
  }

  renderGuessYouLikeList() {
    let guessYouLikeView = <View/>
    if(this.props.guessYouLikeList.length) {
      guessYouLikeView = this.props.guessYouLikeList.map((item, index)=> {
        const scoreWidth = item.score / 5.0 * 62
        return (
          <TouchableWithoutFeedback key={"guessYouLike_" + index} onPress={()=>{Actions.SHOP_DETAIL({id: item.id})}}>
            <View style={styles.shopInfoWrap}>
              <View style={styles.coverWrap}>
                <Image style={styles.cover} source={{uri: item.coverUrl}}/>
              </View>
              <View style={[styles.shopIntroWrap, styles.guessYouLikeIntroWrap]}>
                <Text style={styles.gylShopName} numberOfLines={1}>{item.shopName}</Text>
                <View style={[styles.scoresWrap, styles.guessYouLikeScoresWrap]}>
                  <View style={styles.scoreIconGroup}>
                    <View style={[styles.scoreBackDrop, {width: scoreWidth}]}></View>
                    <Image style={styles.scoreIcon} source={require('../../assets/images/star_empty.png')}/>
                  </View>
                  <Text style={styles.score}>{item.score}分</Text>
                </View>
                <View style={styles.subInfoWrap}>
                  <Text style={styles.subTxt}>{item.pv}人看过</Text>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        )
      })
    }
    return guessYouLikeView
  }

  renderGuessYouLike() {
    if(this.props.guessYouLikeList.length) {
      return (
        <View style={styles.guessYouLikeWrap}>
          <View style={styles.guessYouLikeTitleWrap}>
            <Text style={styles.guessYouLikeTitle}>猜你喜欢</Text>
          </View>
          {this.renderGuessYouLikeList()}
        </View>
      )
    }
  }

  render() {
    const scoreWidth = this.props.shopDetail.score / 5.0 * 62
    const album = this.props.shopDetail.album
    let announcementCover = {uri: this.props.latestShopAnnouncement.coverUrl}
    
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="店铺详情"
          rightType="none"
        />
        <View style={styles.body}>
          <ScrollView
            contentContainerStyle={[styles.contentContainerStyle]}
          >
            <View style={styles.shopHead}>
              <View style={styles.shopHeadLeft}>
                <Text style={styles.shopName} numberOfLines={1}>{this.props.shopDetail.shopName}</Text>
                <View style={styles.shopOtherInfo}>
                  <View style={styles.scoresWrap}>
                    <View style={styles.scoreIconGroup}>
                      <View style={[styles.scoreBackDrop, {width: scoreWidth}]}></View>
                      <Image style={styles.scoreIcon} source={require('../../assets/images/star_empty.png')}/>
                    </View>
                    <Text style={styles.score}>{this.props.shopDetail.score}</Text>
                  </View>
                  <Text style={styles.distance}>{this.props.shopDetail.geoName}</Text>
                  <Text style={styles.distance}>{this.props.shopDetail.distance}km</Text>
                </View>
              </View>
              <View style={styles.shopHeadRight}>
                  {this.props.isFollowedShop
                    ? <View style={styles.shopAttentioned}>
                        <Text style={styles.shopAttentionedTxt}>已关注</Text>
                      </View>
                    : <TouchableOpacity onPress={this.followShop.bind(this)}>
                        <Image style={styles.shopAttention} source={require('../../assets/images/give_attention_head.png')}/>
                      </TouchableOpacity>
                  }
              </View>
            </View>

            <View style={styles.albumWrap}>
              <ImageGroupViewer
                showMode="oneLine"
                images={album}
                containerStyle={{marginLeft:0,marginRight:0}}
                imageStyle={{margin:0,marginRight:2}}
              />
            </View>

            <View style={styles.locationWrap}>
              <TouchableOpacity style={styles.locationContainer} onPress={()=>{Toast.show('地址')}}>
                <Image style={styles.locationIcon} source={require('../../assets/images/shop_loaction.png')}/>
                <View style={styles.locationTxtWrap}>
                  <Text style={styles.locationTxt} numberOfLines={2}>{this.props.shopDetail.shopAddress}</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.contactNumberWrap}>
              <TouchableOpacity style={styles.contactNumberContainer} onPress={()=>{Toast.show('联系电话')}}>
                <Image style={styles.contactNumberIcon} source={require('../../assets/images/shop_call.png')}/>
                <View style={styles.contactNumberTxtWrap}>
                  <Text style={styles.contactNumberTxt} numberOfLines={1}>{this.props.shopDetail.contactNumber}</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.shopAnnouncementWrap}>
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
                  <View style={styles.shopAnnouncementSubTitleWrap}>
                    <Image style={styles.shopAnnouncementIcon} source={{uri: this.props.shopDetail.owner.avatar}}/>
                    <Text style={styles.shopAnnouncementSubTxt}>{this.props.shopDetail.owner.nickname}</Text>
                    <Text style={styles.shopAnnouncementSubTxt}>{this.props.latestShopAnnouncement.createdDate}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.shopAnnouncementBadge}>
                <Image style={styles.shopAnnouncementBadgeIcon} source={require('../../assets/images/background_everyday.png')}>
                  <Text style={styles.shopAnnouncementBadgeTxt}>店铺公告</Text>
                </Image>
              </View>
            </View>

            <View style={styles.commentWrap}>
              <View style={styles.commentHead}>
                <Text style={styles.commentTitle}>吾友点评（35）</Text>
              </View>
              <View style={styles.commentContainer}>
                <View style={styles.commentAvatarBox}>
                  <Image style={styles.commentAvatar} source={{uri: "http://c.hiphotos.baidu.com/image/pic/item/64380cd7912397dd5393db755a82b2b7d1a287dd.jpg"}}/>
                  <TouchableOpacity onPress={()=>{Toast.show('关注成功')}}>
                    <Image style={styles.commentAttention} source={require('../../assets/images/give_attention_head.png')}/>
                  </TouchableOpacity>
                </View>
                <View style={styles.commentRight}>
                  <View style={[styles.commentLine, styles.commentHeadLine]}>
                    <Text style={styles.commentTitle}>欣欣木</Text>
                    <Text style={styles.commentTime}>2016-12-16</Text>
                  </View>
                  <View style={styles.commentLine}>
                    <View style={styles.scoresWrap}>
                      <View style={styles.scoreIconGroup}>
                        <View style={[styles.scoreBackDrop, {width: scoreWidth}]}></View>
                        <Image style={styles.scoreIcon} source={require('../../assets/images/star_empty.png')}/>
                      </View>
                      <Text style={styles.score}>{this.props.shopDetail.score}</Text>
                    </View>
                  </View>
                  <View style={[styles.commentFootLine]}>
                    <Text numberOfLines={2} style={styles.comment}>到过长沙大大小小的茶餐厅，这家真心话，环境，环境不错，味道真正正环境不错，味道真正正</Text>
                  </View>
                </View>
              </View>
              <View style={styles.commentContainer}>
                <View style={styles.commentAvatarBox}>
                  <Image style={styles.commentAvatar} source={{uri: "http://c.hiphotos.baidu.com/image/pic/item/64380cd7912397dd5393db755a82b2b7d1a287dd.jpg"}}/>
                  <TouchableOpacity onPress={()=>{Toast.show('关注成功')}}>
                    <Image style={styles.commentAttention} source={require('../../assets/images/give_attention_head.png')}/>
                  </TouchableOpacity>
                </View>
                <View style={styles.commentRight}>
                  <View style={[styles.commentLine, styles.commentHeadLine]}>
                    <Text style={styles.commentTitle}>欣欣木</Text>
                    <Text style={styles.commentTime}>2016-12-16</Text>
                  </View>
                  <View style={styles.commentLine}>
                    <View style={styles.scoresWrap}>
                      <View style={styles.scoreIconGroup}>
                        <View style={[styles.scoreBackDrop, {width: scoreWidth}]}></View>
                        <Image style={styles.scoreIcon} source={require('../../assets/images/star_empty.png')}/>
                      </View>
                      <Text style={styles.score}>{this.props.shopDetail.score}</Text>
                    </View>
                  </View>
                  <View style={[styles.commentFootLine]}>

                      <Text numberOfLines={2} style={styles.comment}>到过长沙大大小小的茶餐厅，这家真心话，环境，环境不错，味道真正正环境不错，味道真正正</Text>

                  </View>
                </View>
              </View>
              <View style={styles.commentFoot}>
                <TouchableOpacity onPress={()=>{Toast.show('查看全部评论')}}>
                  <Text style={styles.allCommentsLink}>查看全部评价</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.serviceInfoWrap}>
              <View style={styles.serviceInfoTitleWrap}>
                <Text style={styles.serviceInfoTitle}>服务信息</Text>
              </View>
              <View style={styles.serviceInfoContainer}>
                <View style={styles.openTime}>
                  <Text style={[styles.serviceTxt, styles.serviceLabel]}>营业时间:</Text>
                  <Text style={styles.serviceTxt}>{this.props.shopDetail.openTime}</Text>
                </View>
                <View style={styles.shopSpecial}>
                  <Text style={[styles.serviceTxt, styles.serviceLabel]}>本店特色:</Text>
                  <Text style={styles.serviceTxt}>{this.props.shopDetail.ourSpecial}</Text>
                </View>
              </View>
            </View>

            {this.renderGuessYouLike()}

          </ScrollView>

        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let shopDetail = selectShopDetail(state, ownProps.id)
  let latestShopAnnouncement = selectLatestShopAnnouncemment(state, ownProps.id)
  const shopList = selectShopList(state) || []
  const isUserLogined = authSelector.isUserLogined(state)
  if(shopList.length > 3) {
    shopList.splice(0, shopList.length-3)
  }
  const isFollowedShop = selectUserIsFollowShop(state, ownProps.id)
  return {
    shopDetail: shopDetail,
    latestShopAnnouncement: latestShopAnnouncement,
    guessYouLikeList: shopList,
    isUserLogined: isUserLogined,
    isFollowedShop: isFollowedShop
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchShopAnnouncements,
  userIsFollowedShop,
  followShop
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ShopDetail)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)'
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
  },
  contentContainerStyle: {

  },
  shopHead: {
    flexDirection: 'row',
    padding: 12,
    height: 70,
    backgroundColor: '#fff'
  },
  shopHeadLeft: {
    flex: 1,
    justifyContent: 'space-between'
  },
  shopHeadRight: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  shopAttentioned: {
    backgroundColor: THEME.colors.green,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 6,
    paddingRight: 6,
    borderRadius: 5,
  },
  shopAttentionedTxt: {
    color: '#fff',
    fontSize: em(14),
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
    color: '#d8d8d8',
    fontSize: em(12),
    marginRight: normalizeW(10)
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
    lineHeight: normalizeH(20),
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
    borderTopWidth: normalizeBorder(),
    borderTopColor: THEME.colors.lighterA
  },
  contactNumberTxt: {
    lineHeight: normalizeH(20),
    fontSize: em(17),
    color: '#8f8e94',
  },
  shopAnnouncementWrap: {
    backgroundColor: 'transparent',
    marginTop: 10,
  },
  shopAnnouncementContainer: {
    flexDirection: 'row',
    marginTop: normalizeH(10),
    padding: 10,
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
    color: '#8f8e94'
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
    paddingLeft: normalizeW(10),
    paddingTop: normalizeH(10),
    marginTop: normalizeW(10),
    marginBottom: normalizeW(10),
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
    paddingLeft: normalizeW(10),
    paddingTop: normalizeH(15),
    paddingBottom: normalizeH(15),
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: THEME.colors.lighterA,
    backgroundColor: '#fff',
  },
  guessYouLikeTitle: {
    fontSize: em(17),
    color: "#8f8e94"
  },
  shopInfoWrap: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10
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
    lineHeight: 20,
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
  }

})