/**
 * Created by yangyang on 2017/1/10.
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
  InteractionManager,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH} from '../../util/Responsive'
import {getUserInfoById} from '../../action/authActions'
import {fetchChatMessages} from '../../action/messageAction'
import {userInfoById, activeUserId, isUserLogined} from '../../selector/authSelector'
import {hasNewMessageById, getNewestMessageById, getConversationById} from '../../selector/messageSelector'
import {WUAI_SYSTEM_DOCTOR} from '../../constants/messageActionTypes'

const ICON_SIZE = 50

class MessageBoxCell extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    let memberId = this.props.members.find((member) => {
      if (member === WUAI_SYSTEM_DOCTOR) {
        return false
      }
      if (member === this.props.currentUser) {
        return false
      }
      return true
    })
    InteractionManager.runAfterInteractions(() => {
      this.props.getUserInfoById({userId: memberId})
      this.props.fetchChatMessages({conversationId: this.props.conversation})
    })
  }

  enterChatroom() {
    if (!this.props.isLogin) {
      Actions.LOGIN()
    } else if (!this.props.status) {
      Actions.COMMENT_DOCTOR()
    } else  {
      let payload = {
        name: this.props.title,
        members: this.props.members,
        conversationType: this.props.type,
        title: this.props.title,
      }
      Actions.CHATROOM(payload)
    }
  }

  renderNoticeTip() {
    if (this.props.newMessage) {
      return (
        <View style={styles.noticeTip}></View>
      )
    } else {
      return (
        <View></View>
      )
    }
  }

  renderImageIcon(size) {
    return (
      this.props.users.map((user, index) => {
        if (index >= 9) {
          return <View/>
        }
        return (
          <View key={'msg-box-cell-img-icon-', + index}>
            <Image style={{width: size, height: size}}
                   source={this.props.users[index].avatar? {uri: this.props.users[index].avatar} : require("../../assets/images/default_portrait.png")}>
            </Image>
          </View>
        )
      })
    )
  }

  renderChatIcon() {
    let cnt = this.props.users.length
    if (cnt == 1) {
      return (
        <View>
          <TouchableOpacity onPress={() => Actions.PERSONAL_HOMEPAGE({userId: this.props.users[0].id})}>
            <Image style={styles.noticeIcon}
                   source={this.props.users[0].avatar ? {uri: this.props.users[0].avatar} : require("../../assets/images/default_portrait.png")}>
            </Image>
          </TouchableOpacity>
        </View>
      )
    } else if (cnt == 2 || cnt == 4){
      return (
        <View style={[styles.noticeIcon, {justifyContent: 'center', alignItems: 'center'}]}>
          {this.renderImageIcon(Math.floor(ICON_SIZE/2))}
        </View>
      )
    } else {
      return (
        <View style={[styles.noticeIcon, {justifyContent: 'center', alignItems: 'center'}]}>
          {this.renderImageIcon(Math.floor(ICON_SIZE/3))}
        </View>
      )
    }
  }

  render() {
    return (
      <View style={styles.itemView}>
        <TouchableOpacity style={styles.selectItem} onPress={() => this.enterChatroom()}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={styles.noticeIconView}>
              {this.renderChatIcon()}
              {this.renderNoticeTip()}
            </View>
            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.titleStyle}>{this.props.title}</Text>
                <View style={{flex: 1}}></View>
                <Text style={styles.timeTip}>{this.props.lastMessage.lastMessageAt}</Text>
              </View>
              <View style={{marginTop: normalizeH(4), marginRight: normalizeW(15)}}>
                <Text numberOfLines={1} style={styles.msgTip}>{this.props.lastMessage.lastMessage}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let newProps = {}
  let users = []
  ownProps.members.forEach((member) => {
    if (member !== activeUserId(state) && member !== WUAI_SYSTEM_DOCTOR) {
      let userInfoRecord = userInfoById(state, member)
      let userInfo
      if (userInfoRecord) {
        userInfo = userInfoRecord.toJS()
        users.push(userInfo)
      }
    }
  })

  let newMessage = hasNewMessageById(state, ownProps.conversation)
  let lastMessage = getNewestMessageById(state, ownProps.conversation)
  let conversation = getConversationById(state, ownProps.conversation)
  newProps.newMessage = newMessage
  newProps.lastMessage = lastMessage
  newProps.currentUser = activeUserId(state)
  newProps.isLogin = isUserLogined(state)
  newProps.users = users
  newProps.status =conversation.status
  return newProps
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getUserInfoById,
  fetchChatMessages,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MessageBoxCell)

const styles = StyleSheet.create({
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
    width: ICON_SIZE,
    height: ICON_SIZE,
    // borderRadius: 25,
    // overflow: 'hidden',
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