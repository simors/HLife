/**
 * Created by yangyang on 2017/1/20.
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
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import Expander from '../common/Expander'
import TopicInfoCell from './TopicInfoCell'
import * as msgActionTypes from '../../constants/messageActionTypes'
import {getNoticeListByType} from '../../selector/notifySelector'
import {enterTypedNotify, clearNotifyMsg} from '../../action/messageAction'
import {activeUserInfo} from '../../selector/authSelector'
import {publishTopicFormData, TOPIC_FORM_SUBMIT_TYPE} from '../../action/topicActions'
import KeyboardAwareToolBar from '../common/KeyboardAwareToolBar'
import ToolBarContent from '../shop/ShopCommentReply/ToolBarContent'
import dismissKeyboard from 'react-native-dismiss-keyboard'
import * as Toast from '../common/Toast'
import Popup from '@zzzkk2009/react-native-popup'
import * as AVUtils from '../../util/AVUtils'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class TopicNotifyView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      topicId: '',
      replyTo: '',
      commentId: '',
      replyUserNickName: '',
    }
  }

  componentDidMount() {
    this.props.enterTypedNotify({type: msgActionTypes.TOPIC_TYPE})
  }

  sendReply(content) {
    this.props.publishTopicFormData({
      content: content,
      topicId: this.state.topicId,
      userId: this.props.userInfo.id,
      replyTo: this.state.replyTo,
      commentId: this.state.commentId,
      submitType: TOPIC_FORM_SUBMIT_TYPE.PUBLISH_TOPICS_COMMENT,
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
    if (this.replyInput) {
      this.replyInput.focus()
    }
    this.setState({
      topicId: notice.topicId,
      commentId: notice.commentId,
      replyTo: notice.userId,
      replyUserNickName: notice.nickname,
    })
  }

  renderReplyBtn(notice) {
    if (notice.msgType === msgActionTypes.MSG_TOPIC_COMMENT) {
      return (
        <View style={{paddingRight: 15}}>
          <TouchableOpacity onPress={()=> {
            this.openReplyBox(notice)
          }}>
            <View style={{
              borderRadius: 3,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 6,
              paddingLeft: 12,
              paddingRight:12,
              backgroundColor: '#f5f5f5'
            }}>
              <Text style={{fontSize: em(15), color: '#5a5a5a'}}>回 复</Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    }
    return <View/>
  }

  renderMsgContent(notice) {
    if (notice.msgType === msgActionTypes.MSG_TOPIC_COMMENT) {
      return (
        <View style={styles.msgViewStyle}>
          <Expander 
            showLines={3} 
            showLinesHeight={50} 
            textStyle={{fontSize: em(17), color: '#030303', lineHeight: em(24)}}
            expanderTextStyle={{fontSize: em(17),marginTop:10}}
            content={notice.commentContent}
          />
        </View>
      )
    }else if (notice.msgType === msgActionTypes.MSG_TOPIC_LIKE) {
      return (
        <View style={styles.msgViewStyle}>
          <Expander 
            showLines={3} 
            showLinesHeight={50} 
            textStyle={{fontSize: em(17), color: '#030303', lineHeight: em(24)}}
            expanderTextStyle={{fontSize: em(17),marginTop:10}}
            content='赞了这篇文章'
          />
        </View>
      )
    } else {
      return (
        <View style={styles.msgViewStyle}>
          <Expander 
            showLines={3} 
            showLinesHeight={50} 
            textStyle={{fontSize: em(17), color: '#030303', lineHeight: em(24)}}
            expanderTextStyle={{fontSize: em(17),marginTop:10}}
            content={notice.text}
          />
        </View>
      )
    }
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
            <View>
              <Text style={styles.userNameStyle}>{notice.nickname ? notice.nickname : '未命名'}</Text>
            </View>
            <View style={{flexDirection: 'row', paddingTop: 10}}>
              <Text style={{fontSize: em(12), color: '#B6B6B6', width: 76}}>{notice.timestamp}</Text>
            </View>
          </View>
          <View style={{flex: 1}}/>
          {this.renderReplyBtn(notice)}
        </View>
        {this.renderMsgContent(notice)}
        <TopicInfoCell topicId={notice.topicId}/>
      </View>
    )
  }

  clear(){
    Popup.confirm({
      title: '话题互动',
      content: '删除后无法恢复，确认删除？',
      ok: {
        text: '确认',
        style: {color: '#FF7819'},
        callback: ()=>{
          this.props.clearNotifyMsg({
            noticeType: msgActionTypes.TOPIC_TYPE,
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
          <Text style={{color:'#b2b2b2',fontSize:17,marginBottom:15}}>一个互动话题都没有</Text>
          <Text style={{color:'#b2b2b2',fontSize:17,marginBottom:60}}>好吃的、好玩的、新鲜的要和邻居分享噢</Text>
          <TouchableOpacity style={{backgroundColor:'#ff7819',borderRadius:5,padding:12,paddingLeft:30,paddingRight:30}} 
            onPress={()=>{
              AVUtils.switchTab('FIND')
            }}>
              <Text style={{color:'white',fontSize:17}}>进入邻家话题</Text>
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
          title="话题互动"
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
            replyInputRefCallBack={(input)=> {
              this.replyInput = input
            }}
            onSend={(content) => {
              this.sendReply(content)
            }}
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
  let noticeList = getNoticeListByType(state, msgActionTypes.TOPIC_TYPE)
  const userInfo = activeUserInfo(state)
  newProps.noticeList = noticeList
  let hasData = false
  if(noticeList && noticeList.length) {
    hasData = true
  }
  newProps.hasData = hasData
  newProps.dataSource = ds.cloneWithRows(noticeList)
  newProps.userInfo = userInfo
  return newProps
}
const mapDispatchToProps = (dispatch) => bindActionCreators({
  enterTypedNotify,
  publishTopicFormData,
  clearNotifyMsg
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(TopicNotifyView)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  itemContainer: {
    flex: 1,
    width: PAGE_WIDTH,
    ...Platform.select({
      ios: {
        marginTop: normalizeH(65),
      },
      android: {
        marginTop: normalizeH(45)
      }
    }),
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
    color: '#5a5a5a'
  },
  msgViewStyle: {
    marginTop: 21,
    marginBottom: 15,
    justifyContent: 'center',
    paddingLeft: 18,
    paddingRight: 18,
  },
})