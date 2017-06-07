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
          title="详情"
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
    {
      let isLiked = this.props.isLiked
      let likeImgSource = require("../../assets/images/like_unselect_main.png")
      if(isLiked) {
        likeImgSource = require("../../assets/images/like_selected.png")
      }

      return (
        <View style={[styles.shopCommentWrap, {position:'absolute',bottom:0,left:0,right:0}]}>
          <TouchableOpacity style={[styles.shopCommentInputBox]} onPress={()=>{this.onLikeButton()}}>
            <View style={[styles.vItem]}>
              <CachedImage mutable style={{width:24,height:24}} resizeMode='contain' source={likeImgSource}/>
              <Text style={[styles.vItemTxt, styles.bottomZanTxt]}>{isLiked ? '已赞' : '点赞'}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.shopCommentInputBox]} onPress={() => this.openModel()}>
            <View style={[styles.vItem]}>
              <CachedImage mutable style={{width:24,height:24}} resizeMode='contain' source={require('../../assets/images/message.png')}/>
              <Text style={[styles.vItemTxt, styles.bottomZanTxt]}>评论</Text>
            </View>
          </TouchableOpacity>
          <View style={{flex:1}}/>
          <TouchableOpacity style={styles.contactedWrap} onPress={() => this.openPaymentModal()}>
            <View style={[styles.contactedBox]}>
              <CachedImage mutable style={{}} source={require('../../assets/images/reward.png')}/>
              <Text style={[styles.contactedTxt]}>打赏</Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    }

  }
  render(){
    return(
      <View style={styles.containerStyle}>
        {this.renderHeaderView()}
        {this.renderBottomView()}
      </View>
    )
  }

}


const mapStateToProps = (state, ownProps) => {

  return {

  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({

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
    paddingLeft: 30
  },
  vItemTxt: {
    marginTop: 2,
    fontSize: em(10),
    color: '#aaa'
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
    flexDirection: 'row',
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
})