/**
 * Created by yangyang on 2017/1/5.
 */
import {Map, List} from 'immutable'
import * as msgActionTypes from '../constants/messageActionTypes'
import {NotifyMessage, TypedNotifyMsgRecord} from '../models/notifyModel'

const initialState = new NotifyMessage()

export default function notifyReducer(state = initialState, action) {
  switch (action.type) {
    case msgActionTypes.ADD_NOTIFY_MSG:
      return handleAddNotifyMsg(state, action)
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

  let msg = state.getIn(['notifyMsgByType', msgType])
  if (!msg) {
    let msgLst = new List([message.msgId])
    let typedNotifyMsg = new TypedNotifyMsgRecord({
      type: msgType,
      unReadCount: 1,
      messageList: msgLst,
    })
    state = state.setIn(['notifyMsgByType', msgType], typedNotifyMsg)
  } else {
    unReadCnt = msg.get('unReadCount')
    msg = msg.set('unReadCount', unReadCnt+1)
    let msgList = msg.get('messageList')
    msgList = msgList.push(message.msgId)
    msg = msg.set('messageList', msgList)
    state = state.setIn(['notifyMsgByType', msgType], msg)
  }

  return state
}