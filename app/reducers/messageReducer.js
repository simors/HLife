/**
 * Created by yangyang on 2016/12/21.
 */
import {Map, List} from 'immutable'
import * as Types from '../constants/messageActionTypes'
import {Messenger, Conversation, Message} from '../models/messageModels'

const initialState = new Messenger()

export default function messageReducer(state = initialState, action) {
  switch (action.type) {
    case Types.INIT_MESSAGE_CLIENT:
      return state.set('client', action.payload.client)
    default:
      return state
  }
}