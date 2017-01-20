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
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import * as msgTypes from '../../constants/messageActionTypes'
import {hasNewMessageByType, getNewestMessageByType} from '../../selector/messageSelector'
import {hasNewNoticeByType, getNewestNoticeByType} from '../../selector/notifySelector'

const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height
const INQUIRY = 'INQUIRY'
const PERSONAL = 'PERSONAL'
const TOPIC = 'TOPIC'
const SHOP = 'SHOP'
const SYSTEM = 'SYSTEM'

class MessageBox extends Component {
  constructor(props) {
    super(props)
  }

  renderNoticeTip(type) {
    switch (type) {
      case INQUIRY:
        if (this.props.newInquiry) {
          return (
            <View style={styles.noticeTip}></View>
          )
        }
        break
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
      default:
        return <View/>
    }
  }

  renderInquiryMessage() {
    return (
      <View style={styles.itemView}>
        <TouchableOpacity style={styles.selectItem} onPress={() => Actions.INQUIRY_MESSAGE_BOX()}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={styles.noticeIconView}>
              <Image style={styles.noticeIcon} source={require('../../assets/images/notice_question.png')}></Image>
              {this.renderNoticeTip(INQUIRY)}
            </View>
            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.titleStyle}>问诊</Text>
                <View style={{flex: 1}}></View>
                <Text style={styles.timeTip}>{this.props.lastInquiryMsg.lastMessageAt}</Text>
              </View>
              <View style={{marginTop: normalizeH(4), marginRight: normalizeW(15)}}>
                <Text numberOfLines={1} style={styles.msgTip}>{this.props.lastInquiryMsg.lastMessage}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  renderPersonalMessage() {
    return (
      <View style={styles.itemView}>
        <TouchableOpacity style={styles.selectItem} onPress={() => Actions.PRIVATE_MESSAGE_BOX()}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={styles.noticeIconView}>
              <Image style={styles.noticeIcon} source={require('../../assets/images/notice_message.png')}></Image>
              {this.renderNoticeTip(PERSONAL)}
            </View>
            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.titleStyle}>私信</Text>
                <View style={{flex: 1}}></View>
                <Text style={styles.timeTip}>{this.props.lastPersonalMsg.lastMessageAt}</Text>
              </View>
              <View style={{marginTop: normalizeH(4), marginRight: normalizeW(15)}}>
                <Text numberOfLines={1} style={styles.msgTip}>{this.props.lastPersonalMsg.lastMessage}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  renderTopicMessage() {
    return (
      <View style={styles.itemView}>
        <TouchableOpacity style={styles.selectItem} onPress={() => Actions.CHATROOM()}>
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
        </TouchableOpacity>
      </View>
    )
  }

  renderSystemMessage() {
    return (
      <View style={styles.itemView}>
        <TouchableOpacity style={styles.selectItem}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={styles.noticeIconView}>
              <Image style={styles.noticeIcon} source={require('../../assets/images/System_notice.png')}></Image>
              <View style={styles.noticeTip}></View>
            </View>
            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.titleStyle}>系统公告</Text>
                <View style={{flex: 1}}></View>
                <Text style={styles.timeTip}>2017-01-02</Text>
              </View>
              <View style={{marginTop: normalizeH(4), marginRight: normalizeW(15)}}>
                <Text numberOfLines={1} style={styles.msgTip}>郝依依医生给您提供的咨询服务对您是否有用，期待您的反馈！</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
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
          title="消息通知"
        />
        <View style={styles.itemContainer}>
          <ScrollView style={{height: PAGE_HEIGHT}}>
            {this.renderInquiryMessage()}
            {this.renderPersonalMessage()}
            {this.renderTopicMessage()}
            {this.renderShopMessage()}
            {this.renderSystemMessage()}
          </ScrollView>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let newProps = {}
  let newInquiry = hasNewMessageByType(state, msgTypes.INQUIRY_CONVERSATION)
  let lastInquiryMsg = getNewestMessageByType(state, msgTypes.INQUIRY_CONVERSATION)
  let newPersonalLetter = hasNewMessageByType(state, msgTypes.PERSONAL_CONVERSATION)
  let lastPersonalMsg = getNewestMessageByType(state, msgTypes.PERSONAL_CONVERSATION)
  let newTopicNotice = hasNewNoticeByType(state, msgTypes.TOPIC_TYPE)
  let lastTopicNoticeMsg = getNewestNoticeByType(state, msgTypes.TOPIC_TYPE)
  let newShopNotice = hasNewNoticeByType(state, msgTypes.SHOP_TYPE)
  let lastShopNoticeMsg = getNewestNoticeByType(state, msgTypes.SHOP_TYPE)

  newProps.newInquiry = newInquiry
  newProps.lastInquiryMsg = lastInquiryMsg
  newProps.newPersonalLetter = newPersonalLetter
  newProps.lastPersonalMsg = lastPersonalMsg
  newProps.newTopicNotice = newTopicNotice
  newProps.lastLastNoticeMsg = lastTopicNoticeMsg
  newProps.newShopNotice = newShopNotice
  newProps.lastShopNoticeMsg = lastShopNoticeMsg
  return newProps
}
const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MessageBox)

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  itemContainer: {
    width: PAGE_WIDTH,
    ...Platform.select({
      ios: {
        paddingTop: normalizeH(65),
      },
      android: {
        paddingTop: normalizeH(45)
      }
    }),
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
    fontSize: 17,
    color: '#4A4A4A',
    letterSpacing: 0.43,
  },
  msgTip: {
    fontSize: 14,
    color: '#9B9B9B',
    letterSpacing: 0.43,
  },
  timeTip: {
    fontSize: 14,
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