/**
 * Created by wuxingyu on 2016/12/24.
 */

import * as TopicTypes from '../constants/topicActionTypes'
import {REHYDRATE} from 'redux-persist/constants'
import {Topic} from '../models/TopicModel'

const initialState = Topic()

export default function topicReducer(state = initialState, action) {
  switch (action.type) {
    case TopicTypes.UPDATE_TOPICS:
      return handleUpdateTopics(state, action)
    case TopicTypes.UPDATE_TOPIC_COMMENTS:
      return handleUpdateTopicComments(state, action)
    case TopicTypes.FETCH_TOPIC_LIKES_TOTAL_COUNT_SUCCESS:
      return handleUpdateTopicLikesTotalCount(state, action)
    case TopicTypes.FETCH_TOPIC_IS_LIKED_SUCCESS:
      return handleUpdateTopicIsLiked(state, action)
    default:
      return state
  }
}

function handleUpdateTopics(state, action) {
  let payload = action.payload
  switch (payload.type) {
    case "topics":
      state = state.set('topics', payload.topics)
      break
    case "myTopics":
      state = state.set('myTopics', payload.topics)
      break
    case "allTopics":
      state = state.set('allTopics', payload.topics)
      break
  }
  return state
}

function handleUpdateTopicComments(state, action) {
  let payload = action.payload
  state = state.set('topicComments', payload.topicComments)
  return state
}

function handleUpdateTopicLikesTotalCount(state, action) {
  let payload = action.payload
  let topicId = payload.topicId
  let topicLikesTotalCount = payload.likesTotalCount
  let _map = state.get('TopicLikesNum')
  _map = _map.set(topicId, topicLikesTotalCount)
  state = state.set('TopicLikesNum',  _map)
  return state
}

function handleUpdateTopicIsLiked(state, action) {
  let payload = action.payload
  let topicId = payload.topicId
  let userLikeInfo = payload.userLikeInfo
  let _map = state.get('IsLikedByCurrentUser')
  if(userLikeInfo && userLikeInfo.status)
  {
    _map = _map.set(topicId, true)
  }else{
    _map = _map.set(topicId, false)
  }
  state = state.set('IsLikedByCurrentUser',  _map)
  return state
}