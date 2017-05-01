import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  InteractionManager,
  TouchableOpacity,
  Text,
  Image
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import {PERSONAL_CONVERSATION} from '../../constants/messageActionTypes'
import {fetchUsers} from '../../action/authActions'
import {activeUserId, userInfoByIds, isUserLogined} from '../../selector/authSelector'
import MessageBoxCell from './MessageBoxCell'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'

const ICON_SIZE = 50

class ConversationItem extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    // console.log('ConversationItem************componentWillMount-----------')
  }

  componentDidMount() {
  	let conversation = this.props.conversation
    let members = conversation.members
    let otherMem = members.filter((member) => {
      if (member === this.props.currentUser) {
        return false
      }
      return true
    })
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchUsers({userIds: otherMem})
    })
  }

  enterChatroom() {
  	let conversation = this.props.conversation
    let members = conversation.members
    let type =conversation.type

    if (!this.props.isLogin) {
      Actions.LOGIN()
    } else  {
      let payload = {
        name: this.props.title,
        members: members,
        conversationType: type,
        title: this.props.title,
        backSceneName: 'MESSAGE_BOX',
        backSceneParams: {}
      }
      Actions.CHATROOM(payload)
    }
  }

  renderNoticeTip() {
  	let conversation = this.props.conversation
  	let unreadCount = conversation.unreadCount
    if (unreadCount) {
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
          <View key={'conversation-item-img-icon-', + index}>
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

    let conversation = this.props.conversation
    let lastMessageTime = conversation.lastMessageTime || ''
    let lastMessage = conversation.lastMessage || {}

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
                <Text style={styles.timeTip}>{lastMessageTime}</Text>
              </View>
              <View style={{marginTop: normalizeH(4), marginRight: normalizeW(15)}}>
                <Text numberOfLines={1} style={styles.msgTip}>{lastMessage.text}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let currentUser = activeUserId(state)
  let conversation = ownProps.conversation
  let members = conversation.members

  let otherMem = members.filter((member) => {
    if (member === currentUser) {
      return false
    }
    return true
  })
  let users = userInfoByIds(state, otherMem)

  let title = ""
  if(users && users.length) {
  	let usernames = []
    users.map((user) => {
      if (!user.nickname || user.nickname.length === 0) {
        usernames.push(user.phone)
      } else {
        usernames.push(user.nickname)
      }
    })
    if(usernames.length > 2) {
    	title = usernames.slice(0, 2).join(',') + ",..."
    }else{
    	title = usernames.join(',')
    }
  }

  let isLogin = isUserLogined(state)

  return {
    currentUser: currentUser,
    users: users,
    isLogin: isLogin,
    title: title,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchUsers,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ConversationItem)


const styles = StyleSheet.create({
  itemView: {
    borderBottomWidth: normalizeBorder(),
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



