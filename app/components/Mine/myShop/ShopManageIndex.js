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
import {submitFormData, submitInputData,INPUT_FORM_SUBMIT_TYPE} from '../../../action/authActions'
import {fetchUserOwnedShopInfo, fetchShopFollowers, fetchShopFollowersTotalCount, fetchShopAnnouncements, fetchShopCommentList, fetchShopCommentTotalCount, fetchSimilarShopList} from '../../../action/shopAction'
import {fetchUserFollowees} from '../../../action/authActions'
import {selectUserOwnedShopInfo, selectShopFollowers, selectShopFollowersTotalCount, selectLatestShopAnnouncemment, selectShopComments, selectShopCommentsTotalCount, selectSimilarShopList} from '../../../selector/shopSelector'
import * as authSelector from '../../../selector/authSelector'
import Comment from '../../common/Comment'
import FollowUser from '../../common/FollowUser'
import ActionSheet from 'react-native-actionsheet'

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
        this.props.fetchShopAnnouncements({id: this.props.userOwnedShopInfo.id})
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

  coverImageSelectedChangeCallback(url) {
    this.props.submitFormData({
      formKey: commonForm,
      id: this.props.userOwnedShopInfo.id,
      submitType: INPUT_FORM_SUBMIT_TYPE.UPDATE_SHOP_COVER,
      success: this.submitSuccessCallback,
      error: this.submitErrorCallback
    })
  }

  submitSuccessCallback() {
    Toast.show('更新成功', {duration: 1000})
  }

  submitErrorCallback() {
    Toast.show('更新失败', {duration: 1000})
  }

  _handleActionSheetPress(index) {
    if(0 == index) { //重新认证
      Actions.SHOP_RE_CERTIFICATION({id: this.props.userOwnedShopInfo.id})
    }else if(1 == index) { //编辑封面
      Actions.UPDATE_SHOP_COVER({id: this.props.userOwnedShopInfo.id})
    }else if(2 == index) { //编辑相册
      Actions.UPDATE_SHOP_ALBUM({id: this.props.userOwnedShopInfo.id})
    }else if(3 == index) { //编辑资料
      Actions.COMPLETE_SHOP_INFO({popNum: 2})
    }else if(4 == index) { //编辑公告
      Actions.SHOP_ANNOUNCEMENTS_MANAGE({id: this.props.userOwnedShopInfo.id})
    }
  }

  uploadAlbum() {
    Actions.UPDATE_SHOP_ALBUM({id: this.props.userOwnedShopInfo.id})
  }

  renderRowShopFollowers(shopFollowers, rowIndex, totalCount) {
    let shopFollowersView = shopFollowers.map((item, index)=>{
      if(totalCount && shopFollowers.length == (index + 1)) {
        // console.log('renderRowShopFollowers.totalCount===', totalCount)
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
        <View
          key={"shopFollower_" + (8 * (rowIndex-1) + index)}
          style={styles.attentionAvatar}
        >
          <Image
            style={styles.attentionAvatarImg}
            source={source}
          />
        </View>
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
      const commentsView = this.props.shopComments.map((item, index) => {
        if(index > 2) return
        return (
          <View key={"shop_comment_" + index} style={styles.commentContainer}>
            <View style={styles.commentAvatarBox}>
              <Image style={styles.commentAvatar} source={{uri: item.user.avatar}}/>
              <FollowUser
                userId={item.user.id}
              />
            </View>
            <View style={styles.commentRight}>
              <View style={[styles.commentLine, styles.commentHeadLine]}>
                <Text style={styles.commentTitle}>{item.user.nickname}</Text>
                <Text style={styles.commentTime}>{item.createdDate}</Text>
              </View>
              <View style={styles.commentLine}>
                <ScoreShow
                  score={item.score}
                />
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
            <TouchableOpacity onPress={()=>{Actions.SHOP_COMMENT_LIST({shopId: this.props.userOwnedShopInfo.id})}}>
              <Text style={styles.allCommentsLink}>查看全部评价</Text>
            </TouchableOpacity>
          </View>
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
                  <Text style={styles.subTxt}>{item.pv}人看过</Text>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        )
      })
    }
    return similarShopListView
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
                addImage={require('../../../assets/images/default_upload.png')}
                initValue={this.props.userOwnedShopInfo.coverUrl}
                closeModalAfterSelectedImg={true}
                imageSelectedChangeCallback={(url)=>{this.coverImageSelectedChangeCallback(url)}}
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
                : <TouchableOpacity onPress={()=>{this.uploadAlbum()}}>
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
                ? <TouchableOpacity onPress={()=>{Actions.SHOP_ANNOUNCEMENTS_MANAGE({id: this.props.userOwnedShopInfo.id})}}>
                    <View style={styles.shopAnnouncementContainer}>
                      <View style={styles.shopAnnouncementCoverWrap}>
                        <Image style={styles.shopAnnouncementCover} source={{uri: this.props.latestShopAnnouncement.coverUrl}}/>
                      </View>
                      <View style={styles.shopAnnouncementCnt}>
                        <View style={styles.shopAnnouncementTitleWrap}>
                          <Text numberOfLines={3} style={styles.shopAnnouncementTitle}>
                            {this.props.latestShopAnnouncement.content}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                : <TouchableOpacity onPress={()=>{Actions.SHOP_ANNOUNCEMENTS_MANAGE({id: this.props.userOwnedShopInfo.id})}}>
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
                  <Text style={styles.shopAnnouncementDateDay}>{this.props.latestShopAnnouncement.createdDay}</Text>
                  <Text style={styles.shopAnnouncementDateMonth}>{this.props.latestShopAnnouncement.createdMonth+1}</Text>
                </Image>
              </View>
            </View>
  
            {this.renderComments()}

            {this.renderSimilarShops()}

          </ScrollView>

          <View style={styles.bottomTabsWrap}>
            <TouchableOpacity style={styles.bottomTabWrap} onPress={()=>{Actions.SHOP_COMMENT_LIST({shopId: this.props.userOwnedShopInfo.id})}}>
              <Image style={{}} source={require('../../../assets/images/artical_comments_unselect.png')}/>
              <Text style={styles.bottomTabTxt}>全部评论</Text>
              {this.props.shopCommentsTotalCount > 0 &&
                <View style={styles.commentBtnBadge}>
                  <Text style={styles.commentBtnBadgeTxt}>{this.props.shopCommentsTotalCount > 99 ? '99+' : this.props.shopCommentsTotalCount}</Text>
                </View>
              }
            </TouchableOpacity>

            <TouchableOpacity style={styles.bottomTabWrap} onPress={()=>{this.ActionSheet.show()}}>
              <Image style={{}} source={require('../../../assets/images/shop_edite.png')}/>
              <Text style={styles.bottomTabTxt}>编辑店铺</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.bottomTabWrap} onPress={()=>{Actions.SHOP_DETAIL({id: this.props.userOwnedShopInfo.id})}}>
              <Image style={{}} source={require('../../../assets/images/shop_review.png')}/>
              <Text style={styles.bottomTabTxt}>查看我的</Text>
            </TouchableOpacity>

          </View>

          <ActionSheet
            ref={(o) => this.ActionSheet = o}
            title="编辑店铺"
            options={['重新认证', '编辑封面', '编辑相册', '编辑资料', '编辑公告', '取消']}
            cancelButtonIndex={5}
            onPress={this._handleActionSheetPress.bind(this)}
          />


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
  const shopComments = selectShopComments(state, userOwnedShopInfo.id)
  const shopCommentsTotalCount = selectShopCommentsTotalCount(state, userOwnedShopInfo.id)
  const userFollowees = authSelector.selectUserFollowees(state)
  const similarShopList = selectSimilarShopList(state, userOwnedShopInfo.id)
  return {
    userOwnedShopInfo: userOwnedShopInfo,
    isUserLogined: isUserLogined,
    shopFollowers: shopFollowers,
    shopFollowersTotalCount: shopFollowersTotalCount,
    latestShopAnnouncement: latestShopAnnouncement,
    shopComments: shopComments,
    shopCommentsTotalCount: shopCommentsTotalCount,
    userFollowees: userFollowees,
    similarShopList: similarShopList
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  submitFormData,
  submitInputData,
  fetchUserOwnedShopInfo,
  fetchShopFollowers,
  fetchShopFollowersTotalCount,
  fetchShopAnnouncements,
  fetchShopCommentList,
  fetchShopCommentTotalCount,
  fetchUserFollowees,
  fetchSimilarShopList
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
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: normalizeBorder(),
    borderColor: '#E9E9E9'
  },
  noAlbumText: {
    color: THEME.colors.green,
    fontWeight: 'bold',
    fontSize: em(17)
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalizeW(10),
  },
  attentionAvatarImg: {
    width: normalizeW(35),
    height: normalizeW(35),
    borderRadius: normalizeW(35/2),
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
    justifyContent: 'center'
  },
  shopAnnouncementTitleWrap: {
    marginTop: normalizeH(10)
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
  },
  commentWrap: {
    paddingLeft: normalizeW(10),
    paddingTop: normalizeH(10),
    backgroundColor: '#fff',
    marginBottom: 10,
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
    justifyContent: 'space-between'
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
  bottomTabsWrap: {
    height:50,
    paddingLeft:10,
    borderTopWidth:normalizeBorder(),
    borderTopColor: '#686868',
    backgroundColor:'rgba(0,0,0,0.005)',
    flexDirection:'row',
    justifyContent: 'space-around',
    alignItems:'center'
  },
  bottomTabWrap: {
    height:38,
    justifyContent:'center',
    alignItems: 'center'
  },
  commentBtnBadge:{
    alignItems: 'center',
    width: 30,
    backgroundColor:'#f5a623',
    position:'absolute',
    right:0,
    top:0,
    borderRadius:10,
    borderWidth:normalizeBorder(),
    borderColor: '#f5a623'
  },
  commentBtnBadgeTxt:{
    fontSize: 9,
    color: '#fff'
  },
  bottomTabTxt: {
    marginTop: 3,
    fontSize: em(15),
    color: '#8f8e94'
  }

})