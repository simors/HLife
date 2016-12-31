/**
 * Created by wuxingyu on 2016/12/24.
 */

import * as TopicTypes from '../constants/topicActionTypes'
import {REHYDRATE} from 'redux-persist/constants'
import {Map} from 'immutable'

const initialState = new Map()

export default function topicReducer(state = initialState, action) {
  switch (action.type) {
    case TopicTypes.UPDATE_TOPICS:
      return handleUpdateTopics(state, action)
    case TopicTypes.UPDATE_TOPIC_COMMENTS:
      return handleUpdateTopicComments(state, action)
    default:
      return state
  }
}

function handleUpdateTopics(state, action) {
  let payload = action.payload
  state = state.set('topics', payload.topics)
  return state
}

function handleUpdateTopicComments(state, action) {
  let payload = action.payload
  state = state.set('topicComments', payload.topicComments)
  return state
}
