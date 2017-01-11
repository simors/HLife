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
import {userInfoById, activeUserId, isUserLogined} from '../../selector/authSelector'
import {hasNewMessageById, getNewestMessageById} from '../../selector/messageSelector'
import {WUAI_SYSTEM_DOCTOR} from '../../constants/messageActionTypes'

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
    })
  }

  enterChatroom() {
    if (!this.props.isLogin) {
      Actions.LOGIN()
    } else {
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

  renderChatIcon() {
    let cnt = this.props.users.length
    if (cnt == 1) {
      return (
        <View>
          <Image style={styles.noticeIcon} source={{uri: this.props.users[0].avatar}}></Image>
        </View>
      )
    } else {
      return <View/>
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
  newProps.newMessage = newMessage
  newProps.lastMessage = lastMessage
  newProps.currentUser = activeUserId(state)
  newProps.isLogin = isUserLogined(state)
  newProps.users = users
  return newProps
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getUserInfoById,
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
    width: 50,
    height: 50,
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