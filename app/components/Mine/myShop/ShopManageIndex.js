/**
 * Created by zachary on 2017/1/13.
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
import ScoreShow from '../../common/ScoreShow'
import ImageInput from '../../common/Input/ImageInput'
import ImageGroupViewer from '../../common/Input/ImageGroupViewer'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'
import * as Toast from '../../common/Toast'
import Symbol from 'es6-symbol'

import {fetchUserOwnedShopInfo, fetchShopFollowers, fetchShopFollowersTotalCount, fetchShopAnnouncements, fetchShopCommentList, fetchShopCommentTotalCount, } from '../../../action/shopAction'
import {fetchUserFollowees} from '../../../action/authActions'
import {selectUserOwnedShopInfo, selectShopFollowers, selectShopFollowersTotalCount, selectLatestShopAnnouncemment, selectShopComments, selectShopCommentsTotalCount} from '../../../selector/shopSelector'
import * as authSelector from '../../../selector/authSelector'
import Comment from '../../common/Comment'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

let commonForm = Symbol('commonForm')

const shopCoverInput = {
  formKey: commonForm,
  stateKey: Symbol('shopCoverInput'),
  type: "shopCoverInput",
}

class ShopManageIndex extends Component {
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
        this.props.fetchShopAnnouncements({id: this.props.id})
        this.props.fetchShopCommentList({isRefresh: true, id: this.props.id})
        this.props.fetchShopCommentTotalCount({id: this.props.id})
      }
      if(this.props.isUserLogined) {
        this.props.fetchUserFollowees()
      }
    })
  }

  componentDidMount() {

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

  renderRowShopFollowers(shopFollowers, rowIndex, totalCount) {
    let shopFollowersView = shopFollowers.map((item, index)=>{
      if(totalCount && shopFollowers.length == (index + 1)) {
        console.log('renderRowShopFollowers.totalCount===', totalCount)
        return (
          <View key={"shopFollower_totalCount"} style={styles.shopFollowersTotalCountWrap}>
            <Text style={styles.shopFollowersTotalCountTxt}>{totalCount > 99 ? '99+' : totalCount}</Text>
          </View>
        )
      }

      let source = require('../../../assets/images/default_portrait.png')
      if(item.avatar) {
        source = {uri: item.avatar}
      }
      return (
        <Image
          key={"shopFollower_" + (8 * (rowIndex-1) + index)}
          resizeMethod="scale"
          resizeMode="contain"
          style={styles.attentionAvatar}
          source={source}
        />
      )
    })

    return (
      <View key={"shopFollower_row_" + rowIndex} style={styles.attentionAvatarWrap}>
        {shopFollowersView}
      </View>
    )
  }

  renderShopFollowers() {
    if(this.props.shopFollowers && this.props.shopFollowers.length) {
      if(this.props.shopFollowers.length <= 8) {
        return this.renderRowShopFollowers(this.props.shopFollowers, 1)
      }else if (this.props.shopFollowers.length <= 16) {
        let multiRow = []
        multiRow.push(this.renderRowShopFollowers(this.props.shopFollowers.slice(0, 8), 1))
        multiRow.push(this.renderRowShopFollowers(this.props.shopFollowers.slice(8), 2))
        return multiRow
      }else if (this.props.shopFollowers.length <= 24) {
        let multiRow = []
        multiRow.push(this.renderRowShopFollowers(this.props.shopFollowers.slice(0, 8), 1))
        multiRow.push(this.renderRowShopFollowers(this.props.shopFollowers.slice(8, 16), 2))
        multiRow.push(this.renderRowShopFollowers(this.props.shopFollowers.slice(16), 3))
        return multiRow
      }else {
        let multiRow = []
        multiRow.push(this.renderRowShopFollowers(this.props.shopFollowers.slice(0, 8), 1))
        multiRow.push(this.renderRowShopFollowers(this.props.shopFollowers.slice(8, 16), 2))
        multiRow.push(this.renderRowShopFollowers(this.props.shopFollowers.slice(16, 24), 3, this.props.shopFollowersTotalCount))
        return multiRow
      }
    }else {
      return (
        <View style={styles.noAttentionWrap}>
          <Text style={styles.noAttentionTxt}>暂无关注用户,赶紧开始推广吧!!!</Text>
        </View>
      )
    }
  }
  
  renderComments() {
    if(this.props.shopComments && this.props.shopComments.length) {
      const that = this
      const commentsView = this.props.shopComments.map((item, index) => {
        if(index > 2) return
        const scoreWidth = item.score / 5.0 * 62
        let userIsFollowedTheUser = that.userIsFollowedTheUser(item.user.id)
        return (
          <View key={"shop_comment_" + index} style={styles.commentContainer}>
            <View style={styles.commentAvatarBox}>
              <Image style={styles.commentAvatar} source={{uri: item.user.avatar}}/>
              
              {userIsFollowedTheUser
                ? <TouchableOpacity style={styles.userAttentioned} onPress={()=>{this.unFollowUser(item.user.id)}}>
                <Text style={styles.userAttentionedTxt}>取消关注</Text>
              </TouchableOpacity>
                : <TouchableOpacity onPress={()=>{this.followUser(item.user.id)}}>
                <Image style={styles.commentAttention} source={require('../../../assets/images/give_attention_head.png')}/>
              </TouchableOpacity>
              }
            
            </View>
            <View style={styles.commentRight}>
              <View style={[styles.commentLine, styles.commentHeadLine]}>
                <Text style={styles.commentTitle}>{item.user.nickname}</Text>
                <Text style={styles.commentTime}>{item.createdDate}</Text>
              </View>
              <View style={styles.commentLine}>
                <View style={styles.scoresWrap}>
                  <View style={styles.scoreIconGroup}>
                    <View style={[styles.scoreBackDrop, {width: scoreWidth}]}></View>
                    <Image style={styles.scoreIcon} source={require('../../../assets/images/star_empty.png')}/>
                  </View>
                  <Text style={styles.score}>{item.score}</Text>
                </View>
              </View>
              <View style={[styles.commentFootLine]}>
                
                <Text numberOfLines={2} style={styles.comment}>{item.content}</Text>
              
              </View>
            </View>
          </View>
        )
      })
      
      return (
        <View style={styles.commentWrap}>
          <View style={styles.commentHead}>
            <Text style={styles.commentTitle}>吾友点评（{this.props.shopCommentsTotalCount}）</Text>
          </View>
          
          {commentsView}
          
          <View style={styles.commentFoot}>
            <TouchableOpacity onPress={()=>{Actions.SHOP_COMMENT_LIST({shopId: this.props.id})}}>
              <Text style={styles.allCommentsLink}>查看全部评价</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
  }

  render() {

    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          leftStyle={styles.headerLeftStyle}
          headerContainerStyle={styles.headerContainerStyle}
          title="店铺管理"
          titleStyle={styles.headerTitleStyle}
          rightType="text"
          rightText="● ● ●"
          rightPress={()=>{}}
          rightStyle={styles.headerRightStyle}
        />
        <View style={styles.body}>
          <ScrollView
            contentContainerStyle={[styles.contentContainerStyle]}
          >
            <View style={{}}>
              <ImageInput
                {...shopCoverInput}
                containerStyle={{width: PAGE_WIDTH, height: 156,borderWidth:0}}
                addImageBtnStyle={{top:0, left: 0, width: PAGE_WIDTH, height: 156}}
                choosenImageStyle={{width: PAGE_WIDTH, height: 156}}
                addImage={{uri: 'http://img1.3lian.com/2015/a1/53/d/198.jpg'}}
                initValue={this.props.userOwnedShopInfo.coverUrl}
                closeModalAfterSelectedImg={true}
              />
            </View>

            <View style={styles.shopHead}>
              <View style={styles.shopHeadLeft}>
                <Text style={styles.shopName} numberOfLines={1}>{this.props.userOwnedShopInfo.shopName}</Text>
                <View style={styles.shopOtherInfo}>
                  <ScoreShow
                    score={this.props.userOwnedShopInfo.score}
                  />
                  <Text style={styles.distance}>{this.props.userOwnedShopInfo.geoName}</Text>
                  {this.props.userOwnedShopInfo.distance &&
                  <Text style={styles.distance}>{this.props.userOwnedShopInfo.distance}km</Text>
                  }
                </View>
              </View>
            </View>

            <View style={styles.albumWrap}>
              {this.props.userOwnedShopInfo.album && this.props.userOwnedShopInfo.album.length
                ? <ImageGroupViewer
                    showMode="oneLine"
                    images={this.props.userOwnedShopInfo.album}
                    containerStyle={{marginLeft:0,marginRight:0}}
                    imageStyle={{margin:0,marginRight:2}}
                    imgSize={100}
                  />
                : <TouchableOpacity onPress={()=>{}}>
                    <View style={styles.noAlbumWrap}>
                      <Text style={styles.noAlbumText}>暂无相册,点击上传</Text>
                    </View>
                  </TouchableOpacity>
              }
            </View>

            <View style={styles.locationWrap}>
              <TouchableOpacity style={styles.locationContainer} onPress={()=>{}}>
                <Image style={styles.locationIcon} source={require('../../../assets/images/shop_loaction.png')}/>
                <View style={styles.locationTxtWrap}>
                  <Text style={styles.locationTxt} numberOfLines={2}>{this.props.userOwnedShopInfo.shopAddress}</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.contactNumberWrap}>
              <TouchableOpacity style={styles.contactNumberContainer} onPress={()=>{this.makePhoneCall(this.props.userOwnedShopInfo.contactNumber)}}>
                <Image style={styles.contactNumberIcon} source={require('../../../assets/images/shop_call.png')}/>
                <View style={styles.contactNumberTxtWrap}>
                  <Text style={styles.contactNumberTxt} numberOfLines={1}>{this.props.userOwnedShopInfo.contactNumber}</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.attentionWrap}>
              <Text style={styles.attentionTitle}>关注我的</Text>
              {this.renderShopFollowers()}
            </View>

            <View style={styles.shopAnnouncementWrap}>
              {this.props.latestShopAnnouncement.content
                ? <TouchableOpacity onPress={()=>{}}>
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
                  </TouchableOpacity>
                : <TouchableOpacity onPress={()=>{}}>
                    <View style={[styles.shopAnnouncementWrap, styles.noShopAnnouncementWrap]}>
                      <View style={[styles.noShopAnnouncementWrap]}>
                        <Text style={styles.noShopAnnouncementTxt}>暂无公告,点击添加</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
              }
              <View style={styles.shopAnnouncementBadge}>
                <Image style={styles.shopAnnouncementBadgeIcon} source={require('../../../assets/images/background_everyday.png')}>
                  <Text style={styles.shopAnnouncementBadgeTxt}>店铺公告</Text>
                </Image>
              </View>
              <View style={styles.shopAnnouncementDateWrap}>
                <Image style={styles.shopAnnouncementDateIcon} source={require('../../../assets/images/notice_date.png')}>
                  <Text style={styles.shopAnnouncementDateDay}>26</Text>
                  <Text style={styles.shopAnnouncementDateMonth}>DEC</Text>
                </Image>
              </View>
            </View>
  
            {this.renderComments()}

          </ScrollView>


        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const userOwnedShopInfo = selectUserOwnedShopInfo(state)
  const isUserLogined = authSelector.isUserLogined(state)
  const shopFollowers = selectShopFollowers(state, userOwnedShopInfo.id)
  const shopFollowersTotalCount = selectShopFollowersTotalCount(state, userOwnedShopInfo.id)
  let latestShopAnnouncement = selectLatestShopAnnouncemment(state, userOwnedShopInfo.id)
  const shopComments = selectShopComments(state, ownProps.id)
  const shopCommentsTotalCount = selectShopCommentsTotalCount(state, ownProps.id)
  const userFollowees = authSelector.selectUserFollowees(state)
  return {
    userOwnedShopInfo: userOwnedShopInfo,
    isUserLogined: isUserLogined,
    shopFollowers: shopFollowers,
    shopFollowersTotalCount: shopFollowersTotalCount,
    latestShopAnnouncement: latestShopAnnouncement,
    shopComments: shopComments,
    shopCommentsTotalCount: shopCommentsTotalCount,
    userFollowees: userFollowees,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchUserOwnedShopInfo,
  fetchShopFollowers,
  fetchShopFollowersTotalCount,
  fetchShopAnnouncements,
  fetchShopCommentList,
  fetchShopCommentTotalCount,
  fetchUserFollowees,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ShopManageIndex)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)'
  },
  headerContainerStyle: {
    borderBottomWidth: 0,
    backgroundColor: THEME.colors.green,
    ...Platform.select({
      ios: {
        paddingTop: 20,
        height: 64
      },
      android: {
        height: 44
      }
    }),
  },
  headerLeftStyle: {
    color: '#fff',
  },
  headerTitleStyle: {
    color: '#fff',
  },
  headerRightStyle: {
    color: '#fff',
    fontSize: em(12)
  },
  body: {
    ...Platform.select({
      ios: {
        marginTop: 64,
      },
      android: {
        marginTop: 44
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
  shopName: {
    fontSize: em(17),
    color: '#030303'
  },
  shopOtherInfo: {
    flexDirection: 'row'
  },
  distance: {
    color: '#d8d8d8',
    fontSize: em(12),
    marginRight: normalizeW(10)
  },
  albumWrap: {
    backgroundColor: '#fff',
    paddingLeft: 5,
  },
  noAlbumWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: normalizeBorder(),
    borderColor: '#E9E9E9'
  },
  noAlbumText: {
    color: THEME.colors.green,
    fontWeight: 'bold',
    fontSize: em(28)
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
  attentionWrap: {
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 12
  },
  attentionTitle: {
    fontSize: em(17),
    color: '#4a4a4a',
    marginBottom: 10,
  },
  attentionAvatarWrap: {
    flexDirection: 'row',
    marginBottom: 10
  },
  attentionAvatar: {
    marginRight: normalizeW(10),
    width: normalizeW(35),
    height: normalizeW(35)
  },
  noAttentionWrap: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  noAttentionTxt: {
    color: '#b2b2b2',
    fontSize: em(15),
  },
  shopFollowersTotalCountWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalizeW(10),
    width: normalizeW(35),
    height: normalizeW(35),
    borderRadius: normalizeW(35/2),
    backgroundColor: THEME.colors.green
  },
  shopFollowersTotalCountTxt: {
    color: '#fff',
    fontSize: em(15),
  },
  shopAnnouncementWrap: {
    backgroundColor: 'transparent',
    marginTop: 10,
    marginBottom: 10,
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
  noShopAnnouncementWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    height: normalizeH(110),
    backgroundColor: '#fff',
  },
  noShopAnnouncementTxt: {
    color: '#b2b2b2',
    fontSize: em(15),
  },
  shopAnnouncementDateWrap: {
    position: 'absolute',
    top: 0,
    right: 10,
  },
  shopAnnouncementDateIcon: {
    paddingTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: normalizeW(32),
    height: normalizeH(42),
  },
  shopAnnouncementDateDay: {
    color: '#fff',
    fontSize: em(17)
  },
  shopAnnouncementDateMonth: {
    color: '#fff',
    fontSize: em(10),
  }

})