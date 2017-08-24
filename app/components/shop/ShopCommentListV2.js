/**
 * Created by lilu on 2017/8/19.
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
import shallowequal from 'shallowequal'
import CommentForComment from './ShopCommentForComment'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
// import {fetchAllComments, fetchUpItem} from '../../action/newTopicAction'
import {Actions} from 'react-native-router-flux'
import * as Toast from '../common/Toast'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height
import {isUserLogined, activeUserInfo} from '../../selector/authSelector'
import CommentForShop from './ShopCommentForShop'
import {userUpShopComment} from '../../action/shopAction'

export class ShopCommentListV2 extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!shallowequal(this.props.commentsArray, nextProps.commentsArray)) {

      return true;
    }
    if (!shallowequal(this.state, nextState)) {
      return true;
    }
    return false;
  }

  renderTopicCommentPage() {
    let commentsView = <View/>
    let allShopComments = this.props.allShopComments
    if ( allShopComments && allShopComments.length) {

      commentsView = allShopComments.map((value, key)=> {
        return (
          this.renderTopicCommentItem(value, key)
        )
      })
    } else {
      commentsView =
        <View style={{padding: 15, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{}}>
            目前没有评论，快来抢沙发吧！~~~
          </Text>
        </View>
    }

    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          {commentsView}
        </View>
      </View>
    )
  }

  onLikeCommentButton(payload) {
    if (this.props.isLogin) {
      this.props.userUpShopComment({
        shopCommentId: payload.comment.id,
        shopId: payload.comment.shopId,
        success: ()=>{
          Toast.show('点赞成功')
          payload.success()
        },
        userId: payload.comment.authorId,
        error: (error)=>{this.likeErrorCallback(error)}
      })

    }
    else {
      Actions.LOGIN()
    }
  }

  likeErrorCallback(error) {
    this.isSubmiting = false
    console.log('measssss====>',error.message)
    Toast.show(error.message)
  }
  onCommentButton(topic) {
    this.props.onCommentButton(topic)
  }

  renderTopicCommentItem(value, key) {

    if(this.props.viewType=='shop'){
      return (
        <CommentForShop key={key}
                         comment={value}
                         onCommentButton={(payload)=>{this.onCommentButton(payload)}}
                         onLikeCommentButton={(payload)=>this.onLikeCommentButton(payload)}
        />
      )
    }else if(this.props.viewType=='shopComment'){
      return (
        <CommentForComment key={key}
                      comment={value}
                      onCommentButton={(payload)=>{this.onCommentButton(payload)}}
                      onLikeCommentButton={(payload)=>this.onLikeCommentButton(payload)}
        />
      )
    }
  }

  render() {
    return (
      <View style={{flex:1}}>
        {this.renderTopicCommentPage()}
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const isLogin = isUserLogined(state)
  const userInfo = activeUserInfo(state)
  return {
    isLogin : isLogin
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
   userUpShopComment

}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ShopCommentListV2)


const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },

  body: {
    marginTop: normalizeH(64),
    flex: 1,
    backgroundColor: '#E5E5E5',
    paddingBottom: normalizeH(50),
  },
  topicLikesWrap: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 8,
    padding: 15,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
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
    flex: 1
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
    height: 50
  },
  vItem: {
    flex: 1,
    alignSelf: 'flex-start',
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
    color: '#ff7819'
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