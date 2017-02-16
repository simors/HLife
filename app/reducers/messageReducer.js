/**
 * Created by yangyang on 2016/12/21.
 */
import {Map, List} from 'immutable'
import {REHYDRATE} from 'redux-persist/constants'
import * as Types from '../constants/messageActionTypes'
import {Messenger, Conversation, Message} from '../models/messageModels'

const initialState = new Messenger()

export default function messageReducer(state = initialState, action) {
  switch (action.type) {
    case Types.INIT_MESSENGER_CLIENT:
      return onInitMessenger(state, action)
    case Types.INIT_CONVERSATION:
      return onInitConversation(state, action)
    case Types.ON_CONVERSATION_CREATED:
      return onConversationCreated(state, action)
    case Types.ON_ENTER_CONVERSATION:
      return onConversationEntered(state, action)
    case Types.ON_LEAVE_CONVERSATION:
      return onConversationLeft(state, action)
    case Types.ON_MESSAGE_CREATED:
      return onMessageCreated(state, action)
    case Types.ON_MESSAGE_SENTED:
      return onMessageSend(state, action)
    case Types.ON_MESSAGE_RECEIVED:
      return onMessageReceived(state, action)
    case Types.ON_INIT_MESSAGES:
      return onInitMessages(state, action)
    case Types.ON_UPDATE_CONVERSATION:
      return onUpdateConversation(state, action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function onInitMessenger(state, action) {
  let client = action.payload.client
  state = state.set('client', client)
  return state
}

function onInitConversation(state, action) {
  let convs = action.payload.conversations
  convs.map((conv) => {
    console.log('conv', conv)
    const convId = conv.id
    state = state.updateIn(
      ['conversationMap', convId],
      new Conversation(),
      val=>val.merge(conv)
    )
  })
  return sortConversationList(state)
}

function onInitMessages(state, action) {
  let conversationId = action.payload.conversationId
  let messages = action.payload.messages

  let msgLst = List()
  messages.forEach((msg) => {
    state = state.setIn(['messages', msg.id], msg)
    msgLst = msgLst.push(msg.id)
  })

  state = state.setIn(['conversationMap', conversationId, 'messages'], msgLst)
  return state
}

function onConversationCreated(state, action) {
  let conversation = action.payload
  let cid = conversation.id

  // Record active conversation
  // state = state.set('activeConversation', cid)

  if (state.getIn(['conversationMap', cid]) == undefined) {
    state = state.updateIn(['conversationMap', cid], new Conversation(), val => val.merge(conversation))
    return sortConversationList(state)
  }
  return state
}

function onConversationEntered(state, action) {
  let cid = action.payload.cid

  // Mark all read
  const curUnreadCount = state.getIn(['conversationMap', cid, 'unreadCount'])
  if (curUnreadCount > 0) {
    state = state.setIn(['conversationMap', cid, 'unreadCount'], 0)
    state = state.update('unReadMsgCnt', val => val - curUnreadCount)
  }

  // Record active conversation
  state = state.set('activeConversation', cid)
  return state
}

function onConversationLeft(state, action) {
  state = state.set('activeConversation', undefined)
  return state
}

function onUpdateConversation(state, action) {
  let conversation = action.payload
  let cid = conversation.id

  if (state.getIn(['conversationMap', cid]) == undefined) {
    return state
  }
  state =state.setIn(['conversationMap', cid, 'status'], conversation.status)

  return state
}

function onMessageCreated(state, action) {
  const msg = action.payload.message
  const createdMsgId = action.payload.createdMsgId
  const convId = msg.conversation
  state = deleteMessage(state, createdMsgId, convId)
  return createMessage(state, msg)
}

function onMessageSend(state, action) {
  const msg = action.payload.message
  const createdMsgId = action.payload.createdMsgId
  const convId = msg.conversation

  //replace stored message with new id
  state = deleteMessage(state, createdMsgId, convId)
  return createMessage(state, msg)
}

function onMessageReceived(state, action) {
  const msg = action.payload.message
  const conv = action.payload.conversation

  if (!state.hasIn(['conversationMap', conv.id])) {
    state = state.setIn(['conversationMap', conv.id], conv)
    state = state.setIn(['conversationMap', conv.id, 'unreadCount'], 0)
  }

  state = createMessage(state, msg)
  if (state.activeConversation != conv.id) {
    state = state.updateIn(['conversationMap', conv.id, 'unreadCount'], val=> {
      return val + 1
    })
    state = state.update('unReadMsgCnt', val=>val + 1)
  }

  return state
}

function createMessage(state, msg) {
  state = state.setIn(['messages', msg.id], msg)
  state = state.updateIn(['conversationMap', msg.conversation, 'messages'], msgList=> {
    if (msgList.includes(msg.id)) {
      return msgList
    }
    return msgList.insert(0, msg.id)   // 消息倒序排列，最新的消息在列表最前面
  })
  state = state.setIn(['conversationMap', msg.conversation, 'lastMessageAt'], msg.timestamp)
  state = state.setIn(['conversationMap', msg.conversation, 'updatedAt'], msg.timestamp)

  let sortedIdList = state.get('OrderedConversation')
  sortedIdList = sortedIdList.delete(sortedIdList.keyOf(msg.conversation))
  sortedIdList = sortedIdList.unshift(msg.conversation)
  state = state.set('OrderedConversation', sortedIdList)

  return state
}

function deleteMessage(state, msgId, cid) {
  state = state.deleteIn(['messages', msgId])
  state = state.updateIn(
    ['conversationMap', cid, 'messages'],
    list=>list.filter(msg => msg.id !== msgId)
  )
  return state
}

function sortConversationList(state) {
  const sortedConvList = state.get('conversationMap').toList().sort(
    (conv1, conv2) => {
      return conv1.updatedAt < conv2.updatedAt ? 1 : -1
    }
  )

  let sortedIdList = List()
  state = state.set('OrderedConversation',
    sortedIdList.withMutations((list) => {
      sortedConvList.map((conv) => {
        list.push(conv.id)
      })
    })
  )

  return state
}

function onRehydrate(state, action) {
  var incoming = action.payload.MESSAGE
  if (incoming) {
    if (incoming.unReadMsgCnt) {
      state = state.set('unReadMsgCnt', incoming.unReadMsgCnt)
    } else {
      state = state.set('unReadMsgCnt', 0)
    }

    let messages = Map(incoming.messages)
    messages.map((msg) => {
      state = state.updateIn(['messages', msg.id], new Message(), val => val.merge(msg))
    })

    let conversations = Map(incoming.conversationMap)
    conversations.map((conv) => {
      let convId = conv.id
      state = state.updateIn(['conversationMap', convId], new Conversation(), val => val.merge(conv))
    })
    state = sortConversationList(state)
  }
  return state
}