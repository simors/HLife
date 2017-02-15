/**
 * Created by yangyang on 2016/12/20.
 */
import {Map, List, Record} from 'immutable'
import * as msgTypes from '../constants/messageActionTypes'

export const MessengerRecord = Record({
  client: undefined,                        // 客户端id
  conversationMap: Map(),                   // 会话列表，会话id作为键值
  messages: Map(),                          // 所有的消息，健为消息id，值为Message类型
  unReadMsgCnt: 0,                          // 未读消息个数
  activeConversation: undefined,            // 当前处于聊天状态的会话
  OrderedConversation: List(),              // 将所有会话按更新时间排序
}, 'MessengerRecord')

export const ConversationRecord = Record({
  id: undefined,
  members: List(),            // 会话成员列表
  name: undefined,
  type: undefined,            // 会话的类型，可以是问诊（INQUIRY_CONVERSATION），或私信（PERSONAL_CONVERSATION）
  unreadCount: 0,
  lastMessageAt: undefined,   // 会话最后更新时间
  updatedAt: undefined,
  createdAt: undefined,
  messages: List(),           // 消息列表
  status: 1,          //会话状态 0--会话关闭 1--会话打开
}, 'ConversationRecord')

export const MessageRecord = Record({
  id: undefined,              // 消息编号
  from: undefined,            // 发送消息的用户id
  status: undefined,          // 记录消息状态，created/complete/fail
  type: undefined,            // 消息类型
  text: undefined,            // 消息内容
  contentURI: undefined,
  conversation: undefined,    // 对应的会话id
  timestamp: undefined,
  attributes: Map(),          // 消息属性，用于记录图片、语音等富媒体消息
}, 'MessageRecord')

export class Message extends MessageRecord {
  static fromLeancloudMessage(lcMsg, payload) {
    let msg = new Message()

    return msg.withMutations((record)=> {
      var messageType, text
      if (lcMsg.content) {
        messageType = lcMsg.content._lctype
        text = lcMsg.content._lctext
      } else {
        messageType = lcMsg.type
        text = lcMsg.text
      }
      record.set('id', lcMsg.id)
      record.set('from', lcMsg.from)
      record.set('type', messageType)
      record.set('text', text)
      record.set('conversation', lcMsg.cid)
      record.set('timestamp', lcMsg.timestamp)
      record.set('status', 'complete')

      let attrs = lcMsg.content? lcMsg.content._lcattrs: lcMsg.attributes
      for (let propKey in attrs) {
        record.setIn(['attributes', propKey], attrs[propKey])
      }
      if (messageType === msgTypes.MSG_IMAGE || messageType === msgTypes.MSG_AUDIO) {
        record.setIn(['attributes', 'uri'], attrs.mediaId)
        if (payload && payload.uri) {
          record.setIn(['attributes', 'localUri'], payload.uri)
        }
      }
    })
  }
}

export class Conversation extends ConversationRecord {
  static fromLeancloudConversation(lcConv) {
    const conv = new Conversation()
    return conv.withMutations((record)=> {
      record.set('id', lcConv.id)
      record.set('name', lcConv.name)
      record.set('members', List(lcConv.members))
      record.set('type', lcConv.get('type'))
      record.set('lastMessageAt', lcConv.lastMessageAt)
      record.set('createdAt', lcConv.createdAt)
      record.set('updatedAt', lcConv.updatedAt)
      record.set('unreadCount', lcConv.unreadMessagesCount)
      record.set('status', lcConv.get('status'))
    })
  }
}

export class Messenger extends MessengerRecord {

}
