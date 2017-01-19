/**
 * Created by wuxingyu on 2016/12/24.
 */

import * as TopicTypes from '../constants/topicActionTypes'
import {REHYDRATE} from 'redux-persist/constants'
import {Topic,TopicsItem} from '../models/TopicModel'
import {Map, List} from 'immutable'

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
    case TopicTypes.UPDATE_TOPIC_LIKE_USERS:
      return handleUpdateTopicLikeUsers(state, action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function handleUpdateTopics(state, action) {
  let payload = action.payload
  switch (payload.type) {
    case "topics":
      let _map = state.get('topics')
      _map = _map.set(payload.categoryId, payload.topics)
      state = state.set('topics', _map)
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
  let _map = state.get('topicComments')
  _map = _map.set(payload.topicId, payload.topicComments)
  state = state.set('topicComments', _map)
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

function handleUpdateTopicLikeUsers(state, action) {
  let payload = action.payload
  let topicId = payload.topicId
  let topicLikeUsers = payload.topicLikeUsers
  let _map = state.get('TopicLikeUsers')
  _map = _map.set(topicId, topicLikeUsers)
  state = state.set('TopicLikeUsers',  _map)
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


function onRehydrate(state, action) {
  var incoming = action.payload.TOPIC
  if (incoming) {
    const topicMap = Map(incoming.topics)
    topicMap.map((value, key)=> {
      if (value && key) {
        let topics = []
        for (let topic of value) {
          if (topic) {
            const topicItem = new TopicsItem({...topic})
            topics.push(topicItem)
          }
        }
        state = state.setIn(['topics', key], List(topics))
      }
    })
    state = state.set('myTopics', List(incoming.myTopics))
    state = state.set('allTopics', List(incoming.allTopics))
    state = state.set('topicComments', Map(incoming.topicComments))

    const topicLikeUsersMap = Map(incoming.TopicLikeUsers)
    topicLikeUsersMap.map((value, key)=> {
      if (value && key) {
        state = state.setIn(['TopicLikeUsers', key], List(value))
      }
    })
    state = state.set('TopicLikesNum', Map(incoming.TopicLikesNum))
    state = state.set('IsLikedByCurrentUser', Map(incoming.IsLikedByCurrentUser))
  }
  return state
}