/**
 * Created by yangyang on 2017/3/8.
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
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import THEME from '../../constants/themes/theme1'
import * as Toast from '../common/Toast'
import LinearGradient from 'react-native-linear-gradient'
import {fetchUserFollowees} from '../../action/authActions'
import {selectUserOwnedShopInfo} from '../../selector/shopSelector'
import {fetchUserOwnedShopInfo} from '../../action/shopAction'
import {fetchUserPoint} from '../../action/pointActions'
import * as authSelector from '../../selector/authSelector'
import {IDENTITY_SHOPKEEPER, IDENTITY_PROMOTER} from '../../constants/appConfig'
import {getCurrentPromoter} from '../../action/promoterAction'

const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height

class Mine extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{
      if(this.props.isUserLogined) {
        this.props.fetchUserPoint()
        this.props.fetchUserOwnedShopInfo()
        this.props.fetchUserFollowees()
      }
    })
  }

  shopManage() {
    if(!this.props.isUserLogined) {
      Actions.LOGIN()
    }else {
      // console.log('this.props.identity=====', this.props.identity)
      if (this.props.identity && this.props.identity.includes(IDENTITY_SHOPKEEPER)) {
        // console.log('this.props.identity==1==')
        Actions.MY_SHOP_INDEX()
      }else {
        // console.log('this.props.identity==2===')
        Actions.SHOPR_EGISTER()
      }

    }
  }

  promoterManage() {
    if (this.props.identity && this.props.identity.includes(IDENTITY_PROMOTER)) {
      InteractionManager.runAfterInteractions(()=>{
        this.props.getCurrentPromoter({error: (err) => {
          Toast.show(err)
        }})
      })
      Actions.PROMOTER_PERFORMANCE()
    } else {
      Actions.PROMOTER_AUTH()
    }
  }

  genPersonalQRCode() {
    let userInfo = {
      userId: this.props.userInfo.id,
      nickname: this.props.userInfo.nickname,
      avatar: this.props.userInfo.avatar,
    }
    Actions.GEN_PERSONALQR({data: userInfo})
  }

  renderToolView() {
    return (
      <View style={styles.toolView}>
        <View style={{marginRight: normalizeW(25)}}>
          <TouchableOpacity onPress={() => {
            Actions.QRCODEREADER({
              readQRSuccess: (userInfo) => {
                let user = JSON.parse(userInfo)
                let userId = user.userId
                Actions.PERSONAL_HOMEPAGE({userId: userId})
              }
            })
          }}>
            <Image style={styles.toolBtnImg} resizeMode="contain" source={require('../../assets/images/scan.png')}/>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => Actions.SETTING()}>
            <Image style={styles.toolBtnImg} resizeMode="contain" source={require('../../assets/images/set.png')}/>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderAvatarView() {
    return (
      <View style={styles.avatarView}>
        <View style={{flexDirection: 'row', alignItems: 'center',}}>
          <View style={{marginLeft: normalizeW(57)}}>
            <TouchableOpacity onPress={() => Actions.PROFILE()}>
              <Image style={styles.avatarStyle}
                     source={this.props.userInfo.avatar ?
                     {uri: (this.props.userInfo.avatar)} : require('../../assets/images/default_portrait.png')} />
            </TouchableOpacity>
          </View>
          <View style={{marginLeft: normalizeW(17)}}>
            <View style={{marginBottom: normalizeH(10)}}>
              <Text style={styles.nicknameStyle}>{this.props.userInfo.nickname}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image style={{marginRight: normalizeW(8), width: normalizeW(9), height: normalizeH(12)}}
                     resizeMode="contain"
                     source={require('../../assets/images/score.png')} />
              <Text style={{fontSize: em(12), color: '#FFF'}}>积分  {this.props.point}</Text>
            </View>
          </View>
        </View>
        <View style={{paddingRight: normalizeW(36)}}>
          <TouchableOpacity onPress={() => {this.genPersonalQRCode()}}>
            <Image style={styles.toolBtnImg} resizeMode="contain" source={require('../../assets/images/code.png')}/>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderFunctionView() {
    return (
      <View style={styles.functionView}>
        <View style={[styles.funcView, {borderRightWidth: 1, borderColor: 'rgba(255,255,255,0.50)'}]}>
          <TouchableOpacity style={styles.funBtn} onPress={() => {Actions.MYTOPIC()}}>
            <Image style={{width: normalizeW(16), height: normalizeH(16)}} source={require('../../assets/images/my_topic.png')}/>
            <Text style={styles.funBtnText}>话题</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.funcView, {borderRightWidth: 1, borderColor: 'rgba(255,255,255,0.50)'}]}>
          <TouchableOpacity style={styles.funBtn} onPress={() => {Actions.MYFANS()}}>
            <Image style={{width: normalizeW(16), height: normalizeH(16)}} source={require('../../assets/images/my_fans.png')}/>
            <Text style={styles.funBtnText}>粉丝</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.funcView}>
          <TouchableOpacity style={styles.funBtn} onPress={() => {Actions.MYATTENTION()}}>
            <Image style={{width: normalizeW(16), height: normalizeH(16)}} source={require('../../assets/images/my_follow.png')}/>
            <Text style={styles.funBtnText}>关注</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderHeaderView() {
    return (
      <LinearGradient colors={['#F77418', '#F5A623', '#F77418']} style={styles.header}>
        <View style={{flex: 1, backgroundColor: 'transparent'}}>
          {this.renderToolView()}
          {this.renderAvatarView()}
          {this.renderFunctionView()}
        </View>
      </LinearGradient>
    )
  }

  renderShopBtnText() {
    if (this.props.identity && this.props.identity.includes(IDENTITY_SHOPKEEPER)) {
      return (
        <Text style={styles.menuName}>店铺管理</Text>
      )
    } else {
      return (
        <Text style={styles.menuName}>店铺注册</Text>
      )
    }
  }

  renderPromoterBtnText() {
    if (this.props.identity.includes(IDENTITY_PROMOTER)) {
      return (
        <Text style={styles.menuName}>推广联盟</Text>
      )
    } else {
      return (
        <Text style={styles.menuName}>推广注册</Text>
      )
    }
  }

  renderBodyView() {
    return (
      <View style={{marginTop: normalizeH(15)}}>
        <View style={styles.memuItemView}>
          <TouchableOpacity style={styles.menuItem} onPress={() => {this.shopManage()}}>
            <View style={styles.menuIcon}>
              <Image style={styles.menuImg} resizeMode="contain" source={require('../../assets/images/my_shop.png')} />
            </View>
            <View>
              {this.renderShopBtnText()}
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => {this.promoterManage()}}>
            <View style={styles.menuIcon}>
              <Image style={styles.menuImg} resizeMode="contain" source={require('../../assets/images/my_push.png')} />
            </View>
            <View>
              {this.renderPromoterBtnText()}
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
            <View style={styles.menuIcon}>
              <Image style={styles.menuImg} resizeMode="contain" source={require('../../assets/images/my_wallet.png')} />
            </View>
            <View>
              <Text style={styles.menuName}>钱包</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
            <View style={styles.menuIcon}>
              <Image style={styles.menuImg} resizeMode="contain" source={require('../../assets/images/contact.png')} />
            </View>
            <View>
              <Text style={styles.menuName}>联系客服</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
            <View style={styles.menuIcon}>
              <Image style={styles.menuImg} resizeMode="contain" source={require('../../assets/images/sugguestion.png')} />
            </View>
            <View>
              <Text style={styles.menuName}>意见反馈</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ScrollView style={{flex: 1, height: PAGE_HEIGHT, marginBottom: normalizeH(45)}}>
          {this.renderHeaderView()}
          {this.renderBodyView()}
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let currentUserId = authSelector.activeUserId(state)
  let userInfo = authSelector.activeUserInfo(state)
  const userOwnedShopInfo = selectUserOwnedShopInfo(state)
  const isUserLogined = authSelector.isUserLogined(state)
  let identity = authSelector.getUserIdentity(state,currentUserId)
  let point = authSelector.getUserPoint(state, currentUserId)
  return {
    userInfo: userInfo,
    userOwnedShopInfo: userOwnedShopInfo,
    isUserLogined: isUserLogined,
    identity: identity,
    point: point,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchUserOwnedShopInfo,
  fetchUserFollowees,
  fetchUserPoint,
  getCurrentPromoter,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Mine)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.base.backgroundColor,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
  },
  header: {
    width: PAGE_WIDTH,
    ...Platform.select({
      ios: {
        height: normalizeH(217)
      },
      android: {
        height: normalizeH(197)
      },
    }),
  },
  toolView: {
    ...Platform.select({
      ios: {
        marginTop: normalizeH(20)
      },
      android: {
        marginTop: normalizeH(0)
      },
    }),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: normalizeH(10),
    paddingBottom: normalizeH(10),
    paddingRight: normalizeW(35),
  },
  avatarView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  functionView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: normalizeH(69),
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.50)',
  },
  avatarStyle: {
    width: normalizeW(60),
    height: normalizeH(60),
    borderRadius: normalizeW(30),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  nicknameStyle: {
    fontSize: em(17),
    fontWeight: 'bold',
    color: '#FFF',
  },
  funcView: {
    flex: 1,
  },
  funBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  funBtnText: {
    fontSize: em(17),
    color: 'white',
    marginTop: normalizeH(8),
  },
  countText: {
    fontSize: em(12),
    color: 'white'
  },
  memuItemView: {

  },
  menuItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#F7F7F7',
    height: normalizeH(53),
  },
  menuIcon: {
    paddingLeft: normalizeW(27),
    paddingRight: normalizeW(41),
  },
  menuName: {
    fontSize: em(17),
    color: '#5A5A5A',
  },
  menuImg: {
    width: normalizeW(24),
    height: normalizeH(24),
  },
  toolBtnImg: {
    width: normalizeW(22),
    height: normalizeH(22),
  },
})