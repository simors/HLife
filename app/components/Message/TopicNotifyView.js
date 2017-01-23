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
import {enterTypedNotify} from '../../action/messageAction'
import {activeUserInfo} from '../../selector/authSelector'
import {publishTopicFormData, TOPIC_FORM_SUBMIT_TYPE} from '../../action/topicActions'
import KeyboardAwareToolBar from '../common/KeyboardAwareToolBar'
import ToolBarContent from '../shop/ShopCommentReply/ToolBarContent'
import dismissKeyboard from 'react-native-dismiss-keyboard'
import * as Toast from '../common/Toast'

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
              borderWidth: 1,
              width: 54,
              height: 25,
              borderColor: '#E9E9E9',
              borderRadius: 3,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Text style={{fontSize: 14, color: '#50E3C2'}}>回 复</Text>
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
          <Expander showLines={3} textStyle={{fontSize: 17, color: '#4a4a4a', lineHeight: 24,}}
                    content={notice.commentContent}/>
        </View>
      )
    } else {
      return (
        <View style={styles.msgViewStyle}>
          <Expander showLines={3} textStyle={{fontSize: 17, color: '#4a4a4a', lineHeight: 24,}} content={notice.text}/>
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
            <View style={{flexDirection: 'row', paddingTop: 2}}>
              <Text style={{fontSize: 12, color: '#B6B6B6', width: 76}}>{notice.timestamp}</Text>
              <Image style={{width: 10, height: 13, marginLeft: 18}}
                     source={require("../../assets/images/writer_loaction.png")}/>
              <Text style={{fontSize: 12, color: '#B6B6B6', paddingLeft: 2}}>长沙</Text>
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

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="话题消息"
        />
        <View style={styles.itemContainer}>
          <ScrollView style={{height: PAGE_HEIGHT}}>
            <ListView
              dataSource={this.props.dataSource}
              renderRow={(notice) => this.renderNoticeItem(notice)}
            />
          </ScrollView>
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
  newProps.dataSource = ds.cloneWithRows(noticeList)
  newProps.userInfo = userInfo
  return newProps
}
const mapDispatchToProps = (dispatch) => bindActionCreators({
  enterTypedNotify,
  publishTopicFormData
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(TopicNotifyView)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  itemContainer: {
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
    fontSize: 15,
    color: '#50E3C2'
  },
  msgViewStyle: {
    marginTop: 21,
    marginBottom: 15,
    justifyContent: 'center',
    paddingLeft: 18,
    paddingRight: 18,
  },
})