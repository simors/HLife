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
    let typedNotifyMsg = new TypedNotifyMsgRecord()
    typedNotifyMsg.type = msgType
    typedNotifyMsg.unReadCount = 1
    typedNotifyMsg.messageList.push(message.msgId)
    state = state.setIn(['notifyMsgByType', msgType], typedNotifyMsg)
  } else {
    msg.unReadCount += 1
    msg.messageList.push(message.msgId)
    state = state.setIn(['notifyMsgByType', msgType], msg)
  }

  return state
}