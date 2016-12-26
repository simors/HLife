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
  Platform
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import ImageGroupViewer from '../common/Input/ImageGroupViewer'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import * as Toast from '../common/Toast'

import {selectShopDetail} from '../../selector/shopSelector'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class ShopDetail extends Component {
  constructor(props) {
    super(props)
  }


  render() {
    const scoreWidth = this.props.shopDetail.score / 5.0 * 62
    const album = this.props.shopDetail.album
    
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
                  <Text style={styles.distance}>4.3km</Text>
                </View>
              </View>
              <View style={styles.shopHeadRight}>
                <TouchableOpacity onPress={()=>{Toast.show('关注成功')}}>
                  <Image style={styles.attention} source={require('../../assets/images/give_attention_head.png')}/>
                </TouchableOpacity>
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
                  <Image style={styles.shopAnnouncementCover} source={{uri: "http://c.hiphotos.baidu.com/image/pic/item/64380cd7912397dd5393db755a82b2b7d1a287dd.jpg"}}/>
                </View>
                <View style={styles.shopAnnouncementCnt}>
                  <View style={styles.shopAnnouncementTitleWrap}>
                    <Text numberOfLines={3} style={styles.shopAnnouncementTitle}>
                      精心研制的营养早餐，蔬菜、水果和稀饭的结合，如诗一般美
                    </Text>
                  </View>
                  <View style={styles.shopAnnouncementSubTitleWrap}>
                    <Image style={styles.shopAnnouncementIcon} source={{uri: "http://c.hiphotos.baidu.com/image/pic/item/64380cd7912397dd5393db755a82b2b7d1a287dd.jpg"}}/>
                    <Text style={styles.shopAnnouncementSubTxt}>米奇妙妙屋</Text>
                    <Text style={styles.shopAnnouncementSubTxt}>一天前</Text>
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
                  <Text style={styles.serviceTxt}>10:30-24:00</Text>
                </View>
                <View style={styles.shopSpecial}>
                  <Text style={[styles.serviceTxt, styles.serviceLabel]}>本店特色:</Text>
                  <Text style={styles.serviceTxt}>早午茶  营养粥  肠粉   粤菜</Text>
                </View>
              </View>
            </View>

            <View style={styles.guessYouLikeWrap}>
              <View style={styles.guessYouLikeTitleWrap}>
                <Text style={styles.guessYouLikeTitle}>猜你喜欢</Text>
              </View>
              <TouchableWithoutFeedback onPress={()=>{}}>
                <View style={styles.shopInfoWrap}>
                  <View style={styles.coverWrap}>
                    <Image style={styles.cover} source={{uri: "http://p1.meituan.net/440.0/deal/201301/11/175747_1186323.jpg"}}/>
                  </View>
                  <View style={[styles.shopIntroWrap, styles.guessYouLikeIntroWrap]}>
                    <Text style={styles.gylShopName} numberOfLines={1}>乐会港式茶餐厅（奥克斯广场店）</Text>
                    <View style={[styles.scoresWrap, styles.guessYouLikeScoresWrap]}>
                      <View style={styles.scoreIconGroup}>
                        <View style={[styles.scoreBackDrop, {width: scoreWidth}]}></View>
                        <Image style={styles.scoreIcon} source={require('../../assets/images/star_empty.png')}/>
                      </View>
                      <Text style={styles.score}>4.8分</Text>
                    </View>
                    <View style={styles.subInfoWrap}>
                      <Text style={styles.subTxt}>100人看过</Text>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={()=>{}}>
                <View style={styles.shopInfoWrap}>
                  <View style={styles.coverWrap}>
                    <Image style={styles.cover} source={{uri: "http://p1.meituan.net/440.0/deal/201301/11/175747_1186323.jpg"}}/>
                  </View>
                  <View style={[styles.shopIntroWrap, styles.guessYouLikeIntroWrap]}>
                    <Text style={styles.gylShopName} numberOfLines={1}>乐会港式茶餐厅（奥克斯广场店）</Text>
                    <View style={[styles.scoresWrap, styles.guessYouLikeScoresWrap]}>
                      <View style={styles.scoreIconGroup}>
                        <View style={[styles.scoreBackDrop, {width: scoreWidth}]}></View>
                        <Image style={styles.scoreIcon} source={require('../../assets/images/star_empty.png')}/>
                      </View>
                      <Text style={styles.score}>4.8分</Text>
                    </View>
                    <View style={styles.subInfoWrap}>
                      <Text style={styles.subTxt}>100人看过</Text>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={()=>{}}>
                <View style={styles.shopInfoWrap}>
                  <View style={styles.coverWrap}>
                    <Image style={styles.cover} source={{uri: "http://p1.meituan.net/440.0/deal/201301/11/175747_1186323.jpg"}}/>
                  </View>
                  <View style={[styles.shopIntroWrap, styles.guessYouLikeIntroWrap]}>
                    <Text style={styles.gylShopName} numberOfLines={1}>乐会港式茶餐厅（奥克斯广场店）</Text>
                    <View style={[styles.scoresWrap, styles.guessYouLikeScoresWrap]}>
                      <View style={styles.scoreIconGroup}>
                        <View style={[styles.scoreBackDrop, {width: scoreWidth}]}></View>
                        <Image style={styles.scoreIcon} source={require('../../assets/images/star_empty.png')}/>
                      </View>
                      <Text style={styles.score}>4.8分</Text>
                    </View>
                    <View style={styles.subInfoWrap}>
                      <Text style={styles.subTxt}>100人看过</Text>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>

          </ScrollView>

        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let shopDetail = selectShopDetail(state, ownProps.id)
  // let shopDetail = {
  //   album: [
  //     "http://p1.meituan.net/440.0/deal/201301/11/175747_1186323.jpg",
  // "http://p1.meituan.net/440.0/deal/201301/11/175747_4466522.jpg",
  // "http://p0.meituan.net/440.0/shaitu/f94d922f07f2afbe547b3e9951448f39129643.jpg",
  // "http://p0.meituan.net/440.0/deal/201212/25/181352_8361352.jpg",
  // "http://p0.meituan.net/440.0/deal/201212/25/181353_4984547.jpg",
  // "http://p1.meituan.net/440.0/deal/201212/25/181354_9032902.jpg",
  // "http://p1.meituan.net/440.0/deal/201212/25/181357_3305704.jpg",
  // "http://p1.meituan.net/440.0/shaitu/b49a3601c7010a9b53fda4f1bc00b361122049.jpg"
  //   ],
  //   contactNumber
  //     :
  //     "0731-84712627",
  //   coverUrl
  //     :
  //     "http://p0.meituan.net/deal/__47271683__4555428.jpg",
  //   createdAt
  //     :
  //     "Tue Dec 20 2016",
  //   geo
  //     :
  //   undefined,
  //   geonName
  //     :
  //   undefined,
  //   id
  //     :
  //     "58591e831b69e6006cb2ce19",
  //   name
  //     :
  //     "31231",
  //   phone
  //     :
  //     "13975152028",
  //   pv
  //     :
  //     300000,
  //   score
  //     :
  //     3.8,
  //   shopAddress
  //     :
  //     "芙蓉区黄兴中路王府井8楼",
  //   shopName
  //     :
  //     "乐会港式餐厅（王府井店）",
  // }
  return {
    shopDetail: shopDetail
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({

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
    fontSize: em(12)
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