/**
 * Created by yangyang on 2016/12/21.
 */
import * as msgTypes from '../constants/messageActionTypes'
import {getConversationTime} from '../util/numberUtils'
import {activeUserId} from './authSelector'

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

export function getOrderedConvsByType(state, type) {
  let retConvs = []
  let orderedConvs = state.MESSAGE.get('OrderedConversation')
  if (!orderedConvs) {
    return []
  }
  orderedConvs.forEach((convId) => {
    let conversation = getConversationById(state, convId)
    if (conversation.get('type') == type) {
      retConvs.push(conversation.toJS())
    }
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

export function hasNewMessageById(state, id) {
  let conversation = getConversationById(state, id)
  if (conversation.get('unreadCount')) {
    let unreadCount = conversation.get('unreadCount')
    return unreadCount > 0 ? true : false
  }
  return false
}

export function getNewestMessageByType(state, type) {
  let lastMessage = "还没有收到过消息哦，多多参与互动吧^_^"

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

  let conversationRecord = getConversationById(state, retConvId)
  if (!conversationRecord) {
    return {lastMessageAt: "", lastMessage}
  }
  let conversation = conversationRecord.toJS()
  let msgTime = new Date(conversation.lastMessageAt)
  let lastMessageAt = getConversationTime(msgTime.getTime())
  let lastMessageId = conversation.messages[0]
  let messageRecord = getMessageById(state, lastMessageId)
  if (messageRecord) {
    let message = messageRecord.toJS()
    if (message.type == msgTypes.MSG_TEXT) {
      lastMessage = message.text
    } else if (message.type == msgTypes.MSG_IMAGE) {
      if (message.from != activeUserId(state)) {
        lastMessage = '收到一张图片，请点击查看详情'
      } else {
        lastMessage = '发送一张图片给对方'
      }
    } else {
      lastMessage = '暂不支持预览此消息'
    }
  }
  return {lastMessageAt, lastMessage}
}

export function getNewestMessageById(state, id) {
  let lastMessage = "还没有收到过消息哦，赶快联系他／她吧^_^"

  let conversationRecord = getConversationById(state, id)
  if (!conversationRecord) {
    return {lastMessageAt: "", lastMessage}
  }
  let conversation = conversationRecord.toJS()
  let msgTime = new Date(conversation.lastMessageAt)
  let createTime = new Date(conversation.createdAt)
  let today = new Date()
  if ((today.getTime() - createTime.getTime()) > 1 * 3600 * 1000) {
    lastMessage = '请评价医生'
    return {lastMessageAt: "", lastMessage}
  }
  let lastMessageAt = getConversationTime(msgTime.getTime())
  let lastMessageId = conversation.messages[0]
  let messageRecord = getMessageById(state, lastMessageId)
  if (messageRecord) {
    let message = messageRecord.toJS()
    if (message.type == msgTypes.MSG_TEXT) {
      lastMessage = message.text
    } else if (message.type == msgTypes.MSG_IMAGE) {
      if (message.from != activeUserId(state)) {
        lastMessage = '收到一张图片，请点击查看详情'
      } else {
        lastMessage = '发送一张图片给对方'
      }
    } else {
      lastMessage = '暂不支持预览此消息'
    }
  }
  return {lastMessageAt, lastMessage}
}