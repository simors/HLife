/**
 * Created by lilu on 2017/7/4.
 */
import * as TopicTypes from '../constants/newTopicActionTypes'
import {REHYDRATE} from 'redux-persist/constants'
import {NewTopics,TopicCommentsItem} from '../models/NewTopicModel'
import Immutable, {Map, List,Record,Set} from 'immutable'

const initialState = NewTopics()

export default function topicReducer(state = initialState, action) {
  switch (action.type) {
    case TopicTypes.FETCH_COMMENT_ADD_COMMENTS:
      return handleAddCommentsForComment(state,action)
    case TopicTypes.FETCH_COMMENT_SET_COMMENTS:
      return handleSetCommentsForComment(state,action)
    case TopicTypes.FETCH_TOPIC_ADD_COMMENTS:
      return handleAddCommentsForTopic(state,action)
    case TopicTypes.FETCH_TOPIC_SET_COMMENTS:
      return handleSetCommentsForTopic(state,action)
    case TopicTypes.FETCH_ALL_COMMENTS:
      return handleFetchAllComments(state,action)
    case TopicTypes.FETCH_MY_COMMENTS_UPS:
      return handleFetchMyCommentsUps(state,action)
    case TopicTypes.FETCH_MY_TOPICS_UPS:
      return handleFetchMyTopicsUps(state,action)
    case TopicTypes.UP_COMMENT_SUCCESS:
      return handleFetchUpCommentSuccess(state,action)
    case TopicTypes.P_TOPIC_SUCCESS:
      return handleFetchUpTopicSuccess(state,action)
    // case TopicTypes.DISABLE_TOPIC:
    //   return handleDisableTopic(state,action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function handleFetchAllComments(state,action){
  let payload = action.payload
  let comments = payload.comments
  let _map = state.get('allComments')
  comments.forEach((item)=>{
    state = state.setIn(['allComments', item.commentId], item)
  })
  return state
}

function handleAddCommentsForComment(state,action){
  let payload = action.payload
  let comments = payload.comments
  let team = state.getIn(['commentsForComment', payload.commentId])
  state = state.setIn(['commentsForComment', payload.commentId], team.concat(new Set(comments)))
  return state

}

function handleSetCommentsForComment(state,action){
  let payload = action.payload
  let comments = payload.comments
  state = state.setIn(['commentsForComment',payload.commentId], new Set(comments))
  return state
}

function handleAddCommentsForTopic(state,action){
  let payload = action.payload
  let comments = payload.comments
  let team = state.getIn(['commentsForTopic', payload.topicId])
  state = state.setIn(['commentsForTopic', payload.topicId], team.concat(new Set(comments)))
  return state
}

function handleSetCommentsForTopic(state,action){
  let payload = action.payload
  let comments = payload.comments
  state = state.setIn(['commentsForTopic',payload.topicId], new Set(comments))
  return state
}

function handleFetchMyCommentsUps(state,action) {
  let payload =action.payload
  console.log('action.payload',payload)
  let commentsUps = []
  payload.commentsUps.forEach((item)=>{
    commentsUps.push(item)
  })
  state = state.set('myCommentsUps',List(commentsUps))
  return state
}

function handleFetchMyTopicsUps(state,action) {
  let payload =action.payload
  let topicsUps = []
  payload.topicsUps.forEach((item)=>{
    topicsUps.push(item)
  })
  state = state.set('myTopicsUps',  List(topicsUps))
  return state
}

function handleFetchUpCommentSuccess(state,action){
  let payload = action.payload
  let targetId = payload.targetId
  let map = state.get('myCommentsUps').toJS()||[]
  map.push(targetId)
  state = state.set('myCommentsUps',new List(map))
  return state
}

function handleFetchUpTopicSuccess(state,action){
  let payload = action.payload
  let targetId = payload.targetId
  let map = state.get('myTopicsUps').toJS()||[]
  map.push(targetId)
  state = state.set('myTopicsUps',new List(map))
  return state
}

function onRehydrate(state, action) {
  var incoming = action.payload.NEWTOPIC
  if (incoming) {
    const allCommentMap = Map(incoming.allComments)
    allCommentMap.map((value, key)=> {
      if (value && key) {
        state = state.setIn(['allComments', key], Record(value))
      }
    })

    const topicCommentsMap = Map(incoming.commentsForTopic)
    topicCommentsMap.map((value, key)=> {
      if (value && key) {
        state = state.setIn(['commentsForTopic', key], Set(value))
      }
    })

    const commentCommentsMap = Map(incoming.commentsForComment)
    commentCommentsMap.map((value, key)=> {
      if (value && key) {
        state = state.setIn(['commentsForComment', key], Set(value))
      }
    })
  }
  return state
}


