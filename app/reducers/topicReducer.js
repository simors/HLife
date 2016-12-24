/**
 * Created by wuxingyu on 2016/12/24.
 */

import * as AuthTypes from '../constants/topicActionTypes'
import {REHYDRATE} from 'redux-persist/constants'
import {Map} from 'immutable'
const initialState = new Map()

export default function topicReducer(state = initialState, action) {
  switch(action.type) {
    case AuthTypes.UPDATE_TOPICS:
      return handleUpdateTopics(state, action)
    default:
      return state
  }
}

function handleUpdateTopics(state, action) {
  let payload = action.payload
  state = state.set('topicArticles', payload.topicArticles)
  return state
}
