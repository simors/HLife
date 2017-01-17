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
  InteractionManager
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'

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
import {selectShopList, selectShopTags} from '../../selector/shopSelector'
import {fetchShopCategories} from '../../action/configAction'
import {fetchShopList, fetchShopTags} from '../../action/shopAction'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class ShopCategoryList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      searchForm: {
        shopCategoryId: '',
        sortId: '0',
        distance: '',
        geo: [39.9, 116.4],
        geoName: '长沙',
        lastScore: '',
        lastGeo: '',
        shopTagId: ''
      },
      shopCategoryName: '',
      selectGroupShow: [false, false, false],
      selectGroupHeight: 40,
      overlayHeight: 0,
    }
  }

  componentWillMount() {
    if(this.props.shopCategoryId) {
      this.setState({
        ...this.state,
        searchForm: {
          ...this.state.searchForm,
          shopCategoryId: this.props.shopCategoryId
        },
        shopCategoryName: this.props.shopCategoryName
      })
    }

    InteractionManager.runAfterInteractions(()=>{
      this.props.fetchShopCategories()
      this.props.fetchShopTags()
      this.refreshData()
    })
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.lastScore || nextProps.lastGeo || nextProps.total) {
      this.state.searchForm.lastScore = nextProps.lastScore
      this.state.searchForm.lastGeo = nextProps.lastGeo
      this.setState({
        ...this.state,
        searchForm: this.state.searchForm
      })
    }
  }

  _getOptionList(OptionListRef) {
    return this.refs[OptionListRef]
  }


  _onSelectShopCategory(shopCategoryId) {
    // console.log('_onSelectShopCategory.shopCategoryId=' , shopCategoryId)
    this.state.searchForm.shopCategoryId = shopCategoryId
    this.state.selectGroupShow = [false, false, false]
    this.setState({
      ...this.state,
      searchForm: {
        ...this.state.searchForm,
        shopCategoryId: this.state.searchForm.shopCategoryId,
        shopTagId: ''
      },
      selectGroupShow: this.state.selectGroupShow
    }, ()=>{
      this.refreshData()
    })
    // console.log('_onSelectShopCategory.this.state=' , this.state)
    this.toggleSelectGroupHeight()
  }

  _onSelectSort(sortId) {
    this.state.selectGroupShow = [false, false, false]
    this.state.searchForm.sortId = sortId
    this.setState({
      ...this.state,
      searchFrom: {
        ...this.state.searchForm,
        sortId: this.state.searchForm.sortId
      },
      selectGroupShow: this.state.selectGroupShow
    }, ()=>{
      this.refreshData()
    })
    this.toggleSelectGroupHeight()
  }

  _onSelectDistance(distance) {
    if('全城' == distance) {
      distance = ''
    }
    this.state.selectGroupShow = [false, false, false]
    this.state.searchForm.distance = distance
    this.setState({
      ...this.state,
      searchFrom: {
        ...this.state.searchForm,
        distance: this.state.searchForm.distance
      },
      selectGroupShow: this.state.selectGroupShow
    }, ()=>{
      this.refreshData()
    })
    this.toggleSelectGroupHeight()
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
          <Option ref={"option_"+index} key={"shopCategoryOption_" + index} value={item.shopCategoryId}>{item.text}</Option>
        )
      })
    }
    return optionsView
  }

  gotoShopDetailScene(id) {
    Actions.SHOP_DETAIL({id: id})
  }

  shopTagQuery(shopTagId) {
    this.setState({
      searchForm: {
        ...this.state.searchForm,
        shopTagId: shopTagId
      }
    }, ()=>{
      this.refreshData()
    })
  }

  renderTags(allShopTags) {
    if(allShopTags && allShopTags.length) {
      let randomShowIndex = -1
      if(allShopTags.length > 6) {
        randomShowIndex = Math.floor(Math.random() * (allShopTags.length - 6))
      }
      let allShopTagsView = allShopTags.map((item, index)=> {
        if(index < randomShowIndex || index >= (randomShowIndex + 6)) {
          return null
        }
        return (
          <TouchableOpacity key={"shop_tag_" + index} onPress={()=>{this.shopTagQuery(item.id)}}>
            <View style={styles.shopTagBox}>
              <Text style={styles.shopTag}>{item.name}</Text>
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

  renderShop(rowData) {
    return (
      <TouchableWithoutFeedback onPress={()=>{this.gotoShopDetailScene(rowData.id)}}>
        <View style={styles.shopInfoWrap}>
          <View style={styles.coverWrap}>
            <Image style={styles.cover} source={{uri: rowData.coverUrl}}/>
          </View>
          <View style={styles.shopIntroWrap}>
            <Text style={styles.shopName} numberOfLines={1}>{rowData.shopName}</Text>
            <ScoreShow
              containerStyle={{flex:1}}
              score={rowData.score}
            />
            <View style={styles.subInfoWrap}>
              <Text style={styles.subTxt}>{rowData.pv}人看过</Text>
              <Text style={styles.subTxt}>{rowData.geoName}</Text>
              <Text style={styles.subTxt}>{rowData.distance}km</Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderRow(rowData, sectionID, rowID, highlightRow) {
    let tagsView = null
    if(5 == rowID) {
      tagsView = this.renderTags(this.props.allShopTags)
    }

    return (
      <View>
        {tagsView
          ? <View>
              {tagsView}
              {this.renderShop(rowData)}
            </View>
          : this.renderShop(rowData)
        }
      </View>
    )
  }

  refreshData() {
    this.loadMoreData(true)
  }

  loadMoreData(isRefresh) {
    if(!isRefresh && this.props.isLastPage) {
      this.listView.isLoadUp(false)
      return
    }
    let payload = {
      ...this.state.searchForm,
      isRefresh: !!isRefresh,
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
    this.props.fetchShopList(payload)
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
          <View style={{paddingTop: 40}}>
            <CommonListView
              contentContainerStyle={{backgroundColor: 'rgba(0,0,0,0.05)'}}
              dataSource={this.props.ds}
              renderRow={(rowData, sectionID, rowID, highlightRow) => this.renderRow(rowData, sectionID, rowID, highlightRow)}
              loadNewData={()=>{this.refreshData()}}
              loadMoreData={()=>{this.loadMoreData()}}
              ref={(listView) => this.listView = listView}
            />
          </View>

          <View style={[styles.selectGroup, {height: this.state.selectGroupHeight}]}>
            <TouchableWithoutFeedback onPress={()=>{this._onOverlayPress()}}>
              <View style={[styles.selectOverlay, { height: this.state.overlayHeight }]}>
              </View>
            </TouchableWithoutFeedback>
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
                defaultValue={this.state.searchForm.shopCategoryId}
                onSelect={this._onSelectShopCategory.bind(this)}>

                <Option key={"shopCategoryOption_-1"} value="">全部分类</Option>
                {this.renderShopCategoryOptions()}
              </Select>
              <OptionList ref="SHOP_CATEGORY_OPTION_LIST"/>
            </View>
            <View style={styles.selectContainer}>
              <Select
                show={this.state.selectGroupShow[1]}
                onPress={()=>this._onSelectPress(1)}
                style={{borderWidth:normalizeBorder()}}
                selectRef="SELECT2"
                overlayPageX={PAGE_WIDTH/3}
                optionListHeight={200}
                hasOverlay={false}
                optionListRef={()=> this._getOptionList('DISTANCE_OPTION_LIST')}
                defaultText="全城"
                defaultValue=""
                onSelect={this._onSelectDistance.bind(this)}>
                <Option key={"distanceOption_0"} value="1">1km</Option>
                <Option key={"distanceOption_1"} value="2">2km</Option>
                <Option key={"distanceOption_2"} value="5">5km</Option>
                <Option key={"distanceOption_3"} value="10">10km</Option>
                <Option key={"distanceOption_4"} value="全城">全城</Option>
              </Select>
              <OptionList ref="DISTANCE_OPTION_LIST"/>
            </View>
            <View style={styles.selectContainer}>
              <Select
                show={this.state.selectGroupShow[2]}
                onPress={()=>this._onSelectPress(2)}
                style={{borderBottomWidth:normalizeBorder()}}
                selectRef="SELECT3"
                overlayPageX={PAGE_WIDTH * 2 / 3 }
                hasOverlay={false}
                optionListRef={()=> this._getOptionList('SORT_OPTION_LIST')}
                defaultText="智能排序"
                defaultValue="0"
                onSelect={this._onSelectSort.bind(this)}>
                <Option key={"sortOption_0"} value="0">智能排序</Option>
                <Option key={"sortOption_1"} value="1">好评优先</Option>
                <Option key={"sortOption_2"} value="2">距离优先</Option>
              </Select>
              <OptionList ref="SORT_OPTION_LIST"/>
            </View>
          </View>

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

  const allShopCategories = selectShopCategories(state)
  // console.log('allShopCategories=', allShopCategories)
  const shopList = selectShopList(state) || []
  // console.log('shopList=', shopList)
  let lastScore = ''
  let lastGeo = []
  let isLastPage = false
  if(shopList && shopList.length) {
    lastScore = shopList[shopList.length-1].score
    lastGeo = shopList[shopList.length-1].geo
    if(shopList.length < 5) {
      isLastPage = true
    }
  }

  const allShopTags = selectShopTags(state)

  return {
    ds: ds.cloneWithRows(shopList),
    shopList: shopList,
    allShopCategories: allShopCategories,
    lastScore: lastScore,
    lastGeo: lastGeo,
    allShopTags: allShopTags,
    isLastPage: isLastPage
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchShopCategories,
  fetchShopList,
  fetchShopTags
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ShopCategoryList)

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    padding: 10,
    marginBottom: normalizeH(10),
    backgroundColor: '#fff'
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
  shopTagsWrap: {
    padding: 10,
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
    marginBottom: 5,
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
  }
})