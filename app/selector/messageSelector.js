/**
 * Created by yangyang on 2016/12/21.
 */
import * as msgTypes from '../constants/messageActionTypes'
import {getConversationTime} from '../util/numberUtils'

export function messengerClient(state) {
  const client = state.MESSAGE.get('client')
  return client
}

export function getConversations(state) {
  let convs = state.MESSAGE.get('conversationMap')
  let retConvs = []
  convs.forEach((conv) => {
    retConvs.push(conv.toJS())
  })
  return retConvs
}

export function getConversationById(state, id) {
  return state.MESSAGE.getIn(['conversationMap', id])
}

export function activeConversation(state) {
  return state.MESSAGE.get('activeConversation')
}

export function getMessageById(state, mid) {
  return state.MESSAGE.getIn(['messages', mid])
}

export function getMessages(state, cid) {
  let retMsg = []
  let conversation = getConversationById(state, cid)
  if (!conversation) {
    return retMsg
  }
  let messages = conversation.get('messages')
  if (messages) {
    messages.forEach((msgId) => {
      let mess = getMessageById(state, msgId)
      if (mess) {
        retMsg.push(mess.toJS())
      }
    })
  }
  return retMsg
}

export function hasNewMessage(state) {
  const unReadCnt = state.MESSAGE.get('unReadMsgCnt')
  return unReadCnt > 0 ? true : false
}

export function hasNewMessageByType(state, type) {
  let orderedConvs = state.MESSAGE.get('OrderedConversation')
  if (!orderedConvs) {
    return false
  }
  let conv = orderedConvs.find((convId) => {
    let conversation = getConversationById(state, convId)
    if (conversation.get('unreadCount') && conversation.get('type') === type) {
      let unreadCount = conversation.get('unreadCount')
      return unreadCount > 0 ? true : false
    }
    return false
  })
  return conv ? true : false
}

export function getNewestMessageTips(state, type) {
  let orderedConvs = state.MESSAGE.get('OrderedConversation')
  if (!orderedConvs) {
    return false
  }
  let retConvId = orderedConvs.find((convId) => {
    let conv = getConversationById(state, convId)
    if (conv.get('type') === type) {
      return true
    }
    return false
  })

  let conversation = getConversationById(state, retConvId).toJS()
  let msgTime = new Date(conversation.lastMessageAt)
  let lastMessage = "还没有收到过消息哦，看来要多与人交流才是呢^_^"
  let lastMessageAt = getConversationTime(msgTime.getTime())
  let lastMessageId = conversation.messages[0]
  let messageRecord = getMessageById(state, lastMessageId)
  if (messageRecord) {
    let message = messageRecord.toJS()
    if (message.type == msgTypes.MSG_TEXT) {
      lastMessage = message.text
    }
  }
  return {lastMessageAt, lastMessage}
}