/**
 * Created by wanpeng on 2017/6/8.
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
  TextInput,
  Animated,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Header from '../../common/Header'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'
import CommonListView from '../../common/CommonListView'
import ScrollableTabView, {ScrollableTabBar} from '../../common/ScrollableTableView'
import {selectGoodsList,selectShopDetail} from '../../../selector/shopSelector'
import {activeUserId} from '../../../selector/authSelector'
import * as configSelector from '../../../selector/configSelector'
import {CachedImage} from "react-native-img-cache"
import {setShopGoodsOffline, setShopGoodsOnline, setShopGoodsDelete, modifyShopGoods, getShopGoodsList} from '../../../action/shopAction'
import * as Toast from '../../common/Toast'
import Icon from 'react-native-vector-icons/Ionicons'
import {DEFAULT_SHARE_DOMAIN} from '../../../util/global'


const PAGE_WIDTH = Dimensions.get('window').width

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 != r2,
})

class ShopGoodsManage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tabType: props.tabType ? 1 : 0,
    }
    this.tabs = ['正在热卖', '已下架']
  }

  isExceededShopGoodsMaxNum(){
  }

  onChangeTab(payload) {
    this.setState({
      tabType: payload.i
    }, ()=>{
      this.refresh()
    })
  }

  refresh() {
    if(0 == this.state.tabType) {
      this.refreshOnlineGoodsList()
    } else if(1 == this.state.tabType) {
      this.refreshOfflineGoodsList()
    }
  }

  renderScrollTabsContent() {
    return this.tabs.map((item, index)=>{
      return (
        <View key={index} tabLabel={item}
              style={[{flex:1}]}>
          {index == 0 ? this.renderOnlineGoodsList() : this.renderOfflineGoodsList()}
        </View>
      )
    })
  }

  renderOnlineGoodsList() {
    return(
      <CommonListView
        dataSource={this.props.onlineGoodsList}
        renderRow={(rowData, rowId) => this.renderOnlineGoodItem(rowData, rowId)}
        loadNewData={()=> {
          this.refreshOnlineGoodsList()
        }}
        loadMoreData={()=> {
          this.loadMoreGoodsListData(false, 1)
        }}
        ref={(listView) => this.onlineGoodListView = listView}
      />
    )
  }

  renderOnlineGoodItem(value, key) {
    return(
      <View key={key} style={{borderBottomWidth: 1, borderColor: '#F5F5F5',}}>
        <TouchableOpacity style={{flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F5F5F5'}} onPress={() => {Actions.SHOP_GOODS_DETAIL({goodInfo: value})}}>
          <View style={{marginTop: normalizeH(21), marginLeft: normalizeW(15), marginRight: normalizeW(15)}}>
            <CachedImage mutable style={{width: normalizeH(75), height: normalizeH(75)}}
                         source={value.coverPhoto? {uri: value.coverPhoto} : require('../../../assets/images/default_goods_cover.png')}>
            </CachedImage>
          </View>
          <View>
            <Text style={{marginTop: normalizeH(22), fontSize: 17, color: '#5A5A5A'}}>{value.goodsName}</Text>
            <View style={{flexDirection: 'row', flex: 1, marginTop: normalizeH(13), marginBottom: normalizeH(13), alignItems: 'center'}}>
              <Text style={{fontSize: 17, color: '#00BE96'}}>¥ {value.price}</Text>
              <Text style={{fontSize: 10, color: '#AAAAAA', marginLeft: 6}}>原价：{value.originalPrice}</Text>
            </View>
            <Text style={{marginBottom: normalizeH(16), fontSize: 12, color: '#D8D8D8'}}>上架时间：{value.updatedAt.slice(0, 10)} </Text>
          </View>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', height: normalizeH(58), justifyContent: 'flex-end', alignItems: 'center'}}>
          <TouchableOpacity style={styles.button} onPress={() => {this.onSetGoodOffline(value.id)}}>
            <Text style={{fontSize: 17, color: 'black'}}>下架</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, {marginRight: normalizeW(15)}]} onPress={() => {this.onReEditorGood(value.id)}}>
            <Text style={{fontSize: 17, color: 'black'}}>编辑</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, {marginRight: normalizeW(15),width: normalizeW(36)}]} onPress={() => {this.onShare(value)}}>
            <Icon name="ios-more" style={{fontSize:em(26),height:normalizeH(26)}}/>
          </TouchableOpacity>
        </View>
      </View>
    )
  }


  onShare = (goodInfo) => {
    let shareUrl = this.props.shareDomain ? this.props.shareDomain + "goodShare/" + goodInfo.id + '?userId=' + this.props.currentUser:
    DEFAULT_SHARE_DOMAIN + "goodShare/" + goodInfo.id + '?userId=' + this.props.currentUser

    Actions.SHARE({
      title: goodInfo.goodsName || "汇邻优店",
      url: shareUrl,
      author: this.props.shopDetail.shopName || "邻家小二",
      abstract: this.props.shopDetail.shopAddress || "未知地址",
      cover: goodInfo.coverPhoto || '',
    })
  }

  onSetGoodOffline(GoodId) {
    this.props.setShopGoodsOffline({
      goodsId: GoodId,
      shopId: this.props.shopId
    })
  }

  onSetGoodOnline(GoodId) {
    this.props.setShopGoodsOnline({
      goodsId: GoodId,
      shopId: this.props.shopId
    })
  }

  onReEditorGood(GoodId) {
    Actions.EDIT_SHOP_GOOD({
      goodsId: GoodId,
      shopId: this.props.shopId
    })
  }

  onDeleteGood(GoodId) {
    this.props.setShopGoodsDelete({
      goodsId: GoodId,
      shopId: this.props.shopId
    })
  }

  refreshOnlineGoodsList() {
    this.loadMoreGoodsListData(true, 1)
  }

  loadMoreGoodsListData(isRefresh, status) {
    if(this.isQuering) {
      return
    }
    this.isQuering = true

    let lastUpdateTime = undefined
    if (isRefresh) {
      lastUpdateTime = undefined
    } else {
      if(status === 1 && this.props.lastOnlineGood) {
        lastUpdateTime = this.props.lastOnlineGood.updatedAt
      } else if(status === 2 && this.props.lastOfflineGood) {
        lastUpdateTime = this.props.lastOfflineGood.updatedAt
      }
    }

    let payload = {
      more: !isRefresh,
      shopId: this.props.shopId,
      status: status,
      limit: 6,
      lastUpdateTime: lastUpdateTime,
      success: (isEmpty) => {
        this.isQuering = false

        if(status === 1 ) {
          if(!this.onlineGoodListView) {
            return
          }
          if(isEmpty) {
            this.onlineGoodListView.isLoadUp(false)
          } else {
            this.onlineGoodListView.isLoadUp(true)
          }
        } else if (status === 2) {
          if(!this.offlineGoodListView) {
            return
          }
          if(isEmpty) {
            this.offlineGoodListView.isLoadUp(false)
          } else {
            this.offlineGoodListView.isLoadUp(true)
          }
        }
      },
      error: (err) => {
        this.isQuering = false
        Toast.show(err.message, {duration: 1000})
      }
    }

    this.props.getShopGoodsList(payload)
  }

  renderOfflineGoodsList() {
    return(
      <CommonListView
        dataSource={this.props.offlineGoodsList}
        renderRow={(rowData, rowId) => this.renderOfflineGoodItem(rowData, rowId)}
        loadNewData={()=> {
          this.refreshOfflineGoodsList()
        }}
        loadMoreData={()=> {
          this.loadMoreGoodsListData(false, 2)
        }}
        ref={(listView) => this.offlineGoodListView = listView}
      />
    )
  }

  renderOfflineGoodItem(value, key) {
    return(
      <View key={key} style={{borderBottomWidth: 1, borderColor: '#F5F5F5',}}>
        <TouchableOpacity style={{flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F5F5F5'}} onPress={() => {Actions.SHOP_GOODS_DETAIL({goodInfo: value})}}>
          <View style={{marginTop: normalizeH(21), marginLeft: normalizeW(15), marginRight: normalizeW(15)}}>
            <CachedImage mutable style={{width: normalizeH(75), height: normalizeH(75)}}
                         source={value.coverPhoto? {uri: value.coverPhoto} : require('../../../assets/images/default_goods_cover.png')}>
            </CachedImage>
          </View>
          <View>
            <Text style={{marginTop: normalizeH(22), fontSize: 17, color: '#5A5A5A'}}>{value.goodsName}</Text>
            <View style={{flexDirection: 'row', flex: 1, marginTop: normalizeH(13), marginBottom: normalizeH(13), alignItems: 'center'}}>
              <Text style={{fontSize: 17, color: '#00BE96'}}>¥ {value.price}</Text>
              <Text style={{fontSize: 10, color: '#AAAAAA', marginLeft: 6}}>原价：{value.originalPrice}</Text>
            </View>
            <Text style={{marginBottom: normalizeH(16), fontSize: 12, color: '#D8D8D8'}}>上架时间：{value.updatedAt.slice(0, 10)} </Text>
          </View>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', height: normalizeH(58), justifyContent: 'flex-end', alignItems: 'center'}}>
          <TouchableOpacity style={styles.button} onPress={() => {this.onSetGoodOnline(value.id)}}>
            <Text style={{fontSize: 17, color: 'black'}}>上架</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => {this.onReEditorGood(value.id)}}>
            <Text style={{fontSize: 17, color: 'black'}}>编辑</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, {marginRight: normalizeW(15)}]} onPress={() => {this.onDeleteGood(value.id)}}>
            <Text style={{fontSize: 17, color: 'black'}}>删除</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  refreshOfflineGoodsList() {
    this.loadMoreGoodsListData(true, 2)
  }

  renderTabBar() {
    return (
      <ScrollableTabBar
        activeTextColor={THEME.base.mainColor}
        inactiveTextColor={'#686868'}
        style={{height:44}}
        underlineStyle={{height: 2, backgroundColor:THEME.base.mainColor}}
        textStyle={{fontSize: em(16), paddingBottom: 11}}
        tabStyle={{paddingBottom: 0, paddingLeft: 12, paddingRight: 12}}
        backgroundColor={'white'}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="商品管理"
          rightType="none"
        />

        <View style={styles.body}>
          <ScrollableTabView
            style={[{flex:1, marginBottom: normalizeH(49)}]}
            page={this.state.tabType}
            initialPage={this.state.tabType}
            scrollWithoutAnimation={true}
            renderTabBar={()=> this.renderTabBar()}
            onChangeTab={(payload) => this.onChangeTab(payload)}>
            {this.renderScrollTabsContent()}
          </ScrollableTabView>
          <View style={{
            position:'absolute',
            left:0,
            right:0,
            bottom:0,
            backgroundColor:'#fafafa',
          }}>
            <TouchableOpacity
              onPress={()=>{
                if(this.isExceededShopGoodsMaxNum()) {
                  Toast.show('您的店铺商品数已达最大数量')
                  return
                }
                Actions.PUBLISH_SHOP_GOOD({shopId: this.props.shopId})
              }}
            >
              <View style={{
                height: normalizeH(49),
                flexDirection:'row',
                justifyContent:'center',
                alignItems:'center',
                borderTopWidth:normalizeBorder(),
                borderTopColor: THEME.colors.lighterA,
              }}>
                <Image style={{marginRight:10}} source={require('../../../assets/images/publish_goods.png')}/>
                <Text style={{color:'#FF7819',fontSize:17}}>新品上架</Text>
              </View>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {

  const onlineGoodsList = selectGoodsList(state, ownProps.shopId, 1)  //status: 1--上架 2--下架  3--删除
  const offlineGoodsList = selectGoodsList(state, ownProps.shopId, 2)
  let lastOnlineGood = onlineGoodsList[onlineGoodsList.length - 1]
  let lastOfflineGood = offlineGoodsList[offlineGoodsList.length - 1]
  let shopDetail = selectShopDetail(state,ownProps.shopId)
  let currentUser = activeUserId(state)
  let shareDomain = configSelector.getShareDomain(state)

  return {
    onlineGoodsList: ds.cloneWithRows(onlineGoodsList),
    offlineGoodsList: ds.cloneWithRows(offlineGoodsList),
    lastOnlineGood: lastOnlineGood,
    lastOfflineGood: lastOfflineGood,
    currentUser: currentUser,
    shopDetail: shopDetail,
    shareDomain: shareDomain
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setShopGoodsOffline,
  setShopGoodsOnline,
  setShopGoodsDelete,
  modifyShopGoods,
  getShopGoodsList
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ShopGoodsManage)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)'
  },
  foot: {
    position: 'absolute',
    bottom: 0,
    width: PAGE_WIDTH,
    height: normalizeH(49),
    borderColor: 'black',
    borderTopWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  body: {
    marginTop: normalizeH(64),
    flex: 1,
  },
  publish: {
    fontSize: 17,
    color: THEME.base.mainColor,
    marginLeft: 10,
  },
  button: {
    width: normalizeW(68),
    height: normalizeH(28),
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalizeW(10)
  }
})
