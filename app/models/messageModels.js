/**
 * Created by yangyang on 2016/12/20.
 */
import {Map, List, Record} from 'immutable'

export const MessengerRecord = Record({
  client: undefined,
  conversationMap: Map(),
  unReadMsgCnt: 0,
}, 'MessengerRecord')

export const MessageRecord = Record({
  id: undefined,
  from: undefined,
  status: undefined,
  type: undefined,
  text: undefined,
  contentURI: undefined,
  conversation: undefined,
  timestamp: undefined,
  attributes: Map(),
}, 'MessageRecord')

export const ConversationRecord = Record({
  id: undefined,
  members: List(),
  name: undefined,
  unreadCount: 0,
  lastMessageAt: undefined,
  updatedAt: undefined,
  createdAt: undefined,
  messages: List(),
}, 'ConversationRecord')

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
      record.set('lastMessageAt', lcConv.lastMessageAt)
      record.set('createdAt', lcConv.createdAt)
      record.set('updatedAt', lcConv.updatedAt)
      record.set('unreadCount', lcConv.unreadMessagesCount)
    })
  }
}

export class Messenger extends MessengerRecord {

}
