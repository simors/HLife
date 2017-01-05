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
  state = state.setIn(['messageMap', message.msgId], message)
  let typedNotifyMsg = new TypedNotifyMsgRecord()
  typedNotifyMsg.type = msgType
  typedNotifyMsg.unReadCount = 1
  typedNotifyMsg.messageList.push(message.msgId)
  state = state.setIn(['notifyMsgByType', msgType], typedNotifyMsg)
  return state
}