/**
 * Created by yangyang on 2016/12/1.
 *
 *bugs:
 * renderRow={(rowData, rowId) => {this.renderRow(rowData, rowId)}}
 * StaticRenderer.render(): A valid React element(or null) must be returned.
 *
 * 解决:
 * renderRow={(rowData, rowId) => this.renderRow(rowData, rowId)}
 * remove {} of this.renderRow(rowData, rowId)
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
  Image,
  Platform,
  InteractionManager,
  StatusBar,
  Linking,
  Animated,
  AsyncStorage,
  TouchableWithoutFeedback,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import {getBanner, selectShopCategories, getTopicCategories,getNoUpdateVersion} from '../../selector/configSelector'
import {fetchBanner, fetchShopCategories, getAllTopicCategories,fetchAppNoUpdate} from '../../action/configAction'
import {getCurrentLocation} from '../../action/locAction'
import CommonListView from '../common/CommonListView'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import Header from '../common/Header'
import * as authSelector from '../../selector/authSelector'
import MessageBell from '../common/MessageBell'
import NearbyTopicView from './NearbyTopicView'
import NearbyShopView from './NearbyShopView'
import NearbySalesView from './NearbySalesView'
import {getCity, getGeopoint} from '../../selector/locSelector'
import * as Toast from '../common/Toast'
import {selectLocalGoodPromotion, selectUserOwnedShopInfo} from '../../selector/shopSelector'
import {getShopPromotion} from '../../action/shopAction'
import codePush from 'react-native-code-push'
import {NativeModules, NativeEventEmitter, DeviceEventEmitter} from 'react-native'
import {checkUpdate} from '../../api/leancloud/update'
import Popup from '@zzzkk2009/react-native-popup'
import ViewPager from '../common/ViewPager'
import shallowequal from 'shallowequal'
import {IDENTITY_SHOPKEEPER, INVITE_SHOP} from '../../constants/appConfig'
import {getShopTenant} from '../../action/promoterAction'

import SearchBar from '../common/SearchBar'
import {CachedImage} from "react-native-img-cache"
import AV from 'leancloud-storage'


const RNDeviceInfo = NativeModules.RNDeviceInfo

// require("NSBundle");

// const version = NSBundle.mainBundle().objectForInfoDictionaryKey("CFBundleShortVersionString");
const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class Home extends Component {

  constructor(props) {
    super(props)
    this.state = {
      fade: new Animated.Value(0),
      showActivityBtn: true,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!shallowequal(this.props, nextProps)) {
      return true;
    }
    if (!shallowequal(this.state, nextState)) {
      return true;
    }
    return false;
  }


  checkIosUpdate(){
    let platform = Platform.OS
    if(platform==='ios'){
      fetch('https://itunes.apple.com/lookup?id=1224852246',{
        method:'POST'
      }).then((data)=>{
        data.json().then((result)=>{
          // console.log('data',data)
          console.log('result',result.results[0].version)
          console.log('data',RNDeviceInfo.appVersion)
          let version = result.results[0].version
          if(version>RNDeviceInfo.appVersion){
            if(result.version>this.props.noUpdateVersion) {

              this.isUpdate(result.results[0])
            }
          }
        })


      })
    }else if (platform==='android'){
      checkUpdate().then((result)=>{

        if(result.version>RNDeviceInfo.appVersion){

          if(result.version>this.props.noUpdateVersion){
            this.isUpdate({trackViewUrl:result.fileUrl,version:result.version})
          }
       }
      })
    }

  }

  isUpdate(result) {
    Popup.confirm({
      title: '版本更新',
      content: '汇邻优店已发布新版本v'+result.version+'，当前版本为v'+RNDeviceInfo.appVersion+'，点击确定更新',
      ok: {
        text: '确定',
        style: {color: THEME.base.mainColor},
        callback: ()=> {
          // url='https://itunes.apple.com/app/id=1224852246'
          // console.log('result.trackViewUrl',result.trackViewUrl)
          let url= result.trackViewUrl
          Linking.openURL(url).catch(err => console.error('An error occurred', err));
        }
      },
      cancel: {
        text: '以后',
        callback: ()=> {
          this.props.fetchAppNoUpdate({noUpdateVersion:result.version})
        }
      }
    })
  }
  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.getCurrentLocation()
      this.refreshData()
      codePush.disallowRestart();//页面加载的禁止重启，在加载完了可以允许重启
    })
  }

  componentDidMount() {
    this.checkIosUpdate()
    // codePush.sync({installMode: codePush.InstallMode.ON_NEXT_RESUME});
  }
  
  componentWillReceiveProps(nextProps) {
  }

  renderRow(rowData, rowId) {
    switch (rowData.type) {
      case 'BANNER_COLUMN':
        return this.renderBannerColumn()
      // case 'NEARBY_TOPIC':
      //   return this.renderNearbyTopic()
      case 'NEARBY_SHOP':
        return this.renderNearbyShop()
      case 'NEARBY_SHOP_PROMOTION':
        return this.renderNearbySalesView()
      default:
        return <View />
    }
  }

  handleOnScroll(e) {
    let offset = e.nativeEvent.contentOffset.y
    let comHeight = normalizeH(159)
    if (offset >= 0 && offset < 10) {
      Animated.timing(this.state.fade, {
        toValue: 0,
        duration: 100,
      }).start()
      this.setState({showActivityBtn: true})
    } else if (offset > 10 && offset < comHeight) {
      Animated.timing(this.state.fade, {
        toValue: (offset - 10)/comHeight,
        duration: 100,
      }).start()
      this.setState({showActivityBtn: true})
    } else if (offset >= comHeight) {
      Animated.timing(this.state.fade, {
        toValue: 1,
        duration: 100,
      }).start()
      this.setState({showActivityBtn: false})
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
        height: normalizeH(64),
        zIndex: 10,
      }}
      >
        <Header
          leftType="image"
          leftImageSource={require("../../assets/images/location.png")}
          leftImageLabel={this.props.city}
          headerContainerStyle={{borderBottomWidth: 0, backgroundColor: 'transparent', position: 'relative'}}
          leftPress={() => {
          }}
          centerComponent={() => {
            return <SearchBar />
          }}
          rightComponent={() => {
            return <MessageBell />
          }}
        />
      </Animated.View>
    )
  }

  bannerClickListener(banner) {
    let actionType = banner.actionType
    let action = banner.action
    let title = banner.title
    if(actionType == 'link') {
      let payload = {
        url: action,
        showHeader: !!title,
        headerTitle: title,
        headerRightType: 'image',
        headerRightImageSource: require('../../assets/images/active_share.png'),
        headerRightPress: () => {Actions.SHARE({
          title: "汇邻优店",
          url: action,
          author: '邻家小二',
          abstract: "邻里互动，同城交易",
          cover: "https://simors.github.io/ljyd_blog/ic_launcher.png",
        })},
      }
      return (
        Actions.COMMON_WEB_VIEW(payload)
      )
    }else if(actionType == 'toast') {
      Toast.show(action)
    }else if(actionType == 'action') {
      Actions[action]()
    }
  }

  renderBannerColumn() {
     // console.log('this.props.banner====', this.props.banner)

    if (this.props.banner && this.props.banner.length) {
      let pages = this.props.banner.map((item, index) => {
        let image = item.image
        return (
          <TouchableOpacity
            style={{flex:1}}
            key={'b_image_' + index}
            onPress={() => this.bannerClickListener(item)}
          >
            <CachedImage
              mutable
              style={[{width:PAGE_WIDTH,height: normalizeH(223)}]}
              resizeMode="stretch"
              source={typeof(image) == 'string' ? {uri: image} : image}
            />
          </TouchableOpacity>
        )
      })

      let dataSource = new ViewPager.DataSource({
        pageHasChanged: (p1, p2) => p1 !== p2,
      })
      // console.log('dataSource',pages)
      return (
        <View style={styles.advertisementModule}>
          <ViewPager
            style={{flex:1}}
            dataSource={dataSource.cloneWithPages(pages)}
            renderPage={this._renderPage}
            isLoop={true}
            autoPlay={true}
          />
          {/*<ViewPager2 dataSource={this.props.banner} />*/}
        </View>
      )
    }

    return (
      <View style={styles.advertisementModule} />
    )
  }

  _renderPage(data: Object, pageID) {
    return (
      <View style={{flex:1}}>
        {data}
      </View>
    )
  }

  renderNearbyTopic() {
    return (
      <View style={styles.moduleSpace}>
        <NearbyTopicView />
      </View>
    )
  }

  renderNearbyShop() {
    return (
      <View style={styles.moduleSpace}>
        <NearbyShopView
          allShopCategories={this.props.allShopCategories}
        />
      </View>
    )
  }

  renderNearbySalesView() {
    let prompList = this.props.shopPromotionList
    return (
      <View style={{}}>
        <NearbySalesView
          shopPromotionList={prompList}
        />
      </View>
    )
  }

  activityManage = () => {
    if (!this.props.isUserLogined) {
      Actions.LOGIN()
      return
    }
    let activeUserId = this.props.activeUserId
    let userOwnedShopInfo = this.props.userOwnedShopInfo
    if(userOwnedShopInfo.status == 1) {
      if(userOwnedShopInfo.payment == 1) { //已注册，已支付
        if(!userOwnedShopInfo.coverUrl) {
          Actions.COMPLETE_SHOP_COVER()
        }else{
          Actions.SHOP_GOOD_PROMOTION_MANAGE({shopId: userOwnedShopInfo.id})
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
                'user': activeUserId,
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
    } else if (userOwnedShopInfo.status == 0) {
      Toast.show('您的店铺已被关闭，请与客服联系')
    } else {
      Toast.show('您的店铺目前处于异常状态，请联系客服')
    }
  }

  renderShortcutBtn() {
    let identity = this.props.identity
    let isUserLogined = this.props.isUserLogined
    if (!isUserLogined || !identity) return null
    if (identity.includes(IDENTITY_SHOPKEEPER)) {
      return this.state.showActivityBtn ? (
        <TouchableOpacity onPress={this.activityManage} style={styles.activityBtn}>
          <View style={styles.activityBtnView}>
            <Text style={{fontSize: em(12), color: '#FFF'}}>促销</Text>
          </View>
        </TouchableOpacity>
      ) : null
    } else {
      return this.state.showActivityBtn ? (
        <TouchableOpacity onPress={() => Actions.SHOPR_EGISTER()} style={styles.activityBtn}>
          <View style={styles.activityBtnView}>
            <Text style={{fontSize: em(12), color: '#FFF'}}>开店</Text>
          </View>
        </TouchableOpacity>
      ) : null
    }
  }

  refreshData(payload) {
    this.props.fetchBanner({type: 0})
    this.props.getAllTopicCategories({})
    this.props.fetchShopCategories()
    this.loadMoreData(true)
  }

  loadMoreData(isRefresh) {
    if(this.isQuering) {
      return
    }
    this.isQuering = true

    let geoPoint = this.props.geoPoint
    let lastDistance = undefined
    if (isRefresh) {
      lastDistance = undefined
    } else {
      if (geoPoint && this.props.lastShopGeo) {
        lastDistance = this.props.lastShopGeo.kilometersTo(new AV.GeoPoint(geoPoint)) + 0.001
      }
    }

    let payload = {
      geo: geoPoint ? [geoPoint.latitude, geoPoint.longitude] : [],
      lastDistance: lastDistance,
      isRefresh: !!isRefresh,
      nowDate: new Date(),
      success: (isEmpty) => {
        this.isQuering = false
        if(!this.listView) {
          return
        }
        if(isEmpty) {
          this.listView.isLoadUp(false)
        } else {
          this.listView.isLoadUp(true)
        }
      },
      error: (err)=>{
        this.isQuering = false
        Toast.show(err.message, {duration: 1000})
      }
    }

    // 第一次加载时，可能geo数据还没有从持久化数据中恢复
    if (geoPoint.latitude == 0 || geoPoint.longitude == 0) {
      AsyncStorage.getItem('reduxPersist:CONFIG').then((data) => {
        let jsonData = JSON.parse(data)
        let location = jsonData.location
        geoPoint = {latitude: location.latitude, longitude: location.longitude}
        payload.geo = geoPoint
        this.props.getShopPromotion(payload)
      })
      return
    }
    this.props.getShopPromotion(payload)
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderMainHeader()}

        <View style={styles.body}>
          <View style={{flex:1}}>
            {/*<Text style={{fontSize:em(20)}}>看看能不能更新</Text>*/}
            <CommonListView
              name="homeList"
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
        </View>
        {this.renderShortcutBtn()}
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let ds = undefined
  if (ownProps.ds) {
    ds = ownProps.ds
  } else {
    ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2,
    })
  }

  let dataArray = []
  dataArray.push({type: 'BANNER_COLUMN'})
  // dataArray.push({type: 'NEARBY_TOPIC'})
  dataArray.push({type: 'NEARBY_SHOP'})
  dataArray.push({type: 'NEARBY_SHOP_PROMOTION'})

  const banner = getBanner(state, 0)

  const shopPromotionList = selectLocalGoodPromotion(state) || []
  // console.log('shopPromotionList+====>',shopPromotionList)
  let lastShopGeo = undefined
  if(shopPromotionList && shopPromotionList.length) {
    lastShopGeo = shopPromotionList[shopPromotionList.length-1].geo
  }

  let activeUserInfo = authSelector.activeUserInfo(state)

  let geoPoint = getGeopoint(state)
  let geoCity = getCity(state)

  if(geoCity == '全国') {
    if(activeUserInfo && activeUserInfo.geoCity) {
      geoCity = activeUserInfo.geoCity
    }

    if(activeUserInfo && activeUserInfo.geo) {
      geoPoint = activeUserInfo.geo
    }
  }

  const allShopCategories = selectShopCategories(state)
  const noUpdateVersion = getNoUpdateVersion(state)

  const userOwnedShopInfo = selectUserOwnedShopInfo(state)
  const isUserLogined = authSelector.isUserLogined(state)
  let identity = authSelector.getUserIdentity(state, activeUserInfo.id)
  let activeUserId = authSelector.activeUserId(state)

  return {
    banner: banner,
    ds: ds.cloneWithRows(dataArray),
    city: geoCity,
    geoPoint: geoPoint,
    shopPromotionList: shopPromotionList,
    allShopCategories: allShopCategories,
    noUpdateVersion:noUpdateVersion,
    lastShopGeo: lastShopGeo,
    userOwnedShopInfo: userOwnedShopInfo,
    isUserLogined: isUserLogined,
    identity: identity,
    activeUserId: activeUserId,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchBanner,
  getAllTopicCategories,
  getCurrentLocation,
  fetchShopCategories,
  fetchAppNoUpdate,
  getShopPromotion,
  getShopTenant,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Home)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  contentContainerStyle: {
    paddingBottom: 49
  },
  body: {
    // marginTop: normalizeH(64),
    flex: 1,
    marginBottom: normalizeH(45),
  },
  advertisementModule: {
    height: normalizeH(223),
    backgroundColor: '#fff', //必须加上,否则android机器无法显示banner
  },
  moduleSpace: {
    paddingBottom: normalizeH(8),
  },
  activityBtn: {
    position: 'absolute',
    bottom: normalizeH(70),
    right: normalizeW(30),
    zIndex: 11,
  },
  activityBtnView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: normalizeW(40),
    height: normalizeW(40),
    borderRadius: normalizeW(20),
    overflow: 'hidden',
    backgroundColor: THEME.base.mainColor,
    opacity: 0.7,
  },
})