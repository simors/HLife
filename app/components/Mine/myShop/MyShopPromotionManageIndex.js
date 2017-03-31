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

import {fetchShopPromotionMaxNum, fetchUserOwnedShopInfo, fetchShopFollowers, fetchShopFollowersTotalCount, fetchSimilarShopList, fetchShopDetail, fetchGuessYouLikeShopList, fetchShopAnnouncements, userIsFollowedShop, followShop, submitShopComment, fetchShopCommentList, fetchShopCommentTotalCount, userUpShop, userUnUpShop, fetchUserUpShopInfo} from '../../../action/shopAction'
import {followUser, unFollowUser, userIsFollowedTheUser, fetchUserFollowees} from '../../../action/authActions'
import {selectShopPromotionMaxNum, selectUserOwnedShopInfo, selectShopFollowers, selectShopFollowersTotalCount, selectSimilarShopList, selectShopDetail,selectShopList, selectGuessYouLikeShopList, selectLatestShopAnnouncemment, selectUserIsFollowShop, selectShopComments, selectShopCommentsTotalCount, selectUserIsUpedShop} from '../../../selector/shopSelector'
import * as authSelector from '../../../selector/authSelector'
import ImageGallery from '../../common/ImageGallery'
import {PERSONAL_CONVERSATION} from '../../../constants/messageActionTypes'
import * as numberUtils from '../../../util/numberUtils'
import Icon from 'react-native-vector-icons/Ionicons'
import CommonListView from '../../common/CommonListView'
import MyShopPromotionModule from './MyShopPromotionModule'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class MyShopPromotionManageIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{
      this.props.fetchUserOwnedShopInfo()
      this.props.fetchShopPromotionMaxNum()
    })
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(()=>{

    })
  }

  componentWillReceiveProps(nextProps) {

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
              <TouchableOpacity onPress={()=>{}}>
                <View style={styles.bntStyle}>
                  <Text style={{fontSize:17}}>关闭</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=>{}}>
                <View style={styles.bntStyle}>
                  <Text style={{fontSize:17}}>编辑</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=>{}}>
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

  renderExpiredPromotionView() {
    return null
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
  dataArray.push({type: 'IS_PROMOTING'})
  dataArray.push({type: 'EXPIRED_PROMOTION'})

  const userOwnedShopInfo = selectUserOwnedShopInfo(state)
  // console.log('userOwnedShopInfo====', userOwnedShopInfo)
  const isUserLogined = authSelector.isUserLogined(state)
  const shopPromotionMaxNum = selectShopPromotionMaxNum(state)
  // console.log('shopPromotionMaxNum===>>>', shopPromotionMaxNum)

  return {
    userOwnedShopInfo: userOwnedShopInfo,
    isUserLogined: isUserLogined,
    currentUser: authSelector.activeUserId(state),
    shopPromotionMaxNum: shopPromotionMaxNum,
    ds: ds.cloneWithRows(dataArray),
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchUserOwnedShopInfo,
  fetchShopPromotionMaxNum
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
  }

})