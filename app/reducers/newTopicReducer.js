/**
 * Created by lilu on 2017/7/4.
 */
import * as TopicTypes from '../constants/newTopicActionTypes'
import {REHYDRATE} from 'redux-persist/constants'
import {NewTopics, TopicCommentsItem,TopicsItem} from '../models/NewTopicModel'
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
      return handleAddCatTopics(state,action)
    case TopicTypes.FETCH_SET_CATE_TOPICS:
      return handleSetCatTopics(state,action)
    case TopicTypes.FETCH_ADD_LOCAL_TOPICS:
      return handleAddLocalTopics(state,action)
    case TopicTypes.FETCH_SET_LOCAL_TOPICS:
      return handleSetLocalTopics(state,action)
    case TopicTypes.FETCH_ADD_PICKED_TOPICS:
      return handleAddPickedTopics(state,action)
    case TopicTypes.FETCH_SET_PICKED_TOPICS:
      return handleSetPickedTopics(state,action)
    case TopicTypes.FETCH_ADD_MAINPAGE_TOPICS:
      return handleAddMainPageTopics(state,action)
    case TopicTypes.FETCH_SET_MAINPAGE_TOPICS:
      return handleSetMainPageTopics(state,action)
    case TopicTypes.FETCH_ADD_USER_TOPICS:
      return handleAddUserTopics(state,action)
    case TopicTypes.FETCH_SET_USER_TOPICS:
      return handleSetUserTopics(state,action)
    case TopicTypes.FETCH_ADD_TOPIC_UPS:
      return handleFetchAddTopicUps(state,action)
    case TopicTypes.FETCH_SET_TOPIC_UPS:
      return handleFetchSetTopicUps(state,action)
    case TopicTypes.FETCH_PUBLISH_TOPIC_SUCCESS:
      return handlePublishTopicSuccess(state,action)
    case TopicTypes.FETCH_UPDATE_TOPIC_SUCCESS:
      return handleUpdateTopicSuccess(state,action)
    // case TopicTypes.DISABLE_TOPIC:
    //   return handleDisableTopic(state,action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}


function handleAddPickedTopics(state, action) {
  let payload = action.payload
  let topicList = payload.topicList
  let _topics = state.get('pickedTopics')|| new List()
  if(_topics&&_topics.size>0){
    state = state.set('pickedTopics', _topics.concat(new List(topicList)))
  }
  else{
    state = state.set('pickedTopics', topicList)
  }
  state = handleFetchAllTopics(state,payload.topics)
  return state
}

function handleSetPickedTopics(state, action) {
  let payload = action.payload
  let topicList = payload.topicList
  state = state.set('pickedTopics', new List(topicList))
  state = handleFetchAllTopics(state,payload.topics)
  return state
}

function handleAddLocalTopics(state, action) {
  let payload = action.payload
  let topicList = new List(payload.topicList)
  let _topics = state.get('localTopics')|| new List()
  if(_topics&&_topics.size>0){
    state = state.set('localTopics', _topics.concat(new List(topicList)))
  }
  else{
    state = state.set('localTopics', topicList)
  }
  state = handleFetchAllTopics(state,payload.topics)
  return state
}

function handleSetLocalTopics(state, action) {
  let payload = action.payload
  let topicList = payload.topicList
  state = state.set('localTopics', new List(topicList))
  state = handleFetchAllTopics(state,payload.topics)
  return state
}

function handleAddCatTopics(state, action) {
  let payload = action.payload
  let topicList = payload.topicList
  let categoryId = payload.categoryId
  let _topics = state.getIn(['cateTopics',categoryId])|| new List()
  if(_topics&&_topics.size>0){
    state = state.setIn(['cateTopics',categoryId], _topics.concat(new List(topicList)))
  }
  else{
    state = state.setIn(['cateTopics',categoryId], new List(topicList))
  }
  state = handleFetchAllTopics(state,payload.topics)
  return state
}

function handleSetCatTopics(state, action) {
  let payload = action.payload
  let topicList = payload.topicList
  let categoryId = payload.categoryId
  state = state.setIn(['cateTopics',categoryId], new List(topicList))
  state = handleFetchAllTopics(state,payload.topics)
  return state
}

function handleSetUserTopics(state, action) {

  let payload = action.payload
  // console.log('payload=====>',payload)
  let topicList = payload.topicList
  let userId = payload.userId
  state = state.setIn(['userTopics',userId], new List(topicList))
  state = handleFetchAllTopics(state,payload.topics)
  return state
}

function handleAddUserTopics(state, action) {

  let payload = action.payload
  // console.log('payload=====>',payload)

  let topicList = payload.topicList
  let userId = payload.userId
  let _topics = state.getIn(['userTopics',userId])|| new List()
  if(_topics&&_topics.size>0){
    state = state.setIn(['userTopics',userId], _topics.concat(new List(topicList)))
  }
  else{
    state = state.setIn(['userTopics',userId], new List(topicList))
  }
  state = handleFetchAllTopics(state,payload.topics)
  return state
}

function handleAddMainPageTopics(state, action) {
  let payload = action.payload
  let topicList = new List(payload.topicList)
  let _topics = state.get('mainPageTopics')|| new List()
  if(_topics&&_topics.size>0){
    state = state.set('mainPageTopics', _topics.concat(new List(topicList)))
  }
  else{
    state = state.set('mainPageTopics', new List(topicList))
  }
  state = handleFetchAllTopics(state,payload.topics)
  return state
}

function handleSetMainPageTopics(state, action) {
  let payload = action.payload
  let topicList = payload.topicList
  state = state.set('mainPageTopics', new List(topicList))
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
  let comment = state.getIn(['allComments',targetId]).toJS()||{}
  comment.upCount = comment.upCount+1
  let newComment = TopicCommentsItem.fromLeancloudApi(comment)
  state = state.setIn(['allComments',targetId],newComment)

  return state
}

function handleFetchUpTopicSuccess(state, action) {
  let payload = action.payload
  let upItem = payload.upItem
  let upList = [upItem.upId]

  let map = state.get('myTopicsUps').toJS() || []
  map.push(upItem.targetId)
  state = state.set('myTopicsUps', new List(map))
  state = state.setIn(['allUps',upItem.upId],upItem)
  let topicUps = state.get(['topicUps',upItem.targetId])
  console.log('upItem===<',upItem)
  if(topicUps&&topicUps.size){
    topicUps.insert(0,upItem.upId)

    state = state.setIn(['topicUps',upItem.targetId],topicUps)
  }else{
    console.log('else===<')
    state = state.setIn(['topicUps',upItem.targetId],new List(upList))
  }
  console.log('state===<')

  // let topic = state.getIn(['allTopics',targetId]).toJS()||{}
  // topic.likeCount = topic.likeCount+1
  //
  // state = state.setIn(['allTopics',targetId],topic)
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

function handleFetchSetTopicUps(state,action){
  let payload = action.payload
  let topicId = payload.topicId
  let ups = payload.upList
  let upList = []
  ups.forEach((item)=>{
    upList.push(item.upId)
  })

  state = state.setIn(['topicUps',topicId], new List(upList))
  state = handleFetchAllUps(state,ups)
  return state
}

function handleFetchAddTopicUps(state,action){
  let payload = action.payload
  let topicId = payload.topicId
  let ups = payload.upList
  let upList = []
  ups.forEach((item)=>{
    upList.push(item.upId)
  })
  let _ups = state.getIn(['topicUps',topicId])||new List()
  state = state.setIn(['topicUps',topicId], _ups.concat(new List(upList)))
  state = handleFetchAllUps(state,ups)
  return state
}

function handleFetchAllUps(state,ups) {

  ups.forEach((up)=>{
    state = state.setIn(['allUps',up.upId],up)
  })
  return state
}

function handlePublishTopicSuccess(state,action) {
  // console.log('action.payload==>',action.payload)

  let topic = action.payload.topic
  // console.log('topiccategroyId==>',topic.categoryId)
  state = state.setIn(['allTopics',topic.objectId],topic)
  let _topicList = state.getIn(['cateTopics',topic.categoryId])|| new List()
  if(_topicList&&_topicList.size){
    _topicList.insert(0,topic.objectId)
    // console.log('_topicList==>',_topicList)
    state = state.setIn(['cateTopics',topic.categoryId],_topicList)
  }else{
    let topics = [topic]
    state = state.setIn(['cateTopics',topic.categoryId],new List(topics))
  }
  return state
}

function handleUpdateTopicSuccess(state,action) {
  let topic = action.payload.topic
  state = state.setIn(['allTopics',topic.objectId],topic)
  return state
}


function onRehydrate(state, action) {
  var incoming = action.payload.NEWTOPIC
  if (incoming) {
    //恢复全部评论信息
    const allCommentMap = Map(incoming.allComments)
    allCommentMap.map((value, key)=> {
      if (value && key) {
        let commentInfo = TopicCommentsItem.fromLeancloudApi(value)
        state = state.setIn(['allComments', key], commentInfo)
      }
    })

    //恢复话题的评论
    const topicCommentsMap = Map(incoming.commentsForTopic)
    topicCommentsMap.map((value, key)=> {
      if (value && key) {
        state = state.setIn(['commentsForTopic', key], new List(value))
      }
    })

    //恢复评论的评论
    const commentCommentsMap = Map(incoming.commentsForComment)
    commentCommentsMap.map((value, key)=> {
      if (value && key) {
        state = state.setIn(['commentsForComment', key], new List(value))
      }
    })

    //恢复我点赞的评论
    const myCommentsUps = incoming.myCommentsUps
    let myCommentUpList = []
    myCommentsUps.forEach((item)=>{
      myCommentUpList.push(item)
    })
    if(myCommentUpList&&myCommentUpList.length){
      state = state.set('myCommentsUps', List(myCommentUpList))
    }

    //恢复我点赞的话题
    const myTopicsUps = incoming.myTopicsUps
    let myTopicUpList = []
    myTopicsUps.forEach((item)=>{
      myTopicUpList.push(item)
    })
    if(myTopicUpList&&myTopicUpList.length){
      state = state.set('myTopicsUps', List(myTopicUpList))
    }

    //恢复全部的话题
    const allTopicsMap = Map(incoming.allTopics)
    allTopicsMap.map((value, key)=> {
      if (value && key) {
        let topicInfo = TopicsItem.fromLeancloudApi(value)
        state = state.setIn(['allTopics', key], topicInfo)
      }
    })

    //恢复分类话题
    const cateTopics = Map(incoming.cateTopics)
    cateTopics.map((value, key)=> {
      if (value && key) {
        state = state.setIn(['cateTopics', key], new List(value))
      }
    })

    //恢复用户话题
    const userTopics = Map(incoming.userTopics)
    userTopics.map((value, key)=> {
      if (value && key) {
        state = state.setIn(['userTopics', key], new List(value))
      }
    })

    //恢复本地话题
    const localTopics = incoming.localTopics
    let localTopicList = []
    localTopics.forEach((item)=>{
      localTopicList.push(item)
    })
    if(localTopicList&&localTopicList.length){
      state = state.set('localTopics',  List(localTopicList))
    }

    //恢复精选话题
    const pickedTopics = incoming.pickedTopics
    let pickedTopicList = []
    pickedTopics.forEach((item)=>{
      pickedTopicList.push(item)
    })
    if(pickedTopicList&&pickedTopicList.length){
      state = state.set('pickedTopics',  List(pickedTopicList))
    }

    //恢复主页话题
    const mainPageTopics = incoming.mainPageTopics
    let mainPageTopicList = []
    mainPageTopics.forEach((item)=>{
      mainPageTopicList.push(item)
    })
    if(mainPageTopicList&&mainPageTopicList.length){
      state = state.set('mainPageTopics',  List(mainPageTopicList))
    }


  }
  return state
}


