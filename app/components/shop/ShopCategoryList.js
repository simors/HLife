/**
 * Created by zachary on 2016/12/13.
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
  ActivityIndicator
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import * as locSelector from '../../selector/locSelector'
import Header from '../common/Header'
import {
  Option,
  OptionList,
  Select
} from '../common/CommonSelect'
import CommonListView from '../common/CommonListView'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import * as Toast from '../common/Toast'
import ScoreShow from '../common/ScoreShow'
import {selectShopCategories} from '../../selector/configSelector'
import {selectShopList, selectShopTags, selectFetchShopListIsArrivedLastPage} from '../../selector/shopSelector'
import {fetchShopCategories} from '../../action/configAction'
import {fetchShopTags, getNearbyShopList} from '../../action/shopAction'
import TimerMixin from 'react-timer-mixin'
import AV from 'leancloud-storage'
import ShopShow from '../Local/ShopShow'
import {CachedImage} from "react-native-img-cache"
import {getThumbUrl} from '../../util/ImageUtil'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class ShopCategoryList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectGroupShow: [false, false, false],
      selectGroupHeight: 40,
      overlayHeight: 0,
      animating: false,
      distance: undefined,
      shopTagId: undefined,
      shopCategoryId: undefined,
      shopCategoryName: '',
      sortId: '0',
    }

    this.isRefreshRendering = true
    this.isLastPage = false
  }

  componentWillMount() {
    if(this.props.shopCategoryId) {
      this.setState({
        shopCategoryId: this.props.shopCategoryId,
        shopCategoryName: this.props.shopCategoryName
      })
    }

    InteractionManager.runAfterInteractions(()=>{
      this.props.fetchShopCategories()
      this.props.fetchShopTags()
      this.refreshData()
    })

  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  _getOptionList(OptionListRef) {
    return this.refs[OptionListRef]
  }


  _onSelectShopCategory(shopCategoryId) {
    this.scrollToTop(()=>{
      this.state.selectGroupShow = [false, false, false]
      this.setState({
        shopCategoryId: shopCategoryId,
        selectGroupShow: this.state.selectGroupShow
      }, ()=>{
        this.refreshData()
      })
      this.toggleSelectGroupHeight()
    })

  }

  _onSelectSort(sortId) {
    this.scrollToTop(() => {
      this.state.selectGroupShow = [false, false, false]
      this.setState({
        sortId: sortId,
        selectGroupShow: this.state.selectGroupShow
      }, ()=>{
        this.refreshData()
      })
      this.toggleSelectGroupHeight()
    })
  }

  scrollToTop(callback) {
    if(this.listView) {
      this.listView.refs.listView.scrollTo({y:0})
    }
    if(typeof callback == 'function') {
      callback()
    }
  }

  _onSelectDistance(distance) {
    this.scrollToTop(()=>{
      if('不限' == distance) {
        distance = undefined
      }
      this.state.selectGroupShow = [false, false, false]
      this.setState({
        distance: distance,
        selectGroupShow: this.state.selectGroupShow
      }, ()=>{
        this.refreshData()
      })
      this.toggleSelectGroupHeight()
    })

  }

  toggleSelectGroupHeight() {
    let hasShow = false
    this.state.selectGroupShow.forEach((item, index) => {
      if(item) {
        hasShow = true
        return
      }
    })
    if(hasShow) {
      this.state.selectGroupHeight = PAGE_HEIGHT
      this.setState({
        selectGroupHeight: this.state.selectGroupHeight,
        overlayHeight: PAGE_HEIGHT
      })
    }else{
      this.state.selectGroupHeight = 40
      this.setState({
        selectGroupHeight: this.state.selectGroupHeight,
        overlayHeight: 0
      })
    }
  }

  _onOverlayPress() {
    this.state.selectGroupShow = [false, false, false]
    this.setState({
      selectGroupShow: this.state.selectGroupShow
    })
    this.toggleSelectGroupHeight()
  }

  _onSelectPress(index){
    if(index == 0) {
      this.state.selectGroupShow = [!this.state.selectGroupShow[0], false, false]
    }else if(index == 1) {
      this.state.selectGroupShow = [false, !this.state.selectGroupShow[1], false]
    }else if(index == 2) {
      this.state.selectGroupShow = [false, false, !this.state.selectGroupShow[2]]
    }

    this.setState({ //Notes:触发子组件更新
      selectGroupShow: this.state.selectGroupShow
    })

    this.toggleSelectGroupHeight()
  }

  renderShopCategoryOptions() {
    let optionsView = <View />
    if(this.props.allShopCategories) {
      optionsView = this.props.allShopCategories.map((item, index) => {
        return (
          <Option ref={"option_"+index} key={"shopCategoryOption_" + index} value={item.id}>{item.text}</Option>
        )
      })
    }
    return optionsView
  }

  gotoShopDetailScene(id) {
    Actions.SHOP_DETAIL({id: id})
  }

  shopTagQuery(shopTagId, isSlted) {
    this.setState({
      shopTagId: isSlted ? undefined : shopTagId
    }, ()=>{
      this.refreshData()
    })
  }
  
  getRecommendShopTags() {
    let shopCategoryContainedTag = []
    if(this.props.allShopCategories && this.props.allShopCategories.length) {
      for(let i = 0; i < this.props.allShopCategories.length; i++) {
        let shopCategory = this.props.allShopCategories[i]
        if(shopCategory.id == this.state.shopCategoryId) {
          shopCategoryContainedTag = shopCategory.containedTag
          break
        }
      }
    }

    let recommendShopTags = []
    if(shopCategoryContainedTag && shopCategoryContainedTag.length) {
      let randomShowIndex = -1
      if(shopCategoryContainedTag.length > 6) {
        randomShowIndex = Math.floor(Math.random() * (shopCategoryContainedTag.length - 6))
      }

      shopCategoryContainedTag.map((item, index)=>{
        if(index > randomShowIndex && index <= (randomShowIndex + 6)) {
          recommendShopTags.push(item)
        }
      })
    }

    return recommendShopTags
  }

  renderTags() {
    let shopTags = this.getRecommendShopTags()
    if(shopTags && shopTags.length) {
      let allShopTagsView = shopTags.map((item, index)=> {
        let sltedTagBoxStyle = {}
        let sltedShopTagStyle = {}
        let isSlted = false
        if(this.state.shopTagId == item.id) {
          isSlted = true
          sltedTagBoxStyle = {
            backgroundColor: THEME.colors.green
          }
          sltedShopTagStyle = {
            color: '#fff'
          }
        }
        return (
          <TouchableOpacity key={"shop_tag_" + index} onPress={()=>{this.shopTagQuery(item.id, isSlted)}}>
            <View style={[styles.shopTagBox, sltedTagBoxStyle]}>
              <Text style={[styles.shopTag, sltedShopTagStyle]}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )
      })

      return (
        <View key="shopTags" style={styles.shopTagsWrap}>
          {allShopTagsView}
        </View>
      )
    }
  }

  renderShopTags(tags){
    if(tags&&tags.length>0){
      let showTags = tags.map((item,key)=>{
        if(key<5){
          return <View style={styles.shopTagBadge}>
            <Text style={styles.shopTagBadgeTxt}>{item.name}</Text>
          </View>
        }
      })
      return <View  style={styles.shopPromotionBox}>
        {showTags }
      </View>
    }else{
      return null
    }

  }

  renderShop(rowData, customStyle,index) {
    let shopTag = null
    if(rowData.containedTag && rowData.containedTag.length) {
      shopTag = rowData.containedTag
    }
    return (
      <TouchableOpacity onPress={()=> {
        this.gotoShopDetailScene(rowData.id)
      }}>
        <View style={[styles.shopInfoWrap]}>
          <View style={styles.coverWrap}>
            <CachedImage mutable style={styles.cover}
                         source={{uri: getThumbUrl(rowData.coverUrl, normalizeW(80), normalizeW(80))}}/>
          </View>
          <View style={styles.shopIntroWrap}>
            <View style={styles.shopInnerIntroWrap}>
              <Text style={styles.shopName} numberOfLines={1}>{rowData.shopName}</Text>
              <Text style={styles.shopSpecial} numberOfLines={1}>{rowData.ourSpecial}</Text>

              <View style={{flex: 1, justifyContent: 'space-around',marginTop:normalizeH(5)}}>
                {this.renderShopPromotion(rowData)}
              </View>
              <View style={styles.subInfoWrap}>
                {this.renderShopTags(shopTag)}
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }


  renderShopPromotion(shopInfo) {
    let containedPromotions = shopInfo.containedPromotions
    if (containedPromotions && (containedPromotions.length > 0)) {

      let promotion = containedPromotions[0]
      return (
        <View>
          <View style={styles.shopPromotionBox}>
            <View style={styles.shopPromotionBadge}>
              <Text style={styles.shopPromotionBadgeTxt}>{promotion.type}</Text>
            </View>
            {containedPromotions[1] ? <View style={styles.shopPromotionBadge}>
              <Text style={styles.shopPromotionBadgeTxt}>{containedPromotions[1].type}</Text>
            </View> : null}
            {containedPromotions[2] ? <View style={styles.shopPromotionBadge}>
              <Text style={styles.shopPromotionBadgeTxt}>{containedPromotions[2].type}</Text>
            </View> : null}
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: normalizeH(5)}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Text style={styles.subTxt}>{shopInfo.geoDistrict && shopInfo.geoDistrict}</Text>
            </View>
            {shopInfo.distance &&
            <Text style={[styles.subTxt]}>{shopInfo.distance + shopInfo.distanceUnit}</Text>
            }
          </View>
        </View>
      )
    } else{
      return(
        <View style={styles.shopPromotionBox}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Text style={styles.subTxt}>{shopInfo.geoDistrict && shopInfo.geoDistrict}</Text>
          </View>
          {shopInfo.distance &&
          <Text style={[styles.subTxt]}>{shopInfo.distance + shopInfo.distanceUnit}</Text>
          }
        </View>
      )
    }
    return null
  }


  renderRow(rowData, sectionID, rowID, highlightRow) {
    let tagsView = null
    let customStyle = null
    // console.log('renderRow')
    if(4 == rowID || !this.props.shopList.length || (this.props.shopList.length < 5 && this.props.shopList.length == (+rowID+1))) {
      tagsView = this.renderTags()
      customStyle = {marginBottom: 0}
    }
    return (
      <View>
        { this.renderShop(rowData,customStyle,rowID)}
      </View>
    )
  }

  refreshData(payload) {
    this.isLastPage = false

    this.loadMoreData(true)
  }

  loadMoreData(isRefresh) {
    if(!isRefresh) {
      if(this.isRefreshRendering) {
        return
      }
    }else {
      this.isRefreshRendering = true
    }
    if(this.isLastPage) {
      this.listView.isLoadUp(false)
      return
    }

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
      shopCategoryId: this.state.shopCategoryId,
      shopTagId: this.state.shopTagId,
      distance: this.state.distance,
      isLocalQuering: false,
      success: (isEmpty) => {
        if(!this.listView) {
          return
        }
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
    this.props.getNearbyShopList(payload)
  }

  renderSectionHeader(sectionData, sectionID) {
    return null
  }

  handleOnScroll(e) {
    if(e.nativeEvent.contentOffset.y > 0) {
      this.isRefreshRendering = false
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="全部店铺"
          rightType="none"
        />
        <View style={styles.body}>
          <View style={{flex:1,paddingTop: 40}}>
            {!this.props.shopList.length &&
              <View>
                {this.renderTags()}
              </View>
            }
            <CommonListView
              contentContainerStyle={{backgroundColor: 'white'}}
              dataSource={this.props.ds}
              renderRow={(rowData, sectionID, rowID, highlightRow) => this.renderRow(rowData, sectionID, rowID, highlightRow)}
              loadNewData={()=>{this.refreshData()}}
              loadMoreData={()=>{this.loadMoreData()}}
              ref={(listView) => this.listView = listView}
              renderSectionHeader={this.renderSectionHeader.bind(this)}
              onScroll={e => this.handleOnScroll(e)}
            />
          </View>

          <View style={[styles.selectGroup, {height: this.state.selectGroupHeight}]}>
            <View style={styles.selectContainer}>
              <Select
                show={this.state.selectGroupShow[0]}
                onPress={()=>this._onSelectPress(0)}
                style={{borderBottomWidth:normalizeBorder()}}
                selectRef="SELECT1"
                overlayPageX={0}
                optionListHeight={240}
                hasOverlay={false}
                optionListRef={()=> this._getOptionList('SHOP_CATEGORY_OPTION_LIST')}
                defaultText={this.state.shopCategoryName}
                defaultValue={this.state.shopCategoryId}
                onSelect={this._onSelectShopCategory.bind(this)}>

                <Option key={"shopCategoryOption_-1"} value="">全部分类</Option>
                {this.renderShopCategoryOptions()}
              </Select>

            </View>
            <View style={styles.selectContainer}>
              <Select
                show={this.state.selectGroupShow[1]}
                onPress={()=>this._onSelectPress(1)}
                style={{borderWidth:normalizeBorder()}}
                selectRef="SELECT2"
                overlayPageX={0}
                optionListHeight={200}
                hasOverlay={false}
                optionListRef={()=> this._getOptionList('DISTANCE_OPTION_LIST')}
                defaultText="不限"
                defaultValue=""
                onSelect={this._onSelectDistance.bind(this)}>
                <Option key={"distanceOption_0"} value="1">1km</Option>
                <Option key={"distanceOption_1"} value="2">2km</Option>
                <Option key={"distanceOption_2"} value="5">5km</Option>
                <Option key={"distanceOption_3"} value="10">10km</Option>
                <Option key={"distanceOption_4"} value="不限">不限</Option>
              </Select>

            </View>
            {/*<View style={styles.selectContainer}>*/}
              {/*<Select*/}
                {/*show={this.state.selectGroupShow[2]}*/}
                {/*onPress={()=>this._onSelectPress(2)}*/}
                {/*style={{borderBottomWidth:normalizeBorder()}}*/}
                {/*selectRef="SELECT3"*/}
                {/*overlayPageX={0}*/}
                {/*hasOverlay={false}*/}
                {/*optionListRef={()=> this._getOptionList('SORT_OPTION_LIST')}*/}
                {/*defaultText="距离优先"*/}
                {/*defaultValue="0"*/}
                {/*onSelect={this._onSelectSort.bind(this)}>*/}
                {/*<Option key={"sortOption_0"} value="0">距离优先</Option>*/}
              {/*</Select>*/}

            {/*</View>*/}
          </View>
          <TouchableWithoutFeedback onPress={()=>{this._onOverlayPress()}}>
            <View style={[styles.selectOverlay, { height: this.state.overlayHeight }]}>
            </View>
          </TouchableWithoutFeedback>
          <OptionList ref="SHOP_CATEGORY_OPTION_LIST"/>
          <OptionList ref="DISTANCE_OPTION_LIST"/>
          <OptionList ref="SORT_OPTION_LIST"/>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let ds = undefined
  if(ownProps.ds) {
    ds = ownProps.ds
  } else {
    ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2,
    })
  }
  let isLastPage = selectFetchShopListIsArrivedLastPage(state)
  const allShopCategories = selectShopCategories(state)
  const shopList = selectShopList(state) || []
  if(shopList && shopList.length) {
    if(shopList.length < 5) {
      isLastPage = true
    }
  }

  let lastShopGeo = undefined
  if(shopList && shopList.length) {
    lastShopGeo = shopList[shopList.length-1].geo
  }

  const allShopTags = selectShopTags(state)

  const geoPoint = locSelector.getGeopoint(state)

  return {
    ds: ds.cloneWithRows(shopList),
    shopList: shopList,
    allShopCategories: allShopCategories,
    allShopTags: allShopTags,
    isLastPage: isLastPage,
    geoPoint: geoPoint,
    lastShopGeo: lastShopGeo,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchShopCategories,
  fetchShopTags,
  getNearbyShopList,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ShopCategoryList)

Object.assign(ShopCategoryList.prototype, TimerMixin)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    marginTop: normalizeH(64),
    flex: 1,
  },
  selectGroup: {
    position: 'absolute',
    left: 0,
    width:PAGE_WIDTH,
    top: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
  },
  selectOverlay: {
    position: 'absolute',
    left: 0,
    width:PAGE_WIDTH,
    top: 40,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  selectContainer: {
    flex: 1,
    height: 40
  },
  shopInfoWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: normalizeW(15),
    paddingBottom: normalizeW(15),
    backgroundColor: '#fff',
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: '#f5f5f5'
  },
  shopInnerIntroWrap: {
    height: normalizeH(120),
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
  },
  shopPromotionBadge: {
    backgroundColor: '#F6A623',
    borderRadius: normalizeW(2),
    padding: normalizeW(3),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalizeW(6),
  },
  shopPromotionBadgeTxt: {
    color: 'white',
    fontSize: em(12),
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
    width: normalizeW(100),
    height: normalizeW(100)
  },
  cover: {
    flex: 1
  },
  shopIntroWrap: {
    flex: 1,
    paddingLeft: normalizeW(10),
  },
  shopName: {
    fontSize: em(17),
    color: '#5a5a5a'
  },
  subInfoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:normalizeH(5)
  },
  subTxt: {
    marginRight: normalizeW(10),
    color: '#d8d8d8',
    fontSize: em(12)
  },
  shopTagsWrap: {
    padding: 10,
    paddingBottom: 0,
    backgroundColor: 'rgba(0,0,0,0.05)',
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  },
  shopTagBox: {
    height: 40,
    width: normalizeW(108),
    marginLeft: normalizeW(5),
    marginRight: normalizeW(5),
    marginBottom: 10,
    padding: 5,
    paddingLeft: normalizeW(10),
    paddingRight: normalizeW(10),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  shopTag: {
    fontSize: em(17),
    color: '#8f8e94'
  },
  sectionHeader: {
    backgroundColor: '#fff',
    height: 110,
    borderTopWidth:normalizeBorder(),
    borderTopColor: '#b2b2b2'
  },
  shopTagBadge: {
    backgroundColor: '#F5F5F5',
    borderRadius: 2.5,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalizeW(6),
  },
  shopTagBadgeTxt: {
    color: '#AAAAAA',
    fontSize: em(11),
  },
  shopSpecial:{
    color: '#AAAAAA',
    fontSize: em(12),
    marginTop:normalizeH(5),
  }
})