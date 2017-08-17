/**
 * Created by yangyang on 2017/8/11.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  Platform,
  InteractionManager,
  StatusBar,
  NativeModules
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import THEME from '../../constants/themes/theme1'
import * as Toast from '../common/Toast'
import Svg from '../common/Svgs'
import Avatar from '../common/Avatar'
import PromoterIcon from '../common/PromoterIcon'
import * as authSelector from '../../selector/authSelector'
import {getShareDomain} from '../../selector/configSelector'
import {
  isPromoterPaid,
  activePromoter,
  getTenantFee,
  selectPromoterIdentity,
  getPromoterById
} from '../../selector/promoterSelector'
import {getCurrentPromoter, getPromoterTenant, getShopTenant} from '../../action/promoterAction'
import {selectUserOwnedShopInfo} from '../../selector/shopSelector'
import {fetchUserOwnedShopInfo} from '../../action/shopAction'
import {fetchUserFollowees, bindWithWeixin} from '../../action/authActions'
import {IDENTITY_SHOPKEEPER, INVITE_SHOP} from '../../constants/appConfig'

const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height

class Mine extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{
      if(this.props.isUserLogined) {
        this.props.fetchUserFollowees()
      }
    })
  }

  showQrCodeView() {
    if(this.props.promoter && this.props.promoter.qrcode) {
      Actions.QRCODE_VIEW({qrcodeUrl: this.props.promoter.qrcode.url})
    }
  }

  shareToFriend() {
    let shareUrl = this.props.shareDomain + "appDownload?userId=" + this.props.currentUserId

    Actions.SHARE({
      title: "汇邻优店",
      url: shareUrl,
      author: this.props.userInfo.nickname || '邻家小二',
      abstract: "邻里互动，同城交易",
      cover: "https://simors.github.io/ljyd_blog/ic_launcher.png",
    })
  }

  shopManage() {
    if (this.props.identity && this.props.identity.includes(IDENTITY_SHOPKEEPER)) {
      let userOwnedShopInfo = this.props.userOwnedShopInfo
      if(userOwnedShopInfo.status == 1) {
        if(userOwnedShopInfo.payment == 1) { //已注册，已支付
          if(!userOwnedShopInfo.coverUrl) {
            Actions.COMPLETE_SHOP_INFO()
          }else{
            Actions.MY_SHOP_INDEX()
          }
        }else{//已注册，未支付
          this.props.getShopTenant({
            province: userOwnedShopInfo.geoProvince,
            city: userOwnedShopInfo.geoCity,
            success: (tenant) =>{
              Actions.PAYMENT({
                metadata: {
                  'shopId':userOwnedShopInfo.id,
                  'tenant': tenant,
                  'user': this.props.userInfo.id,
                  'dealType': INVITE_SHOP
                },
                price: tenant,
                subject: '店铺入驻汇邻优店加盟费',
                paySuccessJumpScene: 'SHOPR_EGISTER_SUCCESS',
                paySuccessJumpSceneParams: {
                  shopId: userOwnedShopInfo.id,
                  tenant: tenant,
                },
                payErrorJumpScene: 'MINE',
                payErrorJumpSceneParams: {}
              })
            },
            error: (error)=>{
              Toast.show('获取加盟费金额失败')
            }
          })
        }
      } else if(userOwnedShopInfo.status == 0) {
        Toast.show('您的店铺已被关闭，请与客服联系')
      }else{
        Toast.show('您的店铺目前处于异常状态，请联系客服')
      }
    }else {
      Actions.SHOPR_EGISTER()
    }
  }

  renderHeaderView() {
    let userInfo = this.props.userInfo
    let promoter = this.props.promoter
    if (!userInfo || !promoter) {
      return <View/>
    }
    return (
      <View style={styles.header}>
        <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: normalizeH(20)}}>
          <TouchableOpacity onPress={()=> Actions.SETTING()} style={styles.setBtnStyle}>
            <Svg height={45} width={32} icon="set"/>
            <Text style={styles.headerFont}>设置</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerMainView}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => Actions.PROFILE()}>
              <Avatar size={60} src={userInfo.avatar} />
            </TouchableOpacity>
            <View style={{marginLeft: normalizeW(9)}}>
              <Text style={[styles.headerFont, {paddingTop: normalizeH(3), paddingBottom: normalizeH(8)}]}>{userInfo.nickname}</Text>
              <PromoterIcon level={promoter.level} />
            </View>
          </View>
          <TouchableOpacity onPress={() => {this.showQrCodeView()}}>
            <Svg size={24} icon="code" />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderShopMenu() {
    if (this.props.identity && this.props.identity.includes(IDENTITY_SHOPKEEPER)) {
      return (
        <View style={styles.menuItemView}>
          <TouchableOpacity style={styles.menuItem} onPress={() => {this.shopManage()}}>
            <View style={{marginLeft: normalizeW(26), marginRight: normalizeW(35)}}>
              <Svg size={24} icon="my_shop"/>
            </View>
            <View>
              <Text style={styles.menuText}>店铺管理</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, {borderBottomWidth: 0}]} onPress={() => {}}>
            <View style={{marginLeft: normalizeW(26), marginRight: normalizeW(35)}}>
              <Svg size={24} icon="shop_order"/>
            </View>
            <View>
              <Text style={styles.menuText}>订单管理</Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    }
    return (
      <View style={styles.menuItemView}>
        <TouchableOpacity style={[styles.menuItem, {borderBottomWidth: 0}]} onPress={() => {this.shopManage()}}>
          <View style={{marginLeft: normalizeW(26), marginRight: normalizeW(35)}}>
            <Svg size={24} icon="my_shop"/>
          </View>
          <View>
            <Text style={styles.menuText}>我要开店</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  renderBodyView() {
    return (
      <View style={{backgroundColor: 'rgba(0,0,0,0.05)'}}>
        <View style={styles.mainBtnView}>
          <TouchableOpacity style={{paddingLeft: normalizeW(31)}} onPress={() => {Actions.MYTOPIC()}}>
            <Svg size={32} icon="my_topic" />
            <Text style={styles.funBtnText}>话题</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {Actions.MYFANS()}}>
            <Svg size={32} icon="my_fans" />
            <Text style={styles.funBtnText}>粉丝</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {Actions.MYATTENTION()}}>
            <Svg size={32} icon="my_follow" />
            <Text style={styles.funBtnText}>关注</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{paddingRight: normalizeW(31)}} onPress={() => {Actions.PROMOTER_PERFORMANCE()}}>
            <Svg size={32} icon="spread" />
            <Text style={styles.funBtnText}>推广</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.menuItemView}>
          <TouchableOpacity style={styles.menuItem} onPress={() => {Actions.USER_ORDERS_VIEWER()}}>
            <View style={{marginLeft: normalizeW(26), marginRight: normalizeW(35)}}>
              <Svg size={24} icon="my_order"/>
            </View>
            <View>
              <Text style={styles.menuText}>我的订单</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => {Actions.MESSAGE_BOX()}}>
            <View style={{marginLeft: normalizeW(26), marginRight: normalizeW(35)}}>
              <Svg size={24} icon="message_24"/>
            </View>
            <View>
              <Text style={styles.menuText}>消息中心</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => {Actions.MY_DRAFTS()}}>
            <View style={{marginLeft: normalizeW(26), marginRight: normalizeW(35)}}>
              <Svg size={24} icon="drafts_24"/>
            </View>
            <View>
              <Text style={styles.menuText}>草稿箱</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, {borderBottomWidth: 0}]} onPress={() => {Actions.WALLET()}}>
            <View style={{marginLeft: normalizeW(26), marginRight: normalizeW(35)}}>
              <Svg size={24} icon="my_wallet"/>
            </View>
            <View>
              <Text style={styles.menuText}>钱包</Text>
            </View>
          </TouchableOpacity>
        </View>
        {this.renderShopMenu()}
        <View style={styles.menuItemView}>
          <TouchableOpacity style={styles.menuItem} onPress={() => {this.shareToFriend()}}>
            <View style={{marginLeft: normalizeW(26), marginRight: normalizeW(35)}}>
              <Svg size={24} icon="recommoned"/>
            </View>
            <View>
              <Text style={styles.menuText}>分享下载</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, {borderBottomWidth: 0}]} onPress={() => {Actions.ADVISE_FEEDBACK()}}>
            <View style={{marginLeft: normalizeW(26), marginRight: normalizeW(35)}}>
              <Svg size={24} icon="sugguestion"/>
            </View>
            <View>
              <Text style={styles.menuText}>意见反馈</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{height: normalizeH(100), backgroundColor: '#FFF'}}></View>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 1, marginBottom: normalizeH(45)}}>
          <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
            {this.renderHeaderView()}
            {this.renderBodyView()}
          </ScrollView>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let currentUserId = authSelector.activeUserId(state)
  let currentPromoterId = activePromoter(state)
  let userInfo = authSelector.activeUserInfo(state)
  const userOwnedShopInfo = selectUserOwnedShopInfo(state)
  const isUserLogined = authSelector.isUserLogined(state)
  let promoter = getPromoterById(state, currentPromoterId)
  let identity = authSelector.getUserIdentity(state,currentUserId)
  let shareDomain = getShareDomain(state)
  return {
    currentUserId: currentUserId,
    userInfo: userInfo,
    userOwnedShopInfo: userOwnedShopInfo,
    isUserLogined: isUserLogined,
    identity: identity,
    promoter: promoter,
    shareDomain: shareDomain,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchUserFollowees,
  getShopTenant,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Mine)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: THEME.base.backgroundColor,
  },
  header: {
    width: PAGE_WIDTH,
    height: normalizeH(135),
    backgroundColor: THEME.base.mainColor,
  },
  headerFont: {
    fontSize: 17,
    color: '#FFF',
  },
  setBtnStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: normalizeW(15),
  },
  headerMainView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: normalizeW(19),
    paddingRight: normalizeW(29),
    paddingBottom: normalizeH(12),
  },
  mainBtnView: {
    backgroundColor: '#FFF',
    height: normalizeH(89),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  funBtnText: {
    fontSize: em(16),
    color: 'rgba(0,0,0,0.6)',
    paddingTop: normalizeH(8),
  },
  menuItemView: {
    marginTop: normalizeH(10),
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  menuItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#F7F7F7',
    height: normalizeH(54),
  },
  menuText: {
    fontSize: em(16),
    color: 'rgba(0,0,0,0.6)',
  },
})