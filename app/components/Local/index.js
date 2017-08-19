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
import Immutable, {is} from 'immutable'
import shallowequal from 'shallowequal'
import {shallowEqualImmutable} from 'react-immutable-render-mixin'
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
  Modal,
  ViewPagerAndroid,
  StatusBar,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import {selectShopCategories} from '../../selector/configSelector'
import {fetchShopCategories} from '../../action/configAction'
import CommonListView from '../common/CommonListView'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import Header from '../common/Header'
import * as Toast from '../common/Toast'
import * as authSelector from '../../selector/authSelector'
import * as locSelector from '../../selector/locSelector'
import MessageBell from '../common/MessageBell'
import {selectLocalShopList} from '../../selector/shopSelector'
import {clearShopList, getNearbyShopList,fetchAllMyCommentUps} from '../../action/shopAction'
import SearchBar from '../common/SearchBar'
import ScoreShow from '../common/ScoreShow'
import ViewPager from 'react-native-viewpager'
import {CachedImage} from "react-native-img-cache"
import AV from 'leancloud-storage'
import {LazyloadView} from '../common/Lazyload'
import {getThumbUrl} from '../../util/ImageUtil'
import ShopShow from './ShopShow'

const PAGE_WIDTH = Dimensions.get('window').width

class Local extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    // console.log('componentWillMount.props===', this.props)
    InteractionManager.runAfterInteractions(() => {
      // console.log('componentWillMount.runAfterInteractions===', this.props)
      this.props.fetchShopCategories()
      if(this.props.isUserLogined){
        this.props.fetchAllMyCommentUps()
      }
      this.refreshData()
    })
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


  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  renderRow(rowData, sectionID, rowID, highlightRow) {
    // console.log('rowData',rowData)
    switch (rowData.type) {
      case 'SHOP_CATEGORY_COLUMN':
        return this.renderShopCategoryColumn()
      case 'LOCAL_SHOP_LIST_COLUMN':
        return this.renderLocalShopListColumn()
      default:
        return <View />
    }
  }

  renderLocalShopListColumn() {
    let shopListView = <View />
    // console.log('this.props.shopList====', this.props.shopList)
    if (this.props.shopList && this.props.shopList.length) {
      shopListView = this.props.shopList.map((shopInfo, index)=> {
        return this.renderShop(shopInfo, index)
      })
    }
    return (
      <View style={{flex: 1}} key='shop_list'>
        {shopListView}
      </View>
    )
  }

  gotoShopDetailScene(id) {
    Actions.SHOP_DETAIL({id: id})
  }

  renderShop(shopInfo, index) {
    // console.log('shopInfo====', shopInfo)

    let shopTag = null
    if (shopInfo.containedTag && shopInfo.containedTag.length) {
      shopTag = shopInfo.containedTag[0].name
    }

    return (
      // <LazyloadView key={'shop_' + index} host="localShop" placeholderStyle={{height: 200, width: PAGE_WIDTH}}>
      //   <TouchableOpacity onPress={()=> {
      //     this.gotoShopDetailScene(shopInfo.id)
      //   }}>
      //     <View style={[styles.shopInfoWrap]}>
      //       <View style={styles.coverWrap}>
      //         <CachedImage mutable style={styles.cover} source={{uri: getThumbUrl(shopInfo.coverUrl, normalizeW(80), normalizeW(80))}}/>
      //       </View>
      //       <View style={styles.shopIntroWrap}>
      //         <View style={styles.shopInnerIntroWrap}>
      //           <Text style={styles.shopName} numberOfLines={1}>{shopInfo.shopName}</Text>
      //           <View style={{flex: 1, justifyContent: 'space-around'}}>
      //             <ScoreShow
      //               score={shopInfo.score}
      //             />
      //             {this.renderShopPromotion(shopInfo)}
      //           </View>
      //           <View style={styles.subInfoWrap}>
      //             {shopTag &&
      //             <Text style={[styles.subTxt]}>{shopTag}</Text>
      //             }
      //             <View style={{flex: 1, flexDirection: 'row'}}>
      //               <Text style={styles.subTxt}>{shopInfo.geoDistrict && shopInfo.geoDistrict}</Text>
      //             </View>
      //             {shopInfo.distance &&
      //             <Text style={[styles.subTxt]}>{shopInfo.distance + shopInfo.distanceUnit}</Text>
      //             }
      //           </View>
      //         </View>
      //       </View>
      //     </View>
      //   </TouchableOpacity>
      // </LazyloadView>
      <ShopShow
        shopInfo = {shopInfo}
        index = {index}
        key = {shopInfo.id}
      />
    )
  }

  renderShopPromotion(shopInfo) {
    let containedPromotions = shopInfo.containedPromotions
    if (containedPromotions && (containedPromotions.length > 0)) {
      let promotion = containedPromotions[0]
      return (
        <View style={styles.shopPromotionBox}>
          <View style={styles.shopPromotionBadge}>
            <Text style={styles.shopPromotionBadgeTxt}>{promotion.type}</Text>
          </View>
          <View style={styles.shopPromotionContent}>
            <Text numberOfLines={1} style={styles.shopPromotionContentTxt}>{promotion.typeDesc}</Text>
          </View>
        </View>
      )
    }
    return null
  }


  gotoShopCategoryList(shopCategory) {
    Actions.SHOP_CATEGORY_LIST({
      shopCategoryId: shopCategory.shopCategoryId,
      shopCategoryName: shopCategory.shopCategoryName
    })
  }

  _renderPage = (data, pageID) => {
    return (
      <View key={pageID} style={{width: PAGE_WIDTH, height: normalizeH(218), flexWrap: 'wrap'}}>
        {
          data.map((value, key) => {
            return(
              <TouchableOpacity key={key} style={{width: PAGE_WIDTH/4, height: normalizeH(109), justifyContent: 'center', alignItems: 'center'}}
                                onPress={() => {this.gotoShopCategoryList({shopCategoryId: value.id, shopCategoryName: value.text})}}>
                <CachedImage mutable
                             style={{width: normalizeW(50), height: normalizeW(50), marginBottom: normalizeH(8)}}
                             source={{uri: getThumbUrl(value.imageSource, normalizeW(50), normalizeW(50))}}/>
                <Text numberOfLines={1} style={{}}>{value.text}</Text>
              </TouchableOpacity>
            )
          })
        }
      </View>
    )
  }

  renderShopCategoryColumn() {
    let dataSource = new ViewPager.DataSource({
      pageHasChanged: (p1, p2) => p1 !== p2,
    })

    const categoryPageData = Array.apply(null, {
      length: Math.ceil(this.props.allShopCategories.length / 8)
    }).map((x, i) => {
      return this.props.allShopCategories.slice(i * 8, (i + 1) * 8);
    })

    return(
      <ViewPager
        style={{}}
        dataSource={dataSource.cloneWithPages(categoryPageData)}
        renderPage={this._renderPage}
        isLoop={false}
        autoPlay={false}
      />
      )
  }


  refreshData(payload) {
    this.loadMoreData(true)
  }

  loadMoreData(isRefresh, isEndReached) {
    if (this.isQuering) {
      return
    }
    this.isQuering = true

    let lastDistance = undefined
    if (isRefresh) {
      lastDistance = undefined
    } else {
      if (this.props.geoPoint && this.props.lastShopGeo) {
        lastDistance = this.props.lastShopGeo.kilometersTo(new AV.GeoPoint(this.props.geoPoint)) + 0.001
      }
    }

    let payload = {
      isRefresh: !!isRefresh,
      geo: this.props.geoPoint ? [this.props.geoPoint.latitude, this.props.geoPoint.longitude] : [],
      lastDistance: lastDistance,
      isLocalQuering: true,
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
    this.props.getNearbyShopList(payload)
  }

  render() {
    return (
      <View style={styles.container}>
        {/*<StatusBar barStyle="dark-content"/>*/}
        <Header
          leftType="none"
          centerComponent={() => {
            return <SearchBar />
          }}
          rightType="image"
          rightComponent={() => {
            return <MessageBell />
          }}
        />
        <View style={styles.body}>
          <View style={{flex: 1}}>
            <CommonListView
              name="localShop"
              contentContainerStyle={{backgroundColor: '#fff'}}
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
  dataArray.push({type: 'SHOP_CATEGORY_COLUMN'})
  dataArray.push({type: 'LOCAL_SHOP_LIST_COLUMN'})

  const allShopCategories = selectShopCategories(state)
  const isUserLogined = authSelector.isUserLogined(state)
  const shopList = selectLocalShopList(state) || []

  let lastShopGeo = undefined
  if(shopList && shopList.length) {
    lastShopGeo = shopList[shopList.length-1].geo
  }
  // console.log('shopList==>',shopList)
  let geoPoint = locSelector.getGeopoint(state)

  return {
    allShopCategories: allShopCategories,
    ds: ds.cloneWithRows(dataArray),
    isUserLogined: isUserLogined,
    shopList: shopList,
    geoPoint: geoPoint,
    lastShopGeo: lastShopGeo,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchShopCategories,
  clearShopList,
  getNearbyShopList,
  fetchAllMyCommentUps
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Local)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    marginTop: normalizeH(64),
    flex: 1,
    marginBottom: 42
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
  shopPromotionWrap: {
    flex: 1,
    marginTop: 10,
    borderTopWidth: normalizeBorder(),
    borderTopColor: '#f5f5f5'
  },
  shopPromotionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: 10,
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
  coverWrap: {
    width: normalizeW(80),
    height: normalizeW(80)
  },
  cover: {
    flex: 1
  },
  shopIntroWrap: {
    flex: 1,
    paddingLeft: 10,
  },
  shopName: {
    fontSize: em(17),
    color: '#5a5a5a'
  },
  subInfoWrap: {
    flexDirection: 'row',
  },
  subTxt: {
    marginRight: normalizeW(10),
    color: '#d8d8d8',
    fontSize: em(12)
  },
  swiperStyle: {
    backgroundColor: '#fff',
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: '#f5f5f5'
  },
  shopCategoryPage: {
    flex: 1,
    padding: 10,
    paddingBottom: 26,
    justifyContent: 'space-between',
  },
  shopCategoryRow: {
    flex: 1,
    flexDirection: 'row',
  },
  shopCategoryTouchBox: {
    flex: 1,
  },
  shopCategoryBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopCategoryImage: {
    height: normalizeH(45),
    width: normalizeW(45),
    marginBottom: 6
  },
  shopCategoryText: {},
  indicators: {
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },

})