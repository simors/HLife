/**
 * Created by yangyang on 2017/1/18.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  Platform,
  TouchableOpacity,
  ScrollView,
  ListView,
  InteractionManager
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import Expander from '../common/Expander'
import ShopInfoCell from './ShopInfoCell'
import * as msgActionTypes from '../../constants/messageActionTypes'
import {getNoticeListByType} from '../../selector/notifySelector'
import * as authSelector from '../../selector/authSelector'
import KeyboardAwareToolBar from '../common/KeyboardAwareToolBar'
import ToolBarContent from '../shop/ShopCommentReply/ToolBarContent'
import dismissKeyboard from 'react-native-dismiss-keyboard'
import * as Toast from '../common/Toast'
import {reply} from '../../action/shopAction'
import {enterTypedNotify, clearNotifyMsg} from '../../action/messageAction'
import {fetchUserOwnedShopInfo} from '../../action/shopAction'
import {selectUserOwnedShopInfo} from '../../selector/shopSelector'
import Popup from '@zzzkk2009/react-native-popup'
import * as AVUtils from '../../util/AVUtils'

const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height

class ShopNotifyView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      shopId: '',
      replyId : '',
      replyUserId: '',
      replyUserNickName : '',
      replyShopCommentId: '',
      replyShopCommentUserId: '',
    }
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchUserOwnedShopInfo()
      this.props.enterTypedNotify({type: msgActionTypes.SHOP_TYPE})
    })
  }

  componentDidMount() {
    
  }

  sendReply(content) {
    if(!this.props.isUserLogined) {
      Actions.LOGIN()
      return
    }
    this.props.reply({
      shopId: this.state.shopId,
      replyShopCommentId : this.state.replyShopCommentId,
      replyId : this.state.replyId,
      replyUserId : this.state.replyUserId,
      replyShopCommentUserId : this.state.replyShopCommentUserId,
      replyContent : content,
      from: 'SHOP_NOTIFY',
      success: (result) => {
        dismissKeyboard()
        Toast.show('回复成功', {duration: 1500})
      },
      error: (err) => {
        Toast.show(err.message, {duration: 1500})
      }
    })
  }

  openReplyBox(notice) {
    if(this.replyInput) {
      this.replyInput.focus()
    }
    // console.log('openReplyBox.notice===', notice)
    this.setState({
      shopId: notice.shopId,
      replyShopCommentId: notice.commentId,
      replyId: notice.replyId,
      replyUserId: notice.userId,
      replyUserNickName: notice.nickname,
      replyShopCommentUserId: notice.userId
    })
  }

  renderReplyBtn(notice) {
    // if (notice.msgType === msgActionTypes.MSG_SHOP_COMMENT) {
    //   return (
    //     <View style={{paddingRight: 15}}>
    //       <TouchableOpacity onPress={()=>{this.openReplyBox(notice)}}>
    //         <View style={{borderWidth: 1, width: 54, height: 25, borderColor: '#E9E9E9', borderRadius: 3, justifyContent: 'center', alignItems: 'center'}}>
    //           <Text style={{fontSize: em(14), color: '#ff7819'}}>回 复</Text>
    //         </View>
    //       </TouchableOpacity>
    //     </View>
    //   )
    // }
    return <View/>
  }

  isShopKeeper(notice) {
    let userOwnedShopInfo = this.props.userOwnedShopInfo
    let isShopKeeper = false
    if(userOwnedShopInfo.id == notice.shopId) {
      isShopKeeper = true
    }
    return isShopKeeper
  }

  renderMsgContent(notice) {
    // console.log('notice===', notice)
    let isShopKeeper = this.isShopKeeper(notice)
    // console.log('isShopKeeper===', isShopKeeper)
    if (notice.msgType === msgActionTypes.MSG_SHOP_COMMENT) {
      if(notice.replyId) {
        return (
          <View style={styles.msgViewStyle}>
            <Text style={{fontSize:17,color:'#ff7819', marginBottom:10}}>
              {isShopKeeper ? '回复了我的店铺评论' : '回复了我的评论'}
            </Text>
            <Expander 
              showLines={3} 
              showLinesHeight={50} 
              textStyle={{fontSize: em(17), color: '#030303', lineHeight: em(24)}}
              expanderTextStyle={{fontSize: em(17),marginTop:10}}
              content={notice.replyContent}
            />
          </View>
        )
      }else{
        return (
          <View style={styles.msgViewStyle}>
            {isShopKeeper
              ? <Text style={{fontSize:17,color:'#ff7819', marginBottom:10}}>
                  评论了我的店铺
                </Text>
              : null
            }
            <Expander 
              showLines={3} 
              showLinesHeight={50} 
              textStyle={{fontSize: em(17), color: '#030303', lineHeight: em(24)}}
              expanderTextStyle={{fontSize: em(17),marginTop:10}}
              content={notice.commentContent}
            />
          </View>
        )
      }
    }else if(notice.msgType === msgActionTypes.MSG_PUBLISH_SHOP_PROMOTION) {//店铺活动
      return (
        <View style={styles.msgViewStyle}>
          <Text style={{fontSize:17,color:'#ff7819'}}>
            发布了新的活动
          </Text>
        </View>
      )
    } else {
      if(isShopKeeper) {
        return (
          <View style={styles.msgViewStyle}>
            <Text style={{fontSize:17,color:'#ff7819'}}>
              关注了我的店铺
            </Text>
          </View>
        )
      }
    }
  }

  renderShopPromotionCell(notice) {
    return (
      <TouchableOpacity onPress={() => Actions.SHOP_PROMOTION_DETAIL({id:notice.shopPromotionId})}>
        <View style={{padding:12,paddingTop:0,flex:1}}>
          <View style={{flex:1,flexDirection: 'row', backgroundColor:'#f5f5f5'}}>
            <Image style={{width:80,height:80}} source={{uri: notice.shopPromotionCoverUrl}} />
            <View style={{flex:1,marginLeft:22,paddingTop:15,paddingBottom:20}}>
              <Text numberOfLines={1} style={{marginBottom:17,color:'#5a5a5a',fontSize:17,fontWeight:'bold'}}>{notice.shopPromotionTitle}</Text>
              <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                <View style={{padding:3,paddingLeft:6,paddingRight:6,backgroundColor:'#f6a623',marginRight:10,borderRadius:2}}>
                  <Text style={{color:'white',fontSize:12}}>{notice.shopPromotionType}</Text>
                </View>
                <Text numberOfLines={1} style={{color:'#aaa',fontSize:12}}>{notice.shopPromotionTypeDesc}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  renderNoticeItem(notice) {
    return (
      <View style={styles.itemView}>
        <View style={styles.personView}>
          <TouchableOpacity onPress={() => Actions.PERSONAL_HOMEPAGE({userId: notice.userId})}>
            <View style={styles.avtarView}>
              <Image style={styles.avtarStyle}
                     source={notice.avatar ? {uri: notice.avatar} : require("../../assets/images/default_portrait.png")}>
              </Image>
            </View>
          </TouchableOpacity>
          <View style={{marginLeft: 10, justifyContent: 'center'}}>
            <TouchableOpacity onPress={() => Actions.PERSONAL_HOMEPAGE({userId: notice.userId})}>
              <Text style={styles.userNameStyle}>{notice.nickname ? notice.nickname : '未命名'}</Text>
            </TouchableOpacity>
            <View style={{flexDirection: 'row', paddingTop: 10}}>
              <Text style={{fontSize: em(12), color: '#B6B6B6', width: 76}}>{notice.timestamp}</Text>
            </View>
          </View>
          <View style={{flex: 1}}/>
          {this.renderReplyBtn(notice)}
        </View>
        {this.renderMsgContent(notice)}
        <View style={{marginTop:15}}>
          {notice.msgType === msgActionTypes.MSG_PUBLISH_SHOP_PROMOTION
            ? this.renderShopPromotionCell(notice)
            : <ShopInfoCell shopId={notice.shopId}/>
          }
        </View>
      </View>
    )
  }

  clear(){
    Popup.confirm({
      title: '店铺消息',
      content: '删除后无法恢复，确认删除？',
      ok: {
        text: '确认',
        style: {color: '#FF7819'},
        callback: ()=>{
          this.props.clearNotifyMsg({
            noticeType: msgActionTypes.SHOP_TYPE,
            success: ()=>{
              Toast.show('清空成功')
            }
          })
        }
      },
      cancel: {
        text: '取消',
        callback: ()=>{
        }
      }
    })
  }

  renderContent() {
    if(this.props.hasData) {
      return (
        <ListView
          dataSource={this.props.dataSource}
          renderRow={(notice) => this.renderNoticeItem(notice)}
        />
      )
    }else{
      return (
        <View style={[{position:'absolute',left:0,right:0,top:0,bottom:0,backgroundColor:'white',justifyContent:'center',alignItems:'center'}]}>
          <Image style={{marginBottom:20}} source={require('../../assets/images/none_message_140.png')}/>
          <Text style={{color:'#b2b2b2',fontSize:17,marginBottom:15}}>一条店铺消息都没有</Text>
          <Text style={{color:'#b2b2b2',fontSize:17,marginBottom:60}}>为了生活更方便，去看看周边的店铺吧</Text>
          <TouchableOpacity style={{backgroundColor:'#ff7819',borderRadius:5,padding:12,paddingLeft:30,paddingRight:30}} 
            onPress={()=>{
              AVUtils.switchTab('LOCAL')
            }}>
              <Text style={{color:'white',fontSize:17}}>进入邻家店铺</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="店铺消息"
          rightType={this.props.hasData ? 'text' : 'none'}
          rightPress={()=>{this.clear()}}
          rightText='清空'
          rightStyle={{color:'#ff7819'}}
        />
        <View style={styles.itemContainer}>
          {this.renderContent()}
        </View>

        <KeyboardAwareToolBar
            initKeyboardHeight={-50}
          >
            <ToolBarContent
              replyInputRefCallBack={(input)=>{this.replyInput = input}}
              onSend={(content) => {this.sendReply(content)}}
              placeholder={this.state.replyUserNickName ? '回复' + this.state.replyUserNickName + ':' : '回复:'}
            />
          </KeyboardAwareToolBar>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let newProps = {}
  let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
  let noticeList = getNoticeListByType(state, msgActionTypes.SHOP_TYPE)
  newProps.noticeList = noticeList
  let hasData = false
  if(noticeList && noticeList.length) {
    hasData = true
  }
  newProps.hasData = hasData
  newProps.dataSource = ds.cloneWithRows(noticeList)
  const isUserLogined = authSelector.isUserLogined(state)
  newProps.isUserLogined = isUserLogined
  const userOwnedShopInfo = selectUserOwnedShopInfo(state)
  newProps.userOwnedShopInfo = userOwnedShopInfo
  return newProps
}
const mapDispatchToProps = (dispatch) => bindActionCreators({
  reply,
  enterTypedNotify,
  fetchUserOwnedShopInfo,
  clearNotifyMsg
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ShopNotifyView)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  itemContainer: {
    flex: 1,
    width: PAGE_WIDTH,
    marginTop: normalizeH(65),
  },
  itemView: {
    marginBottom: 10,
    backgroundColor: '#FFFFFF'
  },
  personView: {
    flexDirection: 'row',
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 12,
  },
  avtarView: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden'
  },
  avtarStyle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden'
  },
  userNameStyle: {
    fontSize: em(15),
    color: '#ff7819'
  },
  msgViewStyle: {
    marginTop: 21,
    justifyContent: 'center',
    paddingLeft: 18,
    paddingRight: 18,
  },
})