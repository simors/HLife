/**
 * Created by wanpeng on 2016/12/30.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  InteractionManager,
  Image,
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {em, normalizeH, normalizeW} from '../../../util/Responsive'
import Header from '../../common/Header'
import {GiftedChat} from '../../Chatroom/GifedChat/GiftedChat'
import {createConversation, leaveConversation, enterConversation, sendMessage} from '../../../action/messageAction'
import CustomInputToolbar from '../../Chatroom/CustomInputToolbar'
import CustomMessage from '../../Chatroom/CustomMessage'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {getUserInfoById} from '../../../action/authActions'
import {activeUserInfo, userInfoById} from '../../../selector/authSelector'
import {activeConversation, getMessages} from '../../../selector/messageSelector'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class QA extends Component {
  constructor(props) {
    super(props)
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
      })
    })
  }

  componentWillUnmount() {
    this.props.leaveConversation()
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

  onSend(messages = []) {
    let time = new Date()
    let msgId = this.props.name + '_' + time.getSeconds()

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
  render() {
    return(
      <View style={styles.container}>
        <Header
          headerContainerStyle={styles.header}
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress = {()=> {Actions.pop()}}
          title="提问详情"
          titleStyle={styles.titile}
        />
        <View style={{flexDirection: 'row', alignItems: 'center',marginTop: normalizeH(64), width: PAGE_WIDTH,height: normalizeH(44), backgroundColor: 'rgba(80,226,193,0.23)'}}>
          <Text style={{fontFamily: 'PingFangSC-Semibold', fontSize: em(17), color: '#FF9600', marginLeft: normalizeW(20)}}>儿科</Text>
          <Text style={{fontSize: em(12), marginLeft: normalizeW(10) }}>在线接诊中，预计将在30分钟内回复</Text>

        </View>
        <View style={{flex: 1, borderBottomWidth: 1, borderColor: 'red'}}>
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

QA.defaultProps = {
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
  createConversation,
  leaveConversation,
  enterConversation,
  sendMessage,
  getUserInfoById
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(QA)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  header: {
    backgroundColor: '#F9F9F9',
  },
  left: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 17,
    color: '#FFFFFF',
    letterSpacing: -0.41,
  },
  body: {
    flex: 1,
    width: PAGE_WIDTH,
    marginTop: normalizeH(64),
    backgroundColor: '#FFFFFF',
  },
})