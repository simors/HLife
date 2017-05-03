/**
 * Created by wuxingyu on 2016/12/24.
 */

import * as TopicTypes from '../constants/topicActionTypes'
import {REHYDRATE} from 'redux-persist/constants'
import {Topic, TopicsItem, TopicCommentsItem} from '../models/TopicModel'
import Immutable, {Map, List} from 'immutable'

const initialState = Topic()

export default function topicReducer(state = initialState, action) {
  switch (action.type) {
    case TopicTypes.UPDATE_TOPICS:
      return handleUpdateTopics(state, action)
    case TopicTypes.UPDATE_TOPIC_COMMENTS:
      return handleUpdateTopicComments(state, action)
    case TopicTypes.FETCH_TOPIC_COMMENTS_SUCCESS:
      return handleFetchTopicCommentsSuccess(state, action)
    case TopicTypes.FETCH_TOPIC_COMMENTS_SUCCESS_PAGING:
      return handleFetchTopicCommentsSuccessPaging(state, action)  
    case TopicTypes.FETCH_TOPIC_LIKES_TOTAL_COUNT_SUCCESS:
      return handleUpdateTopicLikesTotalCount(state, action)
    case TopicTypes.FETCH_TOPIC_IS_LIKED_SUCCESS:
      return handleUpdateTopicIsLiked(state, action)
    case TopicTypes.PUBLISH_COMMENT_SUCCESS:
      return handleAddTopicComment(state, action)
    case TopicTypes.UPDATE_TOPIC_LIKE_USERS:
      return handleUpdateTopicLikeUsers(state, action)
    case TopicTypes.FETCH_TOPIC_LIKE_USERS_SUCCESS:
      return handleFetchTopicLikeUsersSuccess(state, action)  
    case TopicTypes.FETCH_TOPIC_LIKE_USERS_SUCCESS_PAGING:
      return handleFetchTopicLikeUsersSuccessPaging(state, action)    
    case TopicTypes.ADD_TOPIC:
      return handleAddTopic(state, action)
    case TopicTypes.UPDATE_TOPIC:
      return handleUpdateTopic(state, action)
    case TopicTypes.UPDATE_MAINPAGE_TOPICS:
      return handleUpdateMainPageTopics(state, action)
    case TopicTypes.FETCH_USER_TOPICS_TOTAL_COUNT_SUCCESS:
      return handleFetchUserTopicsTotalCountSuccess(state, action)
    // case TopicTypes.DISABLE_TOPIC:
    //   return handleDisableTopic(state,action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function handleFetchTopicLikeUsersSuccess(state, action) {
  let payload = action.payload
  let topicId = payload.topicId
  let topicLikeUsers = payload.topicLikeUsers
  state = state.setIn(['TopicLikeUsers', topicId], topicLikeUsers)
  return state
}

function handleFetchTopicLikeUsersSuccessPaging(state, action) {
  let payload = action.payload
  let topicId = payload.topicId
  let topicLikeUsers = payload.topicLikeUsers
  let oldTopicLikeUsers = state.getIn(['TopicLikeUsers', topicId])
  let newTopicLikeUsers = newTopicLikeUsers || new List([])
  if(oldTopicLikeUsers && oldTopicLikeUsers.size) {
    newTopicLikeUsers = oldTopicLikeUsers.concat(topicLikeUsers)
  }
  state = state.setIn(['TopicLikeUsers', topicId], newTopicLikeUsers)
  return state
}

function handleFetchTopicCommentsSuccess(state, action) {
  let payload = action.payload
  let topicId = payload.topicId
  let topicComments = payload.topicComments
  state = state.setIn(['topicComments', topicId], topicComments)
  return state
}

function handleFetchTopicCommentsSuccessPaging(state, action) {
  let payload = action.payload
  let topicId = payload.topicId
  let topicComments = payload.topicComments
  let oldTopicComments = state.getIn(['topicComments', topicId])
  let newTopicComments = new List([])
  if(oldTopicComments && oldTopicComments.size) {
    newTopicComments = oldTopicComments.concat(topicComments)
  }else{
    newTopicComments = oldTopicComments
  }
  state = state.setIn(['topicComments', topicId], newTopicComments)
  return state
}

function handleFetchUserTopicsTotalCountSuccess(state, action) {
  let userId = action.payload.userId
  let userTopicsTotalCount = action.payload.userTopicsTotalCount
  state = state.setIn(['userTopicsTotalCount', userId], userTopicsTotalCount)
  return state
}

function handleAddTopicComment(state, action) {
  let topicComment = action.payload.topicComment
  let topicCommentList = state.getIn(['topicComments', action.payload.topicId])
  if (!topicCommentList) {
    topicCommentList = new List()
  }
  topicCommentList = topicCommentList.insert(0, topicComment)
  state = state.setIn(['topicComments', action.payload.topicId], topicCommentList)
  return state
}

function handleAddTopic(state, action) {
  let topic = action.payload.topic
  let topicList = state.getIn(['topics', topic.categoryId])
  if (!topicList) {
    topicList = new List()
  }

  topicList = topicList.insert(0, new TopicsItem(topic))
  state = state.setIn(['topics', topic.categoryId], topicList)

  let localTopicList = state.get('localTopics')
  if (!localTopicList) {
    localTopicList = new List()
  }
  localTopicList = localTopicList.insert(0, new TopicsItem(topic))
  state = state.set('localTopics', localTopicList)
  return state
}

function handleUpdateTopic(state, action) {
  let topic = action.payload.topic

  let _list = undefined
  _list = state.get('myTopics')
  if (_list) {
    index= _list.findIndex((record) => {
      return topic.get('objectId') == record.objectId
    })
    if (index != -1) {
      topic.map((value, key) => {
        if(value)
          _list = _list.setIn([index, key], value)
      })
    }
  }
  state = state.set('myTopics', _list)

  return state
}

function handleUpdatePagingShopCommentList(state, action) {
  let payload = action.payload
  let shopId = payload.shopId
  let shopComments = payload.shopComments
  let _map = state.get('shopComments')
  let _list = _map.get(shopId) || new List()
  let newShopComments = _list.concat(shopComments)
  let _newMap = _map.set(shopId, newShopComments)
  state = state.set('shopComments', _newMap)
  return state
}
function handleUpdateTopics(state, action) {
  let payload = action.payload
  let _list = undefined
  let _map = undefined
  let _newMap = undefined
  let newTopics = undefined
  let _newList = undefined

  if (payload.isPaging) {
    switch (payload.type) {
      case "topics":
        _map = state.get('topics')
        _list = _map.get(payload.categoryId) || new List()
        newTopics = _list.concat(payload.topics)
        _newMap = _map.set(payload.categoryId, newTopics)
        state = state.set('topics', _newMap)
        break
      case "userTopics":
        _map = state.get('userTopics')
        _list = _map.get(payload.userId) || new List()
        newTopics = _list.concat(payload.topics)
        _newMap = _map.set(payload.userId, newTopics)
        state = state.set('userTopics', _newMap)
        break
      case "myTopics":
        _list = state.get('myTopics') || new List()
        _newList = _list.concat(payload.topics)
        state = state.set('myTopics', _newList)
        break
      case "pickedTopics":
        _list = state.get('pickedTopics') || new List()
        _newList = _list.concat(payload.topics)
        state = state.set('pickedTopics', _newList)
        break
      case "allTopics":
        _list = state.get('allTopics') || new List()
        _newList = _list.concat(payload.topics)
        state = state.set('allTopics', _newList)
        break
      case "localTopics":
        _list = state.get('localTopics') || new List()
        _newList = _list.concat(payload.topics)
        state = state.set('localTopics', _newList)
        break
    }
  }
  else {
    switch (payload.type) {
      case "topics":
        _map = state.get('topics')
        _map = _map.set(payload.categoryId, payload.topics)
        state = state.set('topics', _map)
        break
      case "userTopics":
        _map = state.get('userTopics')
        _map = _map.set(payload.userId, payload.topics)
        state = state.set('userTopics', _map)
        break
      case "pickedTopics":
        state = state.set('pickedTopics', payload.topics)
        break
      case "myTopics":
        state = state.set('myTopics', payload.topics)
        break
      case "allTopics":
        state = state.set('allTopics', payload.topics)
        break
      case "localTopics":
        state = state.set('localTopics', payload.topics)
        break
    }
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
  state = state.set('TopicLikesNum', _map)
  return state
}

function handleUpdateTopicLikeUsers(state, action) {
  let payload = action.payload
  let topicId = payload.topicId
  let topicLikeUsers = payload.topicLikeUsers
  let _map = state.get('TopicLikeUsers')
  _map = _map.set(topicId, topicLikeUsers)
  state = state.set('TopicLikeUsers', _map)
  return state
}

function handleUpdateTopicIsLiked(state, action) {
  let payload = action.payload
  let topicId = payload.topicId
  let userLikeInfo = payload.userLikeInfo
  let _map = state.get('IsLikedByCurrentUser')
  if (userLikeInfo && userLikeInfo.status) {
    _map = _map.set(topicId, true)
  } else {
    _map = _map.set(topicId, false)
  }
  state = state.set('IsLikedByCurrentUser', _map)
  if(userLikeInfo) {
    state = state.setIn(['currentUserLikedTopics', topicId], userLikeInfo)
  }
  return state
}

function handleUpdateMainPageTopics(state, action) {
  let topics = action.payload.topics
  state = state.set('mainPageTopics', topics)
  return state
}
function handleDisableTopic(state,action){
  // state = state.set('myTopics', new List())
  console.log('oayload',action.payload)
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

    const topicCommentsMap = Map(incoming.topicComments)
    topicCommentsMap.map((value, key)=> {
      if (value && key) {
        let topicComments = []
        for (let topicComment of value) {
          if (topicComments) {
            const topicCommentItem = new TopicCommentsItem({...topicComment})
            topicComments.push(topicCommentItem)
          }
        }
        state = state.setIn(['topicComments', key], List(topicComments))
      }
    })

    const topicLikeUsersMap = Map(incoming.TopicLikeUsers)
    topicLikeUsersMap.map((value, key)=> {
      if (value && key) {
        state = state.setIn(['TopicLikeUsers', key], List(value))
      }
    })

    state = state.set('myTopics', List(incoming.myTopics))
    state = state.set('pickedTopics', List(incoming.myTopics))
    state = state.set('allTopics', List(incoming.allTopics))
    state = state.set('localTopics', List(incoming.localTopics))
    state = state.set('TopicLikesNum', Map(incoming.TopicLikesNum))
    state = state.set('IsLikedByCurrentUser', Map(incoming.IsLikedByCurrentUser))
  }
  return state
}

