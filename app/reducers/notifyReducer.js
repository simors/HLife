/**
 * Created by yangyang on 2017/1/5.
 */
import {Map, List} from 'immutable'
import * as msgActionTypes from '../constants/messageActionTypes'
import {NotifyMessage} from '../models/notifyModel'

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

}