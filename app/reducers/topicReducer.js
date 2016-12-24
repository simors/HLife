/**
 * Created by zachary on 2016/12/9.
 */

import * as AuthTypes from '../constants/topicActionTypes'
import {REHYDRATE} from 'redux-persist/constants'
import {Map, List} from 'immutable'
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
  let categoryId = payload.categoryId
  let topicsMap = new Map()
  topicsMap = topicsMap.set(categoryId, payload.topics)
  state = state.set('topics', topicsMap)
  return state
}
