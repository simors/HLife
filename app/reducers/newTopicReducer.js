/**
 * Created by lilu on 2017/7/4.
 */
import * as TopicTypes from '../constants/newTopicActionTypes'
import {REHYDRATE} from 'redux-persist/constants'
import {NewTopics, TopicCommentsItem} from '../models/NewTopicModel'
import Immutable, {Map, List, Record, Set} from 'immutable'

const initialState = NewTopics()

export default function newTopicReducer(state = initialState, action) {
  switch (action.type) {
    case TopicTypes.FETCH_COMMENT_ADD_COMMENTS:
      return handleAddCommentsForComment(state, action)
    case TopicTypes.FETCH_COMMENT_SET_COMMENTS:
      return handleSetCommentsForComment(state, action)
    case TopicTypes.FETCH_TOPIC_ADD_COMMENTS:
      return handleAddCommentsForTopic(state, action)
    case TopicTypes.FETCH_TOPIC_SET_COMMENTS:
      return handleSetCommentsForTopic(state, action)
    case TopicTypes.FETCH_ALL_COMMENTS:
      return handleFetchAllComments(state, action)
    case TopicTypes.FETCH_MY_COMMENTS_UPS:
      return handleFetchMyCommentsUps(state, action)
    case TopicTypes.FETCH_MY_TOPICS_UPS:
      return handleFetchMyTopicsUps(state, action)
    case TopicTypes.UP_COMMENT_SUCCESS:
      return handleFetchUpCommentSuccess(state, action)
    case TopicTypes.UP_TOPIC_SUCCESS:
      return handleFetchUpTopicSuccess(state, action)
    case TopicTypes.PUBLISH_COMMENT_SUCCESS:
      return handlePublishCommentSuccess(state, action)
    // case TopicTypes.FETCH_ALL_TOPICS:
    //   return handleFetchAllTopics(state,action)
    case TopicTypes.FETCH_ADD_CATE_TOPICS:
      return handleAddCatTopis(state,action)
    case TopicTypes.FETCH_SET_CATE_TOPICS:
      return handleSetCatTopis(state,action)
    case TopicTypes.FETCH_ADD_LOCAL_TOPICS:
      return handleAddLocalTopis(state,action)
    case TopicTypes.FETCH_SET_LOCAL_TOPICS:
      return handleSetLocalTopis(state,action)
    case TopicTypes.FETCH_ADD_PICKED_TOPICS:
      return handleAddPickedTopis(state,action)
    case TopicTypes.FETCH_SET_PICKED_TOPICS:
      return handleSetPickedTopis(state,action)
    // case TopicTypes.DISABLE_TOPIC:
    //   return handleDisableTopic(state,action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}


function handleAddPickedTopis(state, action) {
  let payload = action.payload
  let topicList = payload.topicList
  let _topics = state.get('pickedTopics')|| new List()
  if(_topics&&_topics.size>0){
    state = state.set('pickedTopics', _topics.concat(topicList))
  }
  else{
    state = state.set('pickedTopics', topicList)
  }
  state = handleFetchAllTopics(state,payload.topics)
  return state
}

function handleSetPickedTopis(state, action) {
  let payload = action.payload
  let topicList = payload.topicList
  state = state.set('pickedTopics', topicList)
  state = handleFetchAllTopics(state,payload.topics)
  return state
}

function handleAddLocalTopis(state, action) {
  let payload = action.payload
  let topicList = new List(payload.topicList)
  let _topics = state.get('localTopics')|| new List()
  if(_topics&&_topics.size>0){
    state = state.set('localTopics', _topics.concat(topicList))
  }
  else{
    state = state.set('localTopics', topicList)
  }
  state = handleFetchAllTopics(state,payload.topics)
  return state
}

function handleSetLocalTopis(state, action) {
  let payload = action.payload
  let topicList = payload.topicList
  state = state.set('localTopics', topicList)
  state = handleFetchAllTopics(state,payload.topics)
  return state
}

function handleAddCatTopis(state, action) {
  let payload = action.payload
  let topicList = payload.topicList
  let categoryId = payload.categoryId
  let _topics = state.getIn(['cateTopics',categoryId])|| new List()
  if(_topics&&_topics.size>0){
    state = state.setIn(['cateTopics',categoryId], _topics.concat(topicList))
  }
  else{
    state = state.setIn(['cateTopics',categoryId], topicList)
  }
  state = handleFetchAllTopics(state,payload.topics)
  return state
}

function handleSetCatTopis(state, action) {
  let payload = action.payload
  let topicList = payload.topicList
  let categoryId = payload.categoryId
  state = state.setIn(['cateTopics',categoryId], topicList)
  state = handleFetchAllTopics(state,payload.topics)
  return state
}

function handleFetchAllTopics(state, topics) {
  // let payload = action.payload
  // let topics = payload.topics
  topics.forEach((item)=> {
    state = state.setIn(['allTopics', item.objectId], item)
  })
  return state
}

function handleFetchAllComments(state, action) {
  let payload = action.payload
  let comments = payload.comments
  comments.forEach((item)=> {
    state = state.setIn(['allComments', item.commentId], item)
  })
  return state
}

function handleAddCommentsForComment(state, action) {
  let payload = action.payload
  let comments = payload.comments
  let team = state.getIn(['commentsForComment', payload.commentId])|| new List()
  // if(team&&team.length>0)
  state = state.setIn(['commentsForComment', payload.commentId], team.concat(new List(comments)))
  return state
}

function handleSetCommentsForComment(state, action) {
  let payload = action.payload
  let comments = payload.comments
  state = state.setIn(['commentsForComment', payload.commentId], new List(comments))
  return state
}

function handleAddCommentsForTopic(state, action) {
  let payload = action.payload
  let comments = payload.comments
  let team = state.getIn(['commentsForTopic', payload.topicId])|| new List()
  state = state.setIn(['commentsForTopic', payload.topicId], team.concat(new List(comments)))
  return state
}

function handleSetCommentsForTopic(state, action) {
  let payload = action.payload
  let comments = payload.comments
  state = state.setIn(['commentsForTopic', payload.topicId], new List(comments))
  return state
}

function handleFetchMyCommentsUps(state, action) {
  let payload = action.payload
  let commentsUps = []
  payload.commentsUps.forEach((item)=> {
    commentsUps.push(item)
  })
  state = state.set('myCommentsUps', List(commentsUps))
  return state
}

function handleFetchMyTopicsUps(state, action) {
  let payload = action.payload
  let topicsUps = []
  payload.topicsUps.forEach((item)=> {
    topicsUps.push(item)
  })
  state = state.set('myTopicsUps', List(topicsUps))
  return state
}

function handleFetchUpCommentSuccess(state, action) {
  let payload = action.payload
  let targetId = payload.targetId
  let map = state.get('myCommentsUps').toJS() || []
  map.push(targetId)
  state = state.set('myCommentsUps', new List(map))
  return state
}

function handleFetchUpTopicSuccess(state, action) {
  let payload = action.payload
  let targetId = payload.targetId
  let map = state.get('myTopicsUps').toJS() || []
  map.push(targetId)
  state = state.set('myTopicsUps', new List(map))
  return state
}

function handlePublishCommentSuccess(state, action) {
  let payload = action.payload
  let comment = payload.comment
  let commentList = state.getIn(['commentsForTopic', comment.topicId])
  if (commentList && commentList.size) {
    commentList = commentList.insert(0, comment.commentId)
    state = state.setIn(['commentsForTopic', comment.topicId], commentList)
  } else {
    let topicCommentList = [comment.commentId]
    state = state.setIn(['commentsForTopic', comment.topicId], new List(topicCommentList))
  }

  if (comment.parentCommentId) {
    let ParentCommentList = state.getIn(['commentsForComment', comment.parentCommentId])
    if (ParentCommentList && ParentCommentList.size) {
      ParentCommentList = ParentCommentList.insert(0, comment.commentId)
      state = state.setIn(['commentsForComment', comment.parentCommentId], ParentCommentList)
    } else {
      let commentCommentList = [comment.commentId]
      state = state.setIn(['commentsForComment', comment.parentCommentId], new List(commentCommentList))
    }
  }

  state = state.setIn(['allComments', comment.commentId], comment)
  return state
}

function onRehydrate(state, action) {
  var incoming = action.payload.NEWTOPIC
  if (incoming) {
    const allCommentMap = Map(incoming.allComments)
    allCommentMap.map((value, key)=> {
      if (value && key) {
        let commentInfo = TopicCommentsItem.fromLeancloudObject(value)
        state = state.setIn(['allComments', key], commentInfo)
      }
    })

    const topicCommentsMap = Map(incoming.commentsForTopic)
    topicCommentsMap.map((value, key)=> {
      if (value && key) {
        state = state.setIn(['commentsForTopic', key], new List(value))
      }
    })

    const commentCommentsMap = Map(incoming.commentsForComment)
    commentCommentsMap.map((value, key)=> {
      if (value && key) {
        state = state.setIn(['commentsForComment', key], new List(value))
      }
    })

    const myCommentsUps = incoming.myCommentsUps
    let myCommentUpList = []
    myCommentsUps.forEach((item)=>{
      myCommentUpList.push(item)
    })
    if(myCommentUpList&&myCommentUpList.length){
      state = state.set('myCommentsUps', List(myCommentUpList))
    }

    const myTopicsUps = incoming.myTopicsUps
    let myTopicUpList = []
    myTopicsUps.forEach((item)=>{
      myTopicUpList.push(item)
    })
    if(myTopicUpList&&myTopicUpList.length){
      state = state.set('myTopicsUps', List(myTopicUpList))
    }

  }
  return state
}


