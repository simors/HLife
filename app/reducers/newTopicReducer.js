/**
 * Created by lilu on 2017/7/4.
 */
import * as TopicTypes from '../constants/newTopicActionTypes'
import {REHYDRATE} from 'redux-persist/constants'
import {NewTopics} from '../models/NewTopicModel'
import Immutable, {Map, List,Record} from 'immutable'

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
    let comment = Record(item)
    console.log('comment=====<',comment)
    state = state.setIn(['allComments', item.commentId], comment)
  })
  // state = state.setIn('allComments', _map)
  return state
}

function handleAddCommentsForComment(state,action){
  let payload = action.payload
  let comments = payload.comments
  let team = state.getIn(['commentsForComment', payload.commentId])
  state = state.setIn(['commentsForComment', payload.commentId], team.concat(new List(comments)))
  return state

}

function handleSetCommentsForComment(state,action){
  let payload = action.payload
  let comments = payload.comments
  state = state.setIn(['commentsForComment',payload.commentId], new List(comments))
  return state
}

function handleAddCommentsForTopic(state,action){
  let payload = action.payload
  let comments = payload.comments
  let team = state.getIn(['commentsForTopic', payload.topicId])
  state = state.setIn(['commentsForTopic', payload.topicId], team.concat(new List(comments)))
  return state
}

function handleSetCommentsForTopic(state,action){
  let payload = action.payload
  let comments = payload.comments
  state = state.setIn(['commentsForTopic',payload.topicId], new List(comments))
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
        state = state.setIn(['commentsForTopic', key], List(value))
      }
    })

    const commentCommentsMap = Map(incoming.commentsForComment)
    commentCommentsMap.map((value, key)=> {
      if (value && key) {
        state = state.setIn(['commentsForComment', key], List(value))
      }
    })
  }
  return state
}


