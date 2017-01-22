/**
 * Created by yangyang on 2017/1/5.
 */
import {Map, List} from 'immutable'
import * as msgActionTypes from '../constants/messageActionTypes'
import {
  NotifyMessage,
  TypedNotifyMsgRecord,
  TopicCommentMsg,
  ShopCommentMsg,
  TopicLikeMsg,
  ShopLikeMsg,
  UserFollowMsg,
  ShopFollowMsg,
} from '../models/notifyModel'
import {REHYDRATE} from 'redux-persist/constants'

const initialState = new NotifyMessage()

export default function notifyReducer(state = initialState, action) {
  switch (action.type) {
    case msgActionTypes.ADD_NOTIFY_MSG:
      return handleAddNotifyMsg(state, action)
    case msgActionTypes.ON_ENTER_TYPED_NOTIFY:
      return handleEnterTypedNotify(state, action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function handleAddNotifyMsg(state, action) {
  let message = action.payload.message
  let msgType = message.msgType
  let unReadCnt = state.get('unReadCount')

  state = state.setIn(['messageMap', message.msgId], message)
  state = state.set('unReadCount', unReadCnt+1)
  state = state.set('lastNoticeAt', message.timestamp)

  let type = msgActionTypes.SYSTEM_TYPE
  switch (msgType) {
    case msgActionTypes.MSG_TOPIC_COMMENT:
    case msgActionTypes.MSG_TOPIC_LIKE:
      type = msgActionTypes.TOPIC_TYPE
      break
    case msgActionTypes.MSG_SHOP_COMMENT:
    case msgActionTypes.MSG_SHOP_FOLLOW:
    case msgActionTypes.MSG_SHOP_LIKE:
      type = msgActionTypes.SHOP_TYPE
      break
    default:
      type = msgActionTypes.SYSTEM_TYPE
  }

  let msg = state.getIn(['notifyMsgByType', type])
  if (!msg) {
    let msgLst = new List([message.msgId])
    let typedNotifyMsg = new TypedNotifyMsgRecord({
      type: type,
      unReadCount: 1,
      messageList: msgLst,
    })
    state = state.setIn(['notifyMsgByType', type], typedNotifyMsg)
  } else {
    unReadCnt = msg.get('unReadCount')
    msg = msg.set('unReadCount', unReadCnt+1)
    let msgList = msg.get('messageList')
    msgList = msgList.unshift(message.msgId)
    msg = msg.set('messageList', msgList)
    state = state.setIn(['notifyMsgByType', type], msg)
  }

  return state
}

function handleEnterTypedNotify(state, action) {
  let type = action.payload.type
  let unReadCnt = state.getIn(['notifyMsgByType', type, 'unReadCount'])
  state = state.setIn(['notifyMsgByType', type, 'unReadCount'], 0)
  let unReadAmount = state.get('unReadCount')
  state = state.set('unReadCount', unReadAmount-unReadCnt)
  return state
}

function onRehydrate(state, action) {
  var incoming = action.payload.NOTICE
  if (incoming) {
    if (incoming.unReadCount) {
      state = state.set('unReadCount', incoming.unReadCount)
    } else {
      state = state.set('unReadCount', 0)
    }
    state = state.set('lastNoticeAt', incoming.lastNoticeAt)

    let messageMap = Map(incoming.messageMap)
    messageMap.map((msg) => {
      switch (msg.msgType) {
        case msgActionTypes.MSG_SHOP_COMMENT:
          state = state.updateIn(['messageMap', msg.msgId], new ShopCommentMsg(), val => val.merge(msg))
          break
        case msgActionTypes.MSG_SHOP_LIKE:
          state = state.updateIn(['messageMap', msg.msgId], new ShopLikeMsg(), val => val.merge(msg))
          break
        case msgActionTypes.MSG_SHOP_FOLLOW:
          state = state.updateIn(['messageMap', msg.msgId], new ShopFollowMsg(), val => val.merge(msg))
          break
        case msgActionTypes.MSG_TOPIC_COMMENT:
          state = state.updateIn(['messageMap', msg.msgId], new TopicCommentMsg(), val => val.merge(msg))
          break
        case msgActionTypes.MSG_TOPIC_LIKE:
          state = state.updateIn(['messageMap', msg.msgId], new TopicLikeMsg(), val => val.merge(msg))
          break
        case msgActionTypes.MSG_USER_FOLLOW:
          state = state.updateIn(['messageMap', msg.msgId], new UserFollowMsg(), val => val.merge(msg))
          break
      }
    })

    let notifyMsgByType = Map(incoming.notifyMsgByType)
    notifyMsgByType.map((msg) => {
      state = state.updateIn(['notifyMsgByType', msg.type], new TypedNotifyMsgRecord(), val => val.merge(msg))
    })
  }
  return state
}