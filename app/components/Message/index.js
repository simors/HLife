/**
 * Created by yangyang on 2016/12/22.
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
import * as msgTypes from '../../constants/messageActionTypes'
import {hasNewMessageByType, getNewestMessageByType, getOrderedConvsByType} from '../../selector/messageSelector'
import {hasNewNoticeByType, getNewestNoticeByType} from '../../selector/notifySelector'
import * as pushSelector from '../../selector/pushSelector'
import {updateSystemNotice, updateSystemNoticeAsMarkReaded} from '../../action/pushAction'
import Icon from 'react-native-vector-icons/Ionicons'
import CommonListView from '../common/CommonListView'
import {PERSONAL_CONVERSATION} from '../../constants/messageActionTypes'
import {fetchConversation} from '../../action/messageAction'
import ConversationItem from './ConversationItem'
import {activeUserId, isUserLogined} from '../../selector/authSelector'
import * as Toast from '../common/Toast'
import {fetchUsers} from '../../action/authActions'

const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height
const INQUIRY = 'INQUIRY'
const PERSONAL = 'PERSONAL'
const TOPIC = 'TOPIC'
const SHOP = 'SHOP'
const SYSTEM = 'SYSTEM'
const PROMOTE = 'PROMOTE'

class MessageBox extends Component {
  constructor(props) {
    super(props)

    this.oldChatMessageSoundOpen = true
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      // console.log('MessageBox=========componentWillMount-----------')
      this.refreshData()
    })
  }

  componentDidMount() {
    this.oldChatMessageSoundOpen = global.chatMessageSoundOpen
    global.chatMessageSoundOpen = false
  }

  componentWillUnmount() {
    global.chatMessageSoundOpen = this.oldChatMessageSoundOpen
  }

  renderNoticeTip(type) {
    switch (type) {
      case PERSONAL:
        if (this.props.newPersonalLetter) {
          return (
            <View style={styles.noticeTip}></View>
          )
        }
        break
      case TOPIC:
        if (this.props.newTopicNotice) {
          return (
            <View style={styles.noticeTip}></View>
          )
        }
        break
      case SHOP:
        if (this.props.newShopNotice) {
          return (
            <View style={styles.noticeTip}></View>
          )
        }
        break
    case PROMOTE:
      if (this.props.newPromoteNotice) {
        return (
          <View style={styles.noticeTip}></View>
        )
      }
      break  
      default:
        return <View/>
    }
  }

  renderTopicMessage() {
    return (
      <View style={styles.itemView}>
        <TouchableOpacity style={styles.selectItem} onPress={() => Actions.TOPIC_NOTIFY()}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={styles.noticeIconView}>
              <Image style={styles.noticeIcon} source={require('../../assets/images/notice_topic.png')}></Image>
              {this.renderNoticeTip(TOPIC)}
            </View>
            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.titleStyle}>话题互动</Text>
                <View style={{flex: 1}}></View>
                <Text style={styles.timeTip}>{this.props.lastLastNoticeMsg.lastMessageAt}</Text>
              </View>
              <View style={{marginTop: normalizeH(4), marginRight: normalizeW(15)}}>
                <Text numberOfLines={1} style={styles.msgTip}>{this.props.lastLastNoticeMsg.lastMessage}</Text>
              </View>
            </View>
          </View>
          <Icon
            name="ios-arrow-forward"
            style={{marginLeft:6,marginRight:15,color:'#f5f5f5',fontSize:20}}/>
        </TouchableOpacity>
      </View>
    )
  }

  renderShopMessage() {
    return (
      <View style={styles.itemView}>
        <TouchableOpacity style={styles.selectItem} onPress={() => Actions.SHOP_NOTIFY()}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={styles.noticeIconView}>
              <Image style={styles.noticeIcon} source={require('../../assets/images/notice_shop.png')}></Image>
              {this.renderNoticeTip(SHOP)}
            </View>
            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.titleStyle}>店铺消息</Text>
                <View style={{flex: 1}}></View>
                <Text style={styles.timeTip}>{this.props.lastShopNoticeMsg.lastMessageAt}</Text>
              </View>
              <View style={{marginTop: normalizeH(4), marginRight: normalizeW(15)}}>
                <Text numberOfLines={1} style={styles.msgTip}>{this.props.lastShopNoticeMsg.lastMessage}</Text>
              </View>
            </View>
          </View>
          <Icon
            name="ios-arrow-forward"
            style={{marginLeft:6,marginRight:15,color:'#f5f5f5',fontSize:20}}/>
        </TouchableOpacity>
      </View>
    )
  }

  renderSystemMessage() {
    return (
      <View style={styles.itemView}>
        <TouchableOpacity style={styles.selectItem} onPress={() => {this.gotoSystemNoticeList()}}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={styles.noticeIconView}>
              <Image style={styles.noticeIcon} source={require('../../assets/images/notice_system.png')}></Image>
              {!this.props.newestSystemNotice.hasReaded && this.props.newestSystemNotice.message_title &&
                <View style={styles.noticeTip}></View>
              }
            </View>
            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.titleStyle}>系统公告</Text>
                <View style={{flex: 1}}></View>
                <Text style={styles.timeTip}>{this.props.newestSystemNotice.notice_time}</Text>
              </View>
              <View style={{marginTop: normalizeH(4), marginRight: normalizeW(15)}}>
                <Text numberOfLines={1} style={styles.msgTip}>{this.props.newestSystemNotice.message_title || '暂无系统公告'}</Text>
              </View>
            </View>
          </View>
          <Icon
            name="ios-arrow-forward"
            style={{marginLeft:6,marginRight:15,color:'#f5f5f5',fontSize:20}}/>
        </TouchableOpacity>
      </View>
    )
  }

  renderPromoteMessage() {
    return (
      <View style={styles.itemView}>
        <TouchableOpacity style={styles.selectItem} onPress={() => Actions.PRIVATE_MESSAGE_BOX()}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={styles.noticeIconView}>
              <Image style={styles.noticeIcon} source={require('../../assets/images/notice_profit.png')}></Image>
              {this.renderNoticeTip(PROMOTE)}
            </View>
            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.titleStyle}>推广收益</Text>
              </View>
              <View style={{marginTop: normalizeH(4), marginRight: normalizeW(15)}}>
                <Text numberOfLines={1} style={styles.msgTip}>{this.props.lastPersonalMsg.lastMessage}</Text>
              </View>
            </View>
          </View>
          <Icon
            name="ios-arrow-forward"
            style={{marginLeft:6,marginRight:15,color:'#f5f5f5',fontSize:20}}/>
        </TouchableOpacity>
      </View>
    )
  }

  renderCustomColumn() {
    return (
      <View key="custom-column" style={{flex:1}}>
        {this.renderTopicMessage()}
        {this.renderShopMessage()}
        {this.renderSystemMessage()}
        {/*this.renderPromoteMessage()*/}
      </View>
    )
  }

  renderPrivateMessageList() {
    const privateConversations = this.props.privateConversations

    let privateConversationsView = <View/>
    if(privateConversations && privateConversations.length) {
      privateConversationsView = privateConversations.map((conversation, index)=>{
        return (
          <View key={'private-message-' + index}>
            <ConversationItem conversation={conversation} />
          </View>
        )
      })
    }

    return (
      <View style={{flex:1}}>
        {privateConversationsView}
      </View>
    )
  }

  renderRow(rowData, rowId) {
    switch (rowData.type) {
      case 'CUSTOM_COLUMN':
        return this.renderCustomColumn()
      case 'PRIVATE_MESSAGE':
        return this.renderPrivateMessageList()
      default:
        return <View />
    }
  }

  refreshData() {
    this.loadMoreData(true)
  }

  loadMoreData(isRefresh) {
    // console.log('loadMoreData.isRefresh=====', isRefresh)
    // console.log('loadMoreData.this.props.lastUpdatedAt=====', this.props.lastUpdatedAt)
    if(!isRefresh && !this.props.lastUpdatedAt) {
      return
    }

    if(this.isQuering) {
      return
    }
    this.isQuering = true

    let payload = {
      isRefresh: !!isRefresh,
      lastUpdatedAt: this.props.lastUpdatedAt,
      type: PERSONAL_CONVERSATION,
      success: (isEmpty, convs) => {
        // console.log('convs---------->', convs)
        this.isQuering = false

        if(!this.listView) {
          return
        }
        // console.log('loadMoreData.isEmpty=====', isEmpty)
        if(isEmpty) {
          this.listView.isLoadUp(false)
        }else {
          this.listView.isLoadUp(true)

          let memberSet = new Set()
          let convMembers = []
          convs.forEach((conv) => {
            // console.log('conv.members=====', conv.members)
            convMembers = convMembers.concat(conv.members)
          })
          convMembers.map(x => memberSet.add(x))
          // console.log('memberSet=====', memberSet)
          let otherMembers = [...memberSet]
          let activeUserId = this.props.activeUserId
          otherMembers.filter((element, index, array) => {
            return element != activeUserId
          })
          // console.log('otherMembers=====', otherMembers)
          this.props.fetchUsers({userIds: otherMembers})
        }
      },
      error: (err)=>{
        this.isQuering = false
        Toast.show(err.message, {duration: 1000})
      }
    }
    this.props.fetchConversation(payload)
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => {
              Actions.pop()
            }}
          title="消息通知"
        />
        <View style={styles.itemContainer}>
          <CommonListView
            dataSource={this.props.ds}
            renderRow={(rowData, rowId) => this.renderRow(rowData, rowId)}
            loadNewData={()=> {
              this.refreshData()
            }}
            loadMoreData={()=> {
              this.loadMoreData()
            }}
            ref={(listView) => this.listView = listView}
          />
        </View>
      </View>
    )
  }

  gotoSystemNoticeList() {
    // console.log('gotoSystemNoticeList', this.props.newestSystemNotice)
    if(this.props.newestSystemNotice.message_title) {
      this.props.updateSystemNoticeAsMarkReaded(this.props.newestSystemNotice)
    }
    Actions.SYSTEM_NOTIFY()
  }
}

const mapStateToProps = (state, ownProps) => {
  let newProps = {}
  let newPersonalLetter = hasNewMessageByType(state, msgTypes.PERSONAL_CONVERSATION)
  let lastPersonalMsg = getNewestMessageByType(state, msgTypes.PERSONAL_CONVERSATION)
  let newTopicNotice = hasNewNoticeByType(state, msgTypes.TOPIC_TYPE)
  let lastTopicNoticeMsg = getNewestNoticeByType(state, msgTypes.TOPIC_TYPE)
  let newShopNotice = hasNewNoticeByType(state, msgTypes.SHOP_TYPE)
  let lastShopNoticeMsg = getNewestNoticeByType(state, msgTypes.SHOP_TYPE)
  let systemNoticeList = pushSelector.selectSystemNoticeList(state)

  let privateConversations = getOrderedConvsByType(state, PERSONAL_CONVERSATION)
  // console.log('privateConversations=======', privateConversations)

  let lastUpdatedAt = ''
  if(privateConversations && privateConversations.length) {
    lastUpdatedAt = privateConversations[privateConversations.length - 1].updatedAt
  }

  let newestSystemNotice = {}
  if(systemNoticeList && systemNoticeList.length) {
    newestSystemNotice = systemNoticeList[0]
  }
  // console.log('systemNoticeList--->>>>>', systemNoticeList)

  let ds = undefined
  if (ownProps.ds) {
    ds = ownProps.ds
  } else {
    ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2,
    })
  }

  let dataArray = []
  dataArray.push({type: 'CUSTOM_COLUMN'})
  dataArray.push({type: 'PRIVATE_MESSAGE'})

  newProps.ds = ds.cloneWithRows(dataArray)

  newProps.privateConversations = privateConversations
  newProps.lastUpdatedAt = lastUpdatedAt

  newProps.newPersonalLetter = newPersonalLetter
  newProps.lastPersonalMsg = lastPersonalMsg
  newProps.newTopicNotice = newTopicNotice
  newProps.lastLastNoticeMsg = lastTopicNoticeMsg
  newProps.newShopNotice = newShopNotice
  newProps.lastShopNoticeMsg = lastShopNoticeMsg
  newProps.newestSystemNotice = newestSystemNotice
  newProps.activeUserId = activeUserId(state)
  return newProps
}
const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateSystemNoticeAsMarkReaded,
  fetchConversation,
  fetchUsers
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MessageBox)

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  itemContainer: {
    flex:1,
    width: PAGE_WIDTH,
    marginTop: normalizeH(65),
  },
  itemView: {
    borderBottomWidth: 1,
    borderColor: '#E6E6E6',
    alignItems: 'center',
  },
  selectItem: {
    flexDirection: 'row',
    height: normalizeH(63),
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  titleStyle: {
    fontSize: em(17),
    color: '#4A4A4A',
    letterSpacing: 0.43,
  },
  msgTip: {
    fontSize: em(14),
    color: '#9B9B9B',
    letterSpacing: 0.43,
  },
  timeTip: {
    fontSize: em(14),
    color: '#9B9B9B',
    letterSpacing: 0.43,
    marginRight: normalizeW(15)
  },
  noticeIconView: {
    marginLeft: normalizeW(15),
    marginRight: normalizeW(19)
  },
  noticeIcon: {
    width: 35,
    height: 35,
  },
  noticeTip: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red',
    position: 'absolute',
    top: 0,
    right: 0,
  },
})