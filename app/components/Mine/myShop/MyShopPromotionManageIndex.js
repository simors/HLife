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
  TextInput
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import * as Communications from 'react-native-communications'
import SendIntentAndroid from 'react-native-send-intent'
import Header from '../../common/Header'
import ImageGroupViewer from '../../common/Input/ImageGroupViewer'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'
import * as Toast from '../../common/Toast'
import ScoreShow from '../../common/ScoreShow'
import ShopPromotionModule from '../../shop/ShopPromotionModule'

import {updateShopPromotion, fetchMyShopExpiredPromotionList, fetchShopPromotionMaxNum, fetchUserOwnedShopInfo, fetchShopFollowers, fetchShopFollowersTotalCount, fetchSimilarShopList, fetchShopDetail, fetchGuessYouLikeShopList, fetchShopAnnouncements, userIsFollowedShop, followShop, submitShopComment, fetchShopCommentList, fetchShopCommentTotalCount, userUpShop, userUnUpShop, fetchUserUpShopInfo} from '../../../action/shopAction'
import {followUser, unFollowUser, userIsFollowedTheUser, fetchUserFollowees} from '../../../action/authActions'
import {selectMyShopExpiredPromotionList, selectShopPromotionMaxNum, selectUserOwnedShopInfo, selectShopFollowers, selectShopFollowersTotalCount, selectSimilarShopList, selectShopDetail,selectShopList, selectGuessYouLikeShopList, selectLatestShopAnnouncemment, selectUserIsFollowShop, selectShopComments, selectShopCommentsTotalCount, selectUserIsUpedShop} from '../../../selector/shopSelector'
import * as authSelector from '../../../selector/authSelector'
import ImageGallery from '../../common/ImageGallery'
import {PERSONAL_CONVERSATION} from '../../../constants/messageActionTypes'
import * as numberUtils from '../../../util/numberUtils'
import Icon from 'react-native-vector-icons/Ionicons'
import CommonListView from '../../common/CommonListView'
import MyShopPromotionModule from './MyShopPromotionModule'
import ActionSheet from 'react-native-actionsheet'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class MyShopPromotionManageIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }

    this.selectedShopPromotion = null
    this.selectedShopPromotionIndex = -1

  }

  init(){
    this.props.fetchUserOwnedShopInfo()
    this.props.fetchShopPromotionMaxNum()
    this.refreshData()
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{
      this.init()
    })
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(()=>{

    })
  }

  componentWillReceiveProps(nextProps) {
    // console.log('componentWillReceiveProps.nextProps====', nextProps)
  }

  renderRow(rowData, rowId) {
    switch (rowData.type) {
      case 'IS_PROMOTING':
        return this.renderIsPromotingView()
      case 'EXPIRED_PROMOTION':
        return this.renderExpiredPromotionView()
      default:
        return <View />
    }
  }

  renderIsPromotingView() {
    let promotingView = <View />
    if(this.props.userOwnedShopInfo.containedPromotions) {
      promotingView = this.props.userOwnedShopInfo.containedPromotions.map((item, index)=>{
        return (
          <View key={'promotion_' + index} style={{marginBottom:8}}>
            <MyShopPromotionModule
              shopPromotion={item}
            />
            <View style={{backgroundColor:'white',flexDirection:'row',padding:15,justifyContent:'flex-end',alignItems:'center'}}>
              <TouchableOpacity onPress={()=>{this.closeShopPromotion(item)}}>
                <View style={styles.bntStyle}>
                  <Text style={{fontSize:17}}>关闭</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=>{Actions.EDIT_SHOP_PROMOTION({shopPromotion:item})}}>
                <View style={styles.bntStyle}>
                  <Text style={{fontSize:17}}>编辑</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=>{this.onMoreClick(item, index)}}>
                <View style={styles.bntStyle}>
                  <Text style={{fontSize:17}}>···</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )
      })
    }
    return (
      <View style={{flex:1}}>
        {promotingView}
      </View>
    )
  }

  filterShopPromotions(shopPromotion) {

    let containedPromotions = this.props.userOwnedShopInfo && this.props.userOwnedShopInfo.containedPromotions
    if(containedPromotions && containedPromotions.length) {

      let filterFunc = (item)=>{
        if(item.id == shopPromotion.id) {
          return false
        }
        return true
      }

      let filteredPromotions = containedPromotions.filter(filterFunc)
      // console.log('filteredPromotions=====', filteredPromotions)
      return filteredPromotions
    }
    return []
  }

  addShopPromotions(shopPromotion) {
    let containedPromotions = this.props.userOwnedShopInfo && this.props.userOwnedShopInfo.containedPromotions
    if(containedPromotions && containedPromotions.length) {
      return [].concat(shopPromotion, containedPromotions)
    }
    return shopPromotion
  }

  closeShopPromotion(shopPromotion) {
    let filteredPromotions = this.filterShopPromotions(shopPromotion)
    this.props.updateShopPromotion({
      updateType: "1",
      shopPromotionId: shopPromotion.id,
      status: '0',
      shopId: this.props.userOwnedShopInfo.id,
      containedPromotions: filteredPromotions,
      success: ()=>{
        this.props.fetchUserOwnedShopInfo()
        this.refreshData()
        Toast.show('关闭活动成功')
      },
      error: ()=>{
        Toast.show('关闭活动失败')
      }
    })
  }

  isExceededShopPromotionMaxNum(){
    let shopPromotionMaxNum = this.props.shopPromotionMaxNum
    let containedPromotionsNum = 0
    if(this.props.userOwnedShopInfo.containedPromotions) {
      containedPromotionsNum = this.props.userOwnedShopInfo.containedPromotions.length
    }
    return containedPromotionsNum >= shopPromotionMaxNum
  }

  openShopPromotion(shopPromotion) {
    if(this.isExceededShopPromotionMaxNum()) {
      Toast.show('您的店铺活动已达最大数量')
      return
    }
    let addedShopPromotions = this.addShopPromotions(shopPromotion)
    this.props.updateShopPromotion({
      updateType: "1",
      shopPromotionId: shopPromotion.id,
      status: '1',
      shopId: this.props.userOwnedShopInfo.id,
      containedPromotions: addedShopPromotions,
      success: ()=>{
        this.props.fetchUserOwnedShopInfo()
        this.refreshData()
        Toast.show('启用活动成功')
      },
      error: ()=>{
        Toast.show('启用活动失败')
      }
    })
  }

  deleteShopPromotion(shopPromotion) {
    let filteredPromotions = this.filterShopPromotions(shopPromotion)
    this.props.updateShopPromotion({
      updateType: "2",
      shopPromotionId: shopPromotion.id,
      shopId: this.props.userOwnedShopInfo.id,
      containedPromotions: filteredPromotions,
      success: ()=>{
        this.props.fetchUserOwnedShopInfo()
        this.refreshData()
        Toast.show('删除活动成功')
      },
      error: ()=>{
        Toast.show('删除活动失败')
      }
    })
  }

  onMoreClick(item, index){
    this.selectedShopPromotion = item
    this.selectedShopPromotionIndex = index
    this.ActionSheet.show()
  }

  renderExpiredPromotionView() {

    let expiredPromotionView = <View style={styles.noExpiredDataContainer}>
                                <Text style={{color:'#AAAAAA', fontSize:17}}>暂无过期活动</Text>
                              </View>

    if(this.props.myShopExpriredPromotionList && this.props.myShopExpriredPromotionList.length){
      expiredPromotionView = this.props.myShopExpriredPromotionList.map((item, index)=>{
        return (
          <View key={'expired_promotion_' + index} style={{marginBottom:8}}>
            <MyShopPromotionModule
              shopPromotion={item}
            />
            <View style={{backgroundColor:'white',flexDirection:'row',padding:15,justifyContent:'flex-end',alignItems:'center'}}>
              <TouchableOpacity onPress={()=>{this.openShopPromotion(item)}}>
                <View style={styles.bntStyle}>
                  <Text style={{fontSize:17}}>启用</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=>{Actions.EDIT_SHOP_PROMOTION({shopPromotion:item})}}>
                <View style={styles.bntStyle}>
                  <Text style={{fontSize:17}}>编辑</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=>{this.deleteShopPromotion(item)}}>
                <View style={styles.bntStyle}>
                  <Text style={{fontSize:17}}>删除</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )
      })
    }


    return (
      <View>
        <View style={styles.expiredTitleBox}>
          <Text style={{color:'#5a5a5a', fontSize:17}}>已过期活动</Text>
        </View>
        {expiredPromotionView}
      </View>
    )
  }

  refreshData() {
    this.loadMoreData(true)
  }

  loadMoreData(isRefresh) {
    // console.log('this.state===', this.state)
    if(this.isQuering) {
      return
    }
    this.isQuering = true

    let payload = {
      isRefresh: !!isRefresh,
      lastUpdatedAt: this.props.lastUpdatedAt,
      success: (isEmpty) => {
        this.isQuering = false
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
        this.isQuering = false
        Toast.show(err.message, {duration: 1000})
      }
    }
    this.props.fetchMyShopExpiredPromotionList(payload)
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


            <View style={{
              position:'absolute',
              left:0,
              right:0,
              bottom:0,
              backgroundColor:'#fafafa',
            }}>
              <TouchableOpacity
                onPress={()=>{
                  Actions.PUBLISH_SHOP_PROMOTION()
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

          <ActionSheet
            ref={(o) => this.ActionSheet = o}
            title="活动管理"
            options={['分享', '删除','取消']}
            cancelButtonIndex={2}
            onPress={this._handleActionSheetPress.bind(this)}
          />
        </View>
      </View>
    )
  }

  _handleActionSheetPress(index) {
    // console.log('this.selectedShopPromotionIndex====', this.selectedShopPromotionIndex)
    // console.log('this.selectedShopPromotion====', this.selectedShopPromotion)
    if(0 == index) { //分享

    }else if(1 == index) { //删除
      this.deleteShopPromotion(this.selectedShopPromotion)
    }
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
  dataArray.push({type: 'IS_PROMOTING'})
  dataArray.push({type: 'EXPIRED_PROMOTION'})

  const userOwnedShopInfo = selectUserOwnedShopInfo(state)
  // console.log('userOwnedShopInfo====', userOwnedShopInfo)
  const isUserLogined = authSelector.isUserLogined(state)
  const shopPromotionMaxNum = selectShopPromotionMaxNum(state)
  // console.log('shopPromotionMaxNum===>>>', shopPromotionMaxNum)
  const myShopExpriredPromotionList = selectMyShopExpiredPromotionList(state)

  let lastUpdatedAt = ''
  if(myShopExpriredPromotionList && myShopExpriredPromotionList.length) {
    lastUpdatedAt = myShopExpriredPromotionList[myShopExpriredPromotionList.length-1].updatedAt
  }

  // console.log('mapStateToProps/ownProps===', ownProps)

  return {
    userOwnedShopInfo: userOwnedShopInfo,
    isUserLogined: isUserLogined,
    currentUser: authSelector.activeUserId(state),
    shopPromotionMaxNum: shopPromotionMaxNum,
    ds: ds.cloneWithRows(dataArray),
    myShopExpriredPromotionList: myShopExpriredPromotionList,
    lastUpdatedAt: lastUpdatedAt,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchUserOwnedShopInfo,
  fetchShopPromotionMaxNum,
  fetchMyShopExpiredPromotionList,
  updateShopPromotion
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MyShopPromotionManageIndex)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)'
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
  bntStyle: {
    borderWidth:normalizeBorder(),
    borderColor:'#5a5a5a',
    padding:10,
    paddingLeft:20,
    paddingRight:20,
    marginRight:10
  },
  expiredTitleBox: {
    padding:15,
    backgroundColor:'white',
    borderBottomWidth:normalizeBorder(),
    borderBottomColor:'#f5f5f5',
  },
  noExpiredDataContainer: {
    backgroundColor:'white',
    justifyContent:'center',
    alignItems:'center',
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
  }

})