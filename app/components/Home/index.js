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
import CommonBanner from '../common/CommonBanner'
import CommonBanner2 from '../common/CommonBanner2'
import CommonMarquee2 from '../common/CommonMarquee2'
import Channels from './Channels'
import DailyChosen from './DailyChosen'
import Columns from './Columns'
import * as authSelector from '../../selector/authSelector'
import MessageBell from '../common/MessageBell'
import NearbyTopicView from './NearbyTopicView'
import NearbyShopView from './NearbyShopView'
import NearbySalesView from './NearbySalesView'
import {getCity, getGeopoint} from '../../selector/locSelector'
import * as Toast from '../common/Toast'
import {selectShopPromotionList} from '../../selector/shopSelector'
import {fetchShopPromotionList, clearShopPromotionList} from '../../action/shopAction'
import * as DeviceInfo from 'react-native-device-info'
import codePush from 'react-native-code-push'
import {NativeModules, NativeEventEmitter, DeviceEventEmitter} from 'react-native'
import {checkUpdate} from '../../api/leancloud/update'
import Popup from '@zzzkk2009/react-native-popup'


const RNDeviceInfo = NativeModules.RNDeviceInfo

// require("NSBundle");

// const version = NSBundle.mainBundle().objectForInfoDictionaryKey("CFBundleShortVersionString");
const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class Home extends Component {

  constructor(props) {
    super(props)
    // console.log('my version',version)
    this.state = {
      searchForm: {
        distance: 5,
        geo: props.geoPoint ? [props.geoPoint.latitude, props.geoPoint.longitude] : undefined,
        geoCity: props.city || '',
        skipNum: 0
      },
    }
  }

  checkIosUpdate(){
    // console.log('jhahahah',CommonNative)
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
        // console.log('result',result)
        // console.log('RNDeviceInfo.appVersion',RNDeviceInfo.appVersion)

        if(result.version>RNDeviceInfo.appVersion){
          // console.log('what wronghahahahahhaha',result.version,this.props.noUpdateVersion)

          if(result.version>this.props.noUpdateVersion){
            // console.log('what wrong',result.version,this.props.noUpdateVersion)
            this.isUpdate({trackViewUrl:result.fileUrl})
          }else {
            // console.log('here is right',result.version,this.props.noUpdateVersion)

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
          // console.log('cancel',result.version)
          this.props.fetchAppNoUpdate({noUpdateVersion:result.version})
        }
      }
    })
  }
  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.getCurrentLocation()
      this.refreshData()
    })
  }

  componentDidMount() {
    if(DeviceInfo.isEmulator()) {
      this.state.searchForm.geo = [28.213866,112.8186868]
      this.state.searchForm.geoCity = '长沙'
      this.setState({
        searchForm: {
          ...this.state.searchForm,
          geo: this.state.searchForm.geo,
          geoCity: this.state.searchForm.geoCity
        }
      })
    }
    // codePush.sync()
    this.checkIosUpdate()
    // codePush.sync({installMode: codePush.InstallMode.ON_NEXT_RESUME});
  }
  
  componentWillReceiveProps(nextProps) {
    // console.log('componentWillReceiveProps.props===', this.props)
    // console.log('componentWillReceiveProps.nextProps===', nextProps)
    if(nextProps.nextSkipNum) {
      // this.state.searchForm.skipNum = nextProps.nextSkipNum
      this.setState({
        searchForm: {
          ...this.state.searchForm,
          skipNum: nextProps.nextSkipNum
        }
      })
    }
  }

  renderRow(rowData, rowId) {
    switch (rowData.type) {
      case 'BANNER_COLUMN':
        return this.renderBannerColumn()
      case 'NEARBY_TOPIC':
        return this.renderNearbyTopic()
      case 'NEARBY_SHOP':
        return this.renderNearbyShop()
      case 'NEARBY_SHOP_PROMOTION':
        return this.renderNearbySalesView()
      default:
        return <View />
    }
  }

  renderBannerColumn() {
    if (this.props.banner && this.props.banner.length > 1) {
      return (
        <View style={styles.advertisementModule}>
          <CommonBanner2
            banners={this.props.banner}
          />
        </View>
      )
    } else {
      return (
        <View style={styles.advertisementModule}></View>
      )
    }
  }

  renderNearbyTopic() {
    return (
      <View style={styles.moduleSpace}>
        <NearbyTopicView />
      </View>
    )
  }

  renderNearbyShop() {
    // console.log('renderNearbyShop.this.props.shopPromotionList====', this.props.shopPromotionList)
    return (
      <View style={styles.moduleSpace}>
        <NearbyShopView
          allShopCategories={this.props.allShopCategories}
        />
      </View>
    )
  }

  renderNearbySalesView() {
    return (
      <View style={{}}>
        <NearbySalesView
          shopPromotionList={this.props.shopPromotionList}
        />
      </View>
    )
  }



  refreshData() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchBanner({type: 0})
      this.props.getAllTopicCategories({})
      this.props.fetchShopCategories()
    })
    this.loadMoreData(true)
  }

  loadMoreData(isRefresh) {
    // console.log('loadMoreData.isRefresh===', isRefresh)
    if(this.isQuering) {
      return
    }
    this.isQuering = true
    // console.log('loadMoreData.isQuering=123==', this.isQuering)
    // console.log('loadMoreData.isRefresh==12=', isRefresh)

    let payload = {
      ...this.state.searchForm,
      isRefresh: !!isRefresh,
      success: (isEmpty) => {
        this.isQuering = false
        if(!this.listView) {
          return
        }
        // console.log('loadMoreData.isEmpty=====', isEmpty)
        if(isEmpty) {
          if(isRefresh && this.state.searchForm.distance) {
            this.setState({
              searchForm: {
                ...this.state.searchForm,
                distance: ''
              }
            }, ()=>{
              // console.log('isEmpty===', isEmpty)
              this.refreshData()
            })
          }
          this.listView.isLoadUp(false)
        }else {
          this.listView.isLoadUp(true)
        }
      },
      error: (err)=>{
        this.isQuering = false
        Toast.show(err.message, {duration: 1000})
      }
    }
    this.props.fetchShopPromotionList(payload)
  }

  render() {
    return (
      <View style={styles.container}>
        {/*<StatusBar hidden={false} translucent={true} backgroundColor="transparent" barStyle="dark-content"/>*/}
        <Header
          leftType="image"
          leftImageSource={require("../../assets/images/location.png")}
          leftImageLabel={this.props.city}
          leftPress={() => {
          }}
          title="汇邻优店"
          rightComponent={() => {
            return <MessageBell />
          }}
        />

        <View style={styles.body}>
          <View style={{flex:1}}>
            {/*<Text style={{fontSize:em(20)}}>看看能不能更新</Text>*/}
            <CommonListView
              contentContainerStyle={{backgroundColor: '#F5F5F5'}}
              dataSource={this.props.ds}
              renderRow={(rowData, rowId) => this.renderRow(rowData, rowId)}
              loadNewData={()=> {
                this.refreshData()
              }}
              loadMoreData={()=> {
                this.loadMoreData()
              }}
              ref={(listView) => this.listView = listView}
            />
          </View>
        </View>
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
  dataArray.push({type: 'NEARBY_TOPIC'})
  dataArray.push({type: 'NEARBY_SHOP'})
  dataArray.push({type: 'NEARBY_SHOP_PROMOTION'})

  const banner = getBanner(state, 0)

  const shopPromotionList = selectShopPromotionList(state) || []
  let nextSkipNum = 0
  if(shopPromotionList && shopPromotionList.length) {
    nextSkipNum = shopPromotionList[shopPromotionList.length-1].nextSkipNum
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
  // console.log('Home.allShopCategories*********>>>>>>>>>>>', noUpdateVersion)

  return {
    // announcement: announcement,
    banner: banner,
    // topics: pickedTopics,
    ds: ds.cloneWithRows(dataArray),
    city: geoCity,
    geoPoint: geoPoint,
    nextSkipNum: nextSkipNum,
    shopPromotionList: shopPromotionList,
    allShopCategories: allShopCategories,
    noUpdateVersion:noUpdateVersion,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchBanner,
  getAllTopicCategories,
  getCurrentLocation,
  fetchShopPromotionList,
  clearShopPromotionList,
  fetchShopCategories,
  fetchAppNoUpdate
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Home)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainerStyle: {
    paddingBottom: 49
  },
  body: {
    marginTop: normalizeH(64),
    flex: 1,
    marginBottom: 42
  },
  healthModule: {
    height: normalizeH(64),
    marginTop: normalizeH(10)
  },
  announcementModule: {
    height: normalizeH(40),
    backgroundColor: 'white',
    //   marginTop: normalizeH(15),
  },
  advertisementModule: {
    height: normalizeH(159),
    backgroundColor: '#fff', //必须加上,否则android机器无法显示banner
  },
  columnsModule: {
    height: normalizeH(84),
    marginTop: normalizeH(15),
    marginBottom: normalizeH(5),
  },
  channelsModule: {
    marginTop: normalizeH(15),
    marginBottom: normalizeH(5),
  },

  dailyChosenModule: {
    marginTop: normalizeH(15),
  },
  moduleSpace: {
    paddingBottom: normalizeH(8),
  }

})