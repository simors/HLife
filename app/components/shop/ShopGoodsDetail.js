/**
 * Created by lilu on 2017/6/6.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  InteractionManager,
  ScrollView,
  StatusBar,
  Keyboard,
  BackAndroid,
  ListView,
  Modal,
  TextInput,
} from 'react-native'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import ViewPager2 from '../common/ViewPager2'
import {PERSONAL_CONVERSATION} from '../../constants/messageActionTypes'
import ChatroomShopCustomTopView from './ChatroomShopCustomTopView'
import {followUser, unFollowUser, userIsFollowedTheUser, fetchUserFollowees, fetchUsers} from '../../action/authActions'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import dismissKeyboard from 'react-native-dismiss-keyboard'
import KeyboardAwareToolBar from '../common/KeyboardAwareToolBar'
import ToolBarContent from '../shop/ShopCommentReply/ToolBarContent'
import {fetchOtherUserFollowersTotalCount} from '../../action/authActions'
import {publishTopicFormData, TOPIC_FORM_SUBMIT_TYPE} from '../../action/topicActions'
import {isUserLogined, activeUserInfo} from '../../selector/authSelector'
import * as authSelector from '../../selector/authSelector'
import Icon from 'react-native-vector-icons/Ionicons'
import {getTopicLikedTotalCount, getTopicComments, isTopicLiked, getTopicLikeUsers} from '../../selector/topicSelector'
import {
  fetchTopicLikesCount,
  fetchTopicIsLiked,
  likeTopic,
  unLikeTopic,
  fetchTopicLikeUsers,
} from '../../action/topicActions'
import ActionSheet from 'react-native-actionsheet'
import CommonListView from '../common/CommonListView'
import {fetchShareDomain} from '../../action/configAction'
import {getShareDomain, getTopicCategoriesById} from '../../selector/configSelector'
import {REWARD} from '../../constants/appConfig'
import * as Toast from '../common/Toast'
import {fetchTopicCommentsByTopicId} from '../../action/topicActions'
import {DEFAULT_SHARE_DOMAIN} from '../../util/global'
import {CachedImage} from "react-native-img-cache"
import ArticleViewer from '../common/Input/ArticleViewer'

class ShopGoodsDetail extends Component{
  constructor(props){
    super(props)
  }

  renderHeaderView() {
    // let topic = this.props.topic

      return (
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="商品详情"
          rightComponent={()=> {
            return (
              <TouchableOpacity onPress={this.onShare} style={{marginRight: 10}}>
                <CachedImage mutable source={require('../../assets/images/active_share.png')}/>
              </TouchableOpacity>
            )
          }}
        />
      )

  }

  renderBottomView() {


      return (
        <View style={styles.footerWrap}>
          <View style={styles.priceBox}>
            <Text style={styles.priceTxt}>￥{this.props.value.price}</Text>
          </View>
          <TouchableOpacity style={{flex: 1}} onPress={() => this.sendPrivateMessage()}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image style={{width:24,height:24}} resizeMode='contain' source={require('../../assets/images/service_24.png')}/>
              <Text style={{fontSize: em(10), color: '#aaa', paddingTop: normalizeH(5)}}>联系卖家</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerBtnBox} onPress={()=>{this.openPaymentModal()}}>
            <Image source={require('../../assets/images/purchase_24.png')}/>
            <Text style={styles.footerBtnTxt}>立即购买</Text>
          </TouchableOpacity>
        </View>
      )


  }

  sendPrivateMessage() {
    if (!this.props.isUserLogined) {
      Actions.LOGIN()
    } else {

      this.props.fetchUsers({userIds: [this.props.shopDetail.owner.id]})

      let payload = {
        name: this.props.shopDetail.owner.nickname,
        members: [this.props.currentUser, this.props.shopDetail.owner.id],
        conversationType: PERSONAL_CONVERSATION,
        title: this.props.shopDetail.shopName,
        customTopView: this.customTopView()
      }
      Actions.CHATROOM(payload)
    }
  }

  customTopView() {
    return (
      <ChatroomShopCustomTopView
        shopInfo={this.props.shopDetail}
      />
    )
  }

  renderBannerColumn() {

    if (this.props.imageList && this.props.imageList.length) {
      return (
        <View style={styles.advertisementModule}>
          <ViewPager2 dataSource={this.props.imageList}/>
        </View>
      )
    }
  }

  render(){
    // console.log('value',this.props.value)
    return(
      <View style={styles.containerStyle}>
        {this.renderHeaderView()}
        <View style={styles.body}>
          {this.renderBannerColumn()}
        {this.props.value.detail?<ArticleViewer artlcleContent={JSON.parse(this.props.value.detail)} />:null}
        {this.renderBottomView()}
        </View>
      </View>
    )
  }

}

const mapStateToProps = (state, ownProps) => {
  let imageList = []
  if(ownProps.value.album&&ownProps.value.album.length>0)
   imageList = ownProps.value.album.map((item,key)=>{
    return(
    {
      action: "LOGIN",
      actionType: "action",
      image: item,
      title: ownProps.value.title,
      type: 0
    }
    )
  })

  return {
  imageList:imageList
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchUsers,

}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ShopGoodsDetail)



const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },

  body: {
    marginTop: normalizeH(64),
    flex: 1,
    backgroundColor: '#E5E5E5',
    paddingBottom: 50
  },
  topicLikesWrap: {
    flex:1,
    flexDirection:'row',
    marginTop:8,
    padding: 15,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor:'white',
    justifyContent: 'space-between',
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: THEME.colors.lighterA,
  },
  titleLine: {
    width: 3,
    backgroundColor: '#ff7819',
    marginRight: 5,
  },
  titleTxt: {
    color: '#FF7819',
    fontSize: em(15)
  },
  likeStyle: {
    flex:1
  },
  zanStyle: {
    backgroundColor: THEME.colors.green,
    borderColor: 'transparent',
    height: normalizeH(35),
    alignSelf: 'center',
    borderRadius: 100,
    marginLeft: normalizeW(12),
    width: normalizeW(35),
  },
  zanAvatarStyle: {
    borderColor: 'transparent',
    height: normalizeH(35),
    alignSelf: 'center',
    borderRadius: 17.5,
    marginLeft: normalizeW(10),
    width: normalizeW(35),
  },
  zanTextStyle: {
    fontSize: em(17),
    color: "#ffffff",
    marginTop: normalizeH(7),
    alignSelf: 'center',
  },
  shopCommentWrap: {
    borderTopWidth: normalizeBorder(),
    borderTopColor: THEME.colors.lighterA,
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    height:50
  },
  vItem: {
    flex: 1,
    alignSelf:'flex-start',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingBottom: 3,
    paddingLeft: normalizeW(15)
  },
  vItemTxt: {
    marginTop: normalizeH(17),
    fontSize: em(17),
    color: '#FF7819'
  },
  bottomZanTxt: {
    color:'#ff7819'
  },
  shopCommentInputBox: {
    width: 64,
  },
  shopCommentInput: {
    fontSize: em(17),
    color: '#8f8e94'
  },
  contactedWrap: {
    width: normalizeW(110),
    backgroundColor: '#FF9D4E',
    justifyContent: 'center',
    alignItems: 'center'
  },
  contactedBox: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  contactedTxt: {
    color: 'white',
    fontSize: em(15),
    marginLeft: normalizeW(9)
  },
  commentBtnWrap: {
    width: 60,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center'
  },
  commentBtnBadge: {
    alignItems: 'center',
    width: 30,
    backgroundColor: '#f5a623',
    position: 'absolute',
    right: 0,
    top: 0,
    borderRadius: 10,
    borderWidth: normalizeBorder(),
    borderColor: '#f5a623'
  },
  commentBtnBadgeTxt: {
    fontSize: em(9),
    color: '#fff'
  },
  shopUpWrap: {
    width: 60,
    alignItems: 'center'
  },
  moreBtnStyle: {
    width: normalizeW(40),
    height: normalizeH(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalizeW(15)
  },
  priceBox: {
    flex: 1,
  },
  priceTxt: {
    color: '#FF7819',
    fontSize: em(24),
    fontWeight: 'bold'
  },
  footerBtnBox: {
    height:normalizeH(49),
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#FF9D4E',
    paddingTop: normalizeH(8),
    paddingLeft: normalizeW(25),
    paddingRight: normalizeW(25),
  },
  footerBtnTxt: {
    fontSize: em(10),
    color: 'white',
    marginTop: normalizeH(2)
  },
  footerWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    height:normalizeH(49),
    alignItems: 'center',
    paddingLeft: 15,
    backgroundColor: '#fafafa'
  },
  advertisementModule: {
    height: normalizeH(223),
    backgroundColor: '#fff', //必须加上,否则android机器无法显示banner
  },
})