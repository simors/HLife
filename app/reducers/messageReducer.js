/**
 * Created by yangyang on 2016/12/21.
 */
import {Map, List} from 'immutable'
import * as Types from '../constants/messageActionTypes'
import {Messenger, Conversation, Message} from '../models/messageModels'

const initialState = new Messenger()

export default function messageReducer(state = initialState, action) {
  switch (action.type) {
    case Types.INIT_MESSENGER_CLIENT:
      return state.set('client', action.payload.client)
    case Types.ON_CONVERSATION_CREATED:
      return onConversationCreated(state, action)
    default:
      return state
  }
}

function onConversationCreated(state, action) {
  let conversation = action.payload
  let cid = conversation.get('id')

  if (state.getIn(['conversationMap', cid]) == undefined) {
    state = state.updateIn(['conversationMap', cid], new Conversation(), val => val.merge(conversation))
  }
  return state
}