/**
 * Created by yangyang on 2016/12/19.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  InteractionManager,
  Platform
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import {GiftedChat} from './GifedChat/GiftedChat'
import Header from '../common/Header'
import CustomInputToolbar from './CustomInputToolbar'
import CustomMessage from './CustomMessage'
import {createConversation, leaveConversation, enterConversation, sendMessage, initMessageClient} from '../../action/messageAction'
import {getUserInfoById} from '../../action/authActions'
import {activeUserInfo, userInfoById} from '../../selector/authSelector'
import {activeConversation, getMessages} from '../../selector/messageSelector'
import * as msgTypes from '../../constants/messageActionTypes'

const PAGE_WIDTH = Dimensions.get('window').width

class Chatroom extends Component {
  constructor(props) {
    super(props)
    this.onSend = this.onSend.bind(this)
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      console.log('begin to create conversation:', this.props.name, this.props.members)
      this.props.members.forEach((member) => {
        this.props.getUserInfoById({userId: member})
      })
      this.props.createConversation({
        members: this.props.members,
        name: this.props.name,
        type: this.props.conversationType,
      })
    })
  }

  componentWillUnmount() {
    this.props.leaveConversation()
  }

  onSend(messages = []) {
    let time = Date.parse(new Date())
    let msgId = this.props.name + '_' + time

    let payload = {
      msgId: msgId,
      conversationId: this.props.conversationId,
    }
    messages.forEach((value) => {
      if (value.text && value.text.length > 0) {
        payload.type = msgTypes.MSG_TEXT
        payload.text = value.text
      } else if (value.image && value.image.length > 0) {
        payload.type = msgTypes.MSG_IMAGE
        payload.text = value.image
        payload.fileName = value.fileName
        payload.uri = value.image
      }
      this.props.sendMessage(payload)
    })
  }

  renderCustomInputToolbar(toolbarProps) {
    return (
      <CustomInputToolbar {...toolbarProps}/>
    )
  }

  renderCustomMessage(messageProps) {
    return (
      <CustomMessage {...messageProps}/>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title={this.props.title}
        />
        <View style={styles.conversationView}>
          <GiftedChat
            messages={this.props.messages}
            onSend={this.onSend}
            user={{
              _id: this.props.user.id,
              name: this.props.user.nickname ? this.props.user.nickname : this.props.user.phone,
              avatar: this.props.user.avatar,
            }}
            renderInputToolbar={(toobarProps) => this.renderCustomInputToolbar(toobarProps)}
            renderMessage={(messageProps) => this.renderCustomMessage(messageProps)}
          />
        </View>
      </View>
    )
  }
}

Chatroom.defaultProps = {
  title: '聊天室'
}

const mapStateToProps = (state, ownProps) => {
  let newProps = {}
  let user = activeUserInfo(state)
  let conversationId = activeConversation(state)
  let lcMsg = getMessages(state, conversationId)
  let messages = []

  newProps.user = user
  newProps.conversationId = conversationId
  lcMsg.forEach((value) => {
    let from = value.from
    let userInfo = userInfoById(state, from).toJS()
    let type = value.type
    let msg = {}
    if (type == msgTypes.MSG_TEXT) {
      msg = {
        _id: value.id,
        text: value.text,
        createdAt: value.timestamp,
        user: {
          _id: userInfo.id,
          name: userInfo.nickname ? userInfo.nickname : userInfo.phone,
          avatar: userInfo.avatar,
        }
      }
    } else if (type == msgTypes.MSG_IMAGE) {
      msg = {
        _id: value.id,
        image: value.attributes.uri,
        createdAt: value.timestamp,
        user: {
          _id: userInfo.id,
          name: userInfo.nickname ? userInfo.nickname : userInfo.phone,
          avatar: userInfo.avatar,
        }
      }
    }

    messages.push(msg)
  })
  newProps.messages = messages
  return newProps
}
const mapDispatchToProps = (dispatch) => bindActionCreators({
  initMessageClient,
  createConversation,
  leaveConversation,
  enterConversation,
  sendMessage,
  getUserInfoById
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Chatroom)

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  conversationView: {
    flex: 1,
    ...Platform.select({
      ios: {
        marginTop: 65,
      },
      android: {
        marginTop: 45
      }
    }),
  },
})