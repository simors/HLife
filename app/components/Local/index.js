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
  ViewPagerAndroid
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
import ScoreShow from '../common/ScoreShow'
import Swiper from 'react-native-swiper'
import * as authSelector from '../../selector/authSelector'
import MessageBell from '../common/MessageBell'
import {selectShopList, selectFetchShopListIsArrivedLastPage} from '../../selector/shopSelector'
import {fetchShopList} from '../../action/shopAction'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class Local extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchForm: {
        shopCategoryId: '',
        sortId: 2,
        distance: '',
        geo: undefined,
        geoCity: '',
        lastCreatedAt: '',
        lastScore: '',
        lastGeo: '',
        shopTagId: '',
        skipNum: 0
      },
    }
  }

  componentWillMount() {
    let that = this
    Utils.getCurrentPositionInfo().then((result)=>{
      that.setState({
        searchForm: {
          ...this.state.searchForm,
          geo: result.geo,
          geoCity: result.geoCity,
        }
      })
    })
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchShopCategories()
      this.refreshData()
    })
  }

  componentWillReceiveProps(nextProps) {
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
      <View style={{}}>
        {shopListView}
      </View>
    )
  }

  gotoShopDetailScene(id) {
    Actions.SHOP_DETAIL({id: id})
  }

  renderShop(shopInfo, index) {
    // console.log('shopInfo====', shopInfo)

    return (
      <TouchableOpacity key={'shop_' + index} onPress={()=>{this.gotoShopDetailScene(shopInfo.id)}}>
        <View style={[styles.shopInfoWrap]}>
          <View style={styles.coverWrap}>
            <Image style={styles.cover} source={{uri: shopInfo.coverUrl}}/>
          </View>
          <View style={styles.shopIntroWrap}>
            <View style={styles.shopInnerIntroWrap}>
              <Text style={styles.shopName} numberOfLines={1}>{shopInfo.shopName}</Text>
              <ScoreShow
                containerStyle={{flex:1}}
                score={shopInfo.score}
              />
              <View style={styles.subInfoWrap}>
                <View style={{flex:1,flexDirection:'row'}}>
                  <Text style={styles.subTxt}>{shopInfo.geoDistrict && shopInfo.geoDistrict}</Text>
                </View>
                {shopInfo.distance &&
                <Text style={[styles.subTxt]}>{shopInfo.distance}km</Text>
                }
              </View>
            </View>
            {this.renderShopPromotion(shopInfo)}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  renderShopPromotion(shopInfo) {
    let containedPromotions = shopInfo.containedPromotions
    if(containedPromotions && containedPromotions.length) {
      let shopPromotionView = containedPromotions.map((promotion, index)=>{
        return (
          <View key={'promotion_' + index} style={styles.shopPromotionBox}>
            <View style={styles.shopPromotionBadge}>
              <Text style={styles.shopPromotionBadgeTxt}>{promotion.badge}</Text>
            </View>
            <View style={styles.shopPromotionContent}>
              <Text numberOfLines={1} style={styles.shopPromotionContentTxt}>{promotion.content}</Text>
            </View>
          </View>
        )
      })
      return (
        <View style={styles.shopPromotionWrap}>
          {shopPromotionView}
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
      <TouchableOpacity key={shopCategory.id} style={{flex:1}} onPress={()=>{this.gotoShopCategoryList(shopCategory)}}>
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

        if(row.length == 4 || this.props.allShopCategories.length == (index+1)) {
          rowView = that.renderShopCategoryRow(row)
          shopCategoriesView.push(rowView)
          row = []
        }

        if(shopCategoriesView.length == 2 || this.props.allShopCategories.length == (index+1)) {
          pageView = that.renderShopCategoryPage(shopCategoriesView)
          pages.push(pageView)
          shopCategoriesView = []
        }
      })
      // console.log('pages====', pages)
      return (
        <View style={{flex:1}}>
          <Swiper
            style={styles.swiperStyle}
            autoplay={false}
            activeDotColor="#FF7819"
            height={normalizeH(200)}
            width={PAGE_WIDTH}
            paginationStyle={{bottom:10}}
          >
            {pages}
          </Swiper>
        </View>
      )
    }
    return null
  }

  refreshData() {
    // console.log('this.state===', this.state)
    this.loadMoreData(true)
  }

  loadMoreData(isRefresh) {
    let payload = {
      ...this.state.searchForm,
      isRefresh: !!isRefresh,
      success: (isEmpty) => {
        if(!this.listView) {
          return
        }
        // console.log('loadMoreData.isEmpty=====', isEmpty)
        if(isEmpty) {
          this.listView.isLoadUp(false)
        }else {
          this.listView.isLoadUp(true)
        }
      },
      error: (err)=>{
        Toast.show(err.message, {duration: 1000})
      }
    }
    this.props.fetchShopList(payload)
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="none"
          title="邻家优店"
          rightType="image"
          rightComponent={() => {return <MessageBell />}}
        />
        <View style={styles.body}>
          <View>
            <CommonListView
              contentContainerStyle={{backgroundColor: '#fff'}}
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
  dataArray.push({type: 'SHOP_CATEGORY_COLUMN'})
  dataArray.push({type: 'LOCAL_SHOP_LIST_COLUMN'})

  const allShopCategories = selectShopCategories(state)
  const isUserLogined = authSelector.isUserLogined(state)
  const shopList = selectShopList(state) || []
  let nextSkipNum = 0
  if(shopList && shopList.length) {
    nextSkipNum = shopList[shopList.length-1].nextSkipNum
  }

  return {
    allShopCategories: allShopCategories,
    ds: ds.cloneWithRows(dataArray),
    isUserLogined: isUserLogined,
    nextSkipNum: nextSkipNum,
    shopList: shopList,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchShopCategories,
  fetchShopList
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Local)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    ...Platform.select({
      ios: {
        marginTop: normalizeH(65),
      },
      android: {
        marginTop: normalizeH(45)
      }
    }),
    flex: 1,
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
    marginTop: 10,
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
    lineHeight: 20,
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
    alignItems: 'center'
  },
  shopCategoryRow: {
    flexDirection: 'row',
  },
  shopCategoryBox: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  shopCategoryImage: {
    height: 50,
    width: 50,
    marginBottom: 6
  },
  shopCategoryText: {

  }

})