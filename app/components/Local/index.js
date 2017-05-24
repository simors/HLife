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
import * as Utils from '../../util/Utils'
import THEME from '../../constants/themes/theme1'
import Header from '../common/Header'
import * as Toast from '../common/Toast'
import Swiper from 'react-native-swiper'
import * as authSelector from '../../selector/authSelector'
import * as locSelector from '../../selector/locSelector'
import MessageBell from '../common/MessageBell'
import {selectShopList, selectLocalShopList} from '../../selector/shopSelector'
import {fetchShopList, clearShopList} from '../../action/shopAction'
import ViewPager from '../common/ViewPager'
import * as DeviceInfo from 'react-native-device-info'
import SearchBar from '../common/SearchBar'
import ScoreShow from '../common/ScoreShow'


const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class Local extends Component {
  constructor(props) {
    // console.log('constructor.props===', props)
    super(props)
    this.state = {
      searchForm: {
        shopCategoryId: '',
        sortId: 3,
        distance: 0,
        geo: props.geoPoint ? [props.geoPoint.latitude, props.geoPoint.longitude] : undefined,
        geoCity: props.getCity || '',
        lastCreatedAt: '',
        lastScore: '',
        lastGeo: '',
        shopTagId: '',
        skipNum: 0,
        loadingOtherCityData: false
      },
    }
  }

  componentWillMount() {
    // console.log('componentWillMount.props===', this.props)
    InteractionManager.runAfterInteractions(() => {
      // console.log('componentWillMount.runAfterInteractions===', this.props)
      this.props.fetchShopCategories()
      this.refreshData()
    })
  }
  shouldComponentUpdate(nextProps, nextState){
    // if (Immutable.fromJS(this.props) != Immutable.fromJS(nextProps)) {
    //   return true
    // }
    return true
  }
  componentDidMount() {
    // console.log('componentDidMount.props===', this.props)
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

  renderRow(rowData, sectionID, rowID, highlightRow) {
    console.log('rowData',rowData)
    switch (rowData.type) {
      case 'SHOP_CATEGORY_COLUMN':
        return this.renderShopCategoryColumn()
      case 'LOCAL_SHOP_LIST_COLUMN':
        return this.renderLocalShopListColumn()
      default:
        return <View />
    }
  }

  renderShopCategoryColumn() {
    return this.renderSectionHeader()
  }

  renderLocalShopListColumn() {
    let shopListView = <View />
    // console.log('this.props.shopList====', this.props.shopList)
    if(this.props.shopList && this.props.shopList.length) {
      shopListView = this.props.shopList.map((shopInfo, index)=>{
        return this.renderShop(shopInfo, index)
      })
    }
    return (
      <View style={{flex:1}}>
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
    if(shopInfo.containedTag && shopInfo.containedTag.length) {
      shopTag = shopInfo.containedTag[0].name
    }

    return (
      <TouchableOpacity key={'shop_' + index} onPress={()=>{this.gotoShopDetailScene(shopInfo.id)}}>
        <View style={[styles.shopInfoWrap]}>
          <View style={styles.coverWrap}>
            <Image style={styles.cover} source={{uri: shopInfo.coverUrl}}/>
          </View>
          <View style={styles.shopIntroWrap}>
            <View style={styles.shopInnerIntroWrap}>
              <Text style={styles.shopName} numberOfLines={1}>{shopInfo.shopName}</Text>
              <View style={{flex: 1, justifyContent: 'space-around'}}>
                <ScoreShow
                  score={shopInfo.score}
                />
                {this.renderShopPromotion(shopInfo)}
              </View>
              <View style={styles.subInfoWrap}>
                {shopTag &&
                 <Text style={[styles.subTxt]}>{shopTag}</Text>
                }
                <View style={{flex:1,flexDirection:'row'}}>
                  <Text style={styles.subTxt}>{shopInfo.geoDistrict && shopInfo.geoDistrict}</Text>
                </View>
                {shopInfo.distance &&
                  <Text style={[styles.subTxt]}>{shopInfo.distance + shopInfo.distanceUnit}</Text>
                }
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  renderShopPromotion(shopInfo) {
    let containedPromotions = shopInfo.containedPromotions
    if(containedPromotions && (containedPromotions.length > 0)) {
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
      shopCategoryName: shopCategory.text})
  }
  
  renderShopCategoryBox(shopCategory) {
    return (
      <TouchableOpacity key={shopCategory.id} style={styles.shopCategoryTouchBox} onPress={()=>{this.gotoShopCategoryList(shopCategory)}}>
        <View style={styles.shopCategoryBox}>
          <Image
            style={[styles.shopCategoryImage]}
            source={{uri: shopCategory.imageSource}}
          />
          <Text numberOfLines={1} style={[styles.shopCategoryText]}>{shopCategory.text}</Text>
        </View>
      </TouchableOpacity>
    )
  }
  
  renderShopCategoryRow(row) {
    return (
      <View key={'row'+ Math.random()} style={styles.shopCategoryRow}>
        {row}
      </View>
    )
  }
  
  renderShopCategoryPage(page) {
    return (
      <View key={'page'+ Math.random()} style={styles.shopCategoryPage}>
        {page}
      </View>
    )
  }

  renderSectionHeader() {
    let pages = []
    let that = this
    // console.log('this.props.allShopCategories===', this.props.allShopCategories)
    if(this.props.allShopCategories && this.props.allShopCategories.length) {
      let pageView = <View/>
      let shopCategoriesView = []
      let rowView = <View />
      let row  = []
      this.props.allShopCategories.forEach((shopCategory, index) => {
        // console.log('shopCategory===', shopCategory)

        let shopCategoryView = that.renderShopCategoryBox(shopCategory)
        row.push(shopCategoryView)

        let shopCategoryLength = this.props.allShopCategories.length
        if(shopCategoryLength == (index+1)) {
          // console.log('renderSectionHeader*****==row.length==', row.length)
          if(row.length < 4) {
            let lastRowLength = row.length
            for(let i = 0; i < (4 - lastRowLength); i++) {
              let placeholderRowView = <View key={'empty_'+ i} style={styles.shopCategoryTouchBox} />
              row.push(placeholderRowView)
            }
            // console.log('renderSectionHeader*****>>>>>>>>>>>>>==row.length==', row.length)
          }
        }

        if(row.length == 4) {
          rowView = that.renderShopCategoryRow(row)
          shopCategoriesView.push(rowView)
          row = []
        }

        if(shopCategoriesView.length == 2 || shopCategoryLength == (index+1)) {
          pageView = that.renderShopCategoryPage(shopCategoriesView)
          pages.push(pageView)
          shopCategoriesView = []
        }

      })

      // console.log('renderSectionHeader*****==pages==', pages)

      let dataSource = new ViewPager.DataSource({
        pageHasChanged: (p1, p2) => p1 !== p2,
      })

      return (
        <ViewPager
          style={{flex:1}}
          dataSource={dataSource.cloneWithPages(pages)}
          renderPage={this._renderPage}
          isLoop={false}
          autoPlay={false}
        />
      )
    }
    return null
  }

  _renderPage(data: Object, pageID) {
    return (
      <View
        style={{
          width:PAGE_WIDTH,
          height:normalizeH(200),
            borderBottomWidth:normalizeBorder(),
            borderBottomColor: '#f5f5f5'
        }}
      >
        {data}
      </View>
    )
  }

  refreshData(payload) {
    if(payload && payload.loadingOtherCityData) {
      this.loadMoreData(true)
    }else {
      this.setState({
        searchForm: {
          ...this.state.searchForm,
          loadingOtherCityData: false
        }
      }, () => {
        this.loadMoreData(true)
      })
    }
  }

  loadMoreData(isRefresh, isEndReached) {
    // console.log('this.state===', this.state)
    if(this.isQuering) {
      return
    }
    this.isQuering = true

    let limit = 5
    let payload = {
      ...this.state.searchForm,
      isRefresh: !!isRefresh,
      limit: limit,
      isLocalQuering: true,
      success: (isEmpty, fetchedSize) => {
        this.isQuering = false
        if(!this.listView) {
          return
        }
        // console.log('loadMoreData.isEmpty=====', isEmpty)
        if(isEmpty) {
          // if(isRefresh && this.state.searchForm.distance) {
          //   this.setState({
          //     searchForm: {
          //       ...this.state.searchForm,
          //       distance: ''
          //     }
          //   }, ()=>{
          //     this.refreshData()
          //   })
          // }

          if(!this.state.searchForm.loadingOtherCityData) {
            this.setState({
              searchForm: {
                ...this.state.searchForm,
                loadingOtherCityData: true,
                skipNum: isRefresh ? 0 : this.state.searchForm.skipNum
              }
            }, ()=>{
              // console.log('isEmpty===', isEmpty)
              if(isRefresh) {
                this.refreshData({loadingOtherCityData: true})
              }else {
                this.loadMoreData()
              }
            })
          }

          this.listView.isLoadUp(false)
        }else {
          this.listView.isLoadUp(true)
          if(isRefresh && fetchedSize < limit) {
            this.loadMoreData()
          }
        }
      },
      error: (err)=>{
        this.isQuering = false
        Toast.show(err.message, {duration: 1000})
      }
    }
    this.props.fetchShopList(payload)
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
          rightComponent={() => {return <MessageBell />}}
        />
        <View style={styles.body}>
          <View style={{flex:1}}>
            <CommonListView
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
  let nextSkipNum = 0
  let lastUpdatedAt = ''
  if(shopList && shopList.length) {
    nextSkipNum = shopList[shopList.length-1].nextSkipNum
    lastUpdatedAt = shopList[shopList.length-1].updatedAt
  }

  let geoPoint = locSelector.getGeopoint(state)
  let getCity = locSelector.getCity(state)

  return {
    allShopCategories: allShopCategories,
    ds: ds.cloneWithRows(dataArray),
    isUserLogined: isUserLogined,
    nextSkipNum: nextSkipNum,
    lastUpdatedAt: lastUpdatedAt,
    shopList: shopList,
    geoPoint: geoPoint,
    getCity: getCity
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchShopCategories,
  fetchShopList,
  clearShopList
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
    paddingBottom:15,
    backgroundColor: '#fff',
    borderBottomWidth:normalizeBorder(),
    borderBottomColor: '#f5f5f5'
  },
  shopInnerIntroWrap: {
    height: 80,
  },
  shopPromotionWrap: {
    flex: 1,
    marginTop: 10,
    borderTopWidth:normalizeBorder(),
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
    color:'white',
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
    borderBottomWidth:normalizeBorder(),
    borderBottomColor: '#f5f5f5'
  },
  shopCategoryPage: {
    flex:1,
    padding: 10,
    paddingBottom:26,
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
    height: 50,
    width: 50,
    marginBottom: 6
  },
  shopCategoryText: {

  },
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