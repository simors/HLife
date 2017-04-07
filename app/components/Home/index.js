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
  StatusBar
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import {getBanner, selectShopCategories, getTopicCategories} from '../../selector/configSelector'
import {fetchBanner, fetchShopCategories, getAllTopicCategories} from '../../action/configAction'
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

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class Home extends Component {

  constructor(props) {
    super(props)

    this.state = {
      searchForm: {
        distance: 5,
        geo: props.geoPoint ? [props.geoPoint.latitude, props.geoPoint.longitude] : undefined,
        geoCity: props.city || '',
        skipNum: 0
      },
    }
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
    // console.log('this.state===', this.state)
    if(this.isQuering) {
      return
    }
    this.isQuering = true

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
        <StatusBar hidden={false} barStyle="dark-content"/>
        <Header
          leftType="image"
          leftImageSource={require("../../assets/images/location.png")}
          leftImageLabel={this.props.city}
          leftPress={() => {
          }}
          title="邻家优店"
          rightComponent={() => {
            return <MessageBell />
          }}
        />

        <View style={styles.body}>
          <View>
            <CommonListView
              contentContainerStyle={{backgroundColor: '#F5F5F5'}}
              dataSource={this.props.ds}
              renderRow={(rowData, rowId) => this.renderRow(rowData, rowId)}
              loadNewData={()=> {
                this.refreshData()
              }}
              loadMoreData={()=> {
                this.loadMoreData(false, true)
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
  // console.log('Home.allShopCategories*********>>>>>>>>>>>', allShopCategories)
  
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
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchBanner,
  getAllTopicCategories,
  getCurrentLocation,
  fetchShopPromotionList,
  clearShopPromotionList,
  fetchShopCategories,
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
    ...Platform.select({
      ios: {
        marginTop: normalizeH(64),
      },
      android: {
        marginTop: normalizeH(44)
      }
    }),
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