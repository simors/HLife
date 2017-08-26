/**
 * Created by lilu on 2017/8/9.
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
import {selectGoodsList,selectShopDetail,selectOpenGoodPromotion,selectCloseGoodPromotion,selectShopPromotionMaxNum} from '../../../selector/shopSelector'
import {activeUserId} from '../../../selector/authSelector'
import * as configSelector from '../../../selector/configSelector'
import {CachedImage} from "react-native-img-cache"
import {setShopGoodsOffline, setShopGoodsOnline, setShopGoodsDelete, modifyShopGoods, getShopGoodsList,getShopOpenPromotion,getShopClosePromotion,fetchShopPromotionMaxNum,closeShopPromotion} from '../../../action/shopAction'
import * as Toast from '../../common/Toast'
import Icon from 'react-native-vector-icons/Ionicons'
import {DEFAULT_SHARE_DOMAIN} from '../../../util/global'
import ShopGoodPromotionShow from './ShopGoodPromotionView'
import * as numberUtils from '../../../util/numberUtils'
import GoodShow from '../../shop/GoodShow'

const PAGE_WIDTH = Dimensions.get('window').width

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 != r2,
})

class ShopGoodPromotionManage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tabType: props.tabType ? tabType : 0,
    }
    this.tabs = ['进行中', '预上线' , '已结束']
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{
    this.refreshProPromotionList()
    this.props.fetchShopPromotionMaxNum()
    })
  }

  onChangeTab(payload) {
    console.log('hahahahahahahahahahha',payload.i)
    this.setState({
      tabType: payload.i
    }, ()=>{
      this.refresh()
    })
  }


  refresh() {
    if(0 == this.state.tabType) {
      this.refreshProPromotionList()
    } else if(1 == this.state.tabType) {
      this.refreshPrePromotionList()
    } else if(2 == this.state.tabType) {
      this.refreshClosePromotionList()
    }
  }

  renderScrollTabsContent() {
    return this.tabs.map((item, index)=>{
      if(index==0){
        return (
          <View key={index} tabLabel={item}
                style={[{flex:1}]}>
            {this.renderProPromotionList()}
          </View>
        )
      }else if(index==1){
        return (
          <View key={index} tabLabel={item}
                style={[{flex:1}]}>
            {this.renderPrePromotionList()}
          </View>
        )
      }else if(index==2){
        return (
          <View key={index} tabLabel={item}
                style={[{flex:1}]}>
            {this.renderCloPromotionList()}
          </View>
        )
      }

    })
  }

  renderCloPromotionList() {
    return(
      <CommonListView
        contentContainerStyle={{backgroundColor:'#F5F5F5'}}

        dataSource={this.props.cloPromotionList}
        renderRow={(rowData, rowId) => this.renderPromotionItem(rowData, rowId,'clo')}
        loadNewData={()=> {
          this.refreshClosePromotionList()
        }}
        loadMoreData={()=> {
          this.loadMoreGoodsListData(false, 3)
        }}
        ref={(listView) => this.cloPromotionListView = listView}
      />
    )
  }

  renderPrePromotionList() {
    return(
      <CommonListView
        contentContainerStyle={{backgroundColor:'#F5F5F5'}}

        dataSource={this.props.prePromotionList}
        renderRow={(rowData, rowId) => this.renderPromotionItem(rowData, rowId,'pre')}
        loadNewData={()=> {
          this.refreshPrePromotionList()
        }}
        loadMoreData={()=> {
          this.loadMoreGoodsListData(false, 2)
        }}
        ref={(listView) => this.prePromotionListView = listView}
      />
    )
  }

  renderProPromotionList() {
    return(
      <CommonListView
        contentContainerStyle={{backgroundColor:'#F5F5F5'}}
        dataSource={this.props.proPromotionList}
        renderRow={(rowData, rowId) => this.renderPromotionItem(rowData, rowId,'pro')}
        loadNewData={()=> {
          this.refreshProPromotionList()
        }}
        loadMoreData={()=> {
          this.loadMoreGoodsListData(false, 1)
        }}
        ref={(listView) => this.proPromotionListView = listView}
      />
    )
  }

  renderPromotionItem(value, key,status) {
    return(
      <View style={{flex:1,marginBottom:normalizeH(8)}}>
        <ShopGoodPromotionShow promotion={value} key = {key} status={status} closePromotion={(promotionId)=>{this.closePromotion(promotionId)}}
        />
      </View>
    )
  }

  closePromotion(promotionId){
    let payload = {
      promotionId: promotionId,
      success:()=>{
        Toast.show('关闭成功')


          this.refresh()

      },
      error:(err)=>{
        Toast.show(err.message)
      }
    }
    this.props.closeShopPromotion(payload)
  }

   refreshProPromotionList() {
    this.loadMoreGoodsListData(true, 1)
  }

  refreshPrePromotionList() {
    this.loadMoreGoodsListData(true, 2)
  }


  loadMoreGoodsListData(isRefresh, status) {
    if(this.isQuering) {
      return
    }
    this.isQuering = true

    let lastCreatedAt = undefined
    if (isRefresh) {
      lastCreatedAt = undefined
    } else {
      if(status === 1 && this.props.lastOpenPromotion) {
        lastCreatedAt = this.props.lastOpenPromotion.createdAt
      } else if(status === 2 && this.props.lastOpenPromotion) {
        lastCreatedAt = this.props.lastOpenPromotion.createdAt
      }else if(status === 3 && this.props.lastClosePromotion) {
        lastCreatedAt = this.props.lastClosePromotion.createdAt
      }
    }
    let payload = {
      isRefresh: !!isRefresh,
      shopId: this.props.shopId,
      status: status,
      limit: 6,
      lastCreatedAt: lastCreatedAt,
      nowDate: new Date(),
      success: (isEmpty) => {
        this.isQuering = false
        if(status === 1 ) {
          if(!this.proPromotionListView) {
            return
          }
          if(isEmpty) {
            this.proPromotionListView.isLoadUp(false)
          } else {
            this.proPromotionListView.isLoadUp(true)
          }
        } else if (status === 2) {
          if(!this.prePromotionListView) {
            return
          }
          if(isEmpty) {
            this.prePromotionListView.isLoadUp(false)
          } else {
            this.prePromotionListView.isLoadUp(true)
          }
        }else if (status === 3) {
          if(!this.cloPromotionListView) {
            return
          }
          if(isEmpty) {
            this.cloPromotionListView.isLoadUp(false)
          } else {
            this.cloPromotionListView.isLoadUp(true)
          }
        }
      },
      error: (err) => {
        this.isQuering = false
        Toast.show(err.message, {duration: 1000})
      }
    }
    if(status===1||status===2){
      this.props.getShopOpenPromotion(payload)
    }else{
      this.props.getShopClosePromotion(payload)

    }
  }

  refreshClosePromotionList() {
    this.loadMoreGoodsListData(true, 3)
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

  publishPromotion(){
    if(this.props.openPromotion.length>=this.props.maxPromotionNum){

      Toast.show('已经有三个启用的活动，仍想发布请手动关闭一个！')
    }else{
      Actions.PUBLISH_SHOP_PROMOTION_CHOOSE_GOOD({isPop:true})
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="活动管理"
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
                this.publishPromotion()
              }}
            >
              <View style={{
                padding:15,
                flexDirection:'row',
                justifyContent:'center',
                alignItems:'center',
                borderTopWidth:normalizeBorder(),
                borderTopColor: THEME.colors.lighterA,
              }}>
                <Image style={{marginRight:10}} source={require('../../../assets/images/publish_activity_4_mgr.png')}/>
                <Text style={{color:'#FF7819',fontSize:17}}>发布活动</Text>
              </View>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {

  let maxPromotionNum = selectShopPromotionMaxNum(state)
  let openPromotion = selectOpenGoodPromotion(state)
  let proPromotion = []
  let prePromotion = []
  openPromotion.forEach((item)=>{
    if(item.startDate>numberUtils.formatLeancloudTime(new Date(),'YYYY-MM-DD HH:mm')){
      prePromotion.push(item)
    }else{
      proPromotion.push(item)
    }
  })
  let cloPromotion = selectCloseGoodPromotion(state)
   let shopDetail = selectShopDetail(state,ownProps.shopId)
  let currentUser = activeUserId(state)
  let shareDomain = configSelector.getShareDomain(state)
  let lastClosePromotion = cloPromotion[cloPromotion.length - 1]
  let lastOpenPromotion = openPromotion[openPromotion.length - 1]
  console.log('prepromotion========>',prePromotion)
  return {
     currentUser: currentUser,
    maxPromotionNum: maxPromotionNum,
    openPromotion: openPromotion,
    shopDetail: shopDetail,
    shareDomain: shareDomain,
    prePromotionList: ds.cloneWithRows(prePromotion),
    proPromotionList: ds.cloneWithRows(proPromotion),
    cloPromotionList: ds.cloneWithRows(cloPromotion),
    lastClosePromotion: lastClosePromotion,
    lastOpenPromotion: lastOpenPromotion
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setShopGoodsOffline,
  setShopGoodsOnline,
  setShopGoodsDelete,
  modifyShopGoods,
  getShopGoodsList,
  getShopOpenPromotion,
  getShopClosePromotion,
  fetchShopPromotionMaxNum,
  closeShopPromotion
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ShopGoodPromotionManage)

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
