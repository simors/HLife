/**
 * Created by lilu on 2017/7/5.
 */

export function getLocalTopics(state){
  let topics = state.NEWTOPIC.get('localTopics')||[]
  let topicList = []
  topics.forEach((topicId)=>{
    let topic = state.NEWTOPIC.getIn(['allTopics',topicId])
    topicList.push(topic.toJS())
  })
  return {localTopics:topics.toJS(),allTopics:topicList}
}

export function getPickedTopics(state){
  let topics = state.NEWTOPIC.get('pickedTopics')||[]
  let topicList = []
  topics.forEach((topicId)=>{
    let topic = state.NEWTOPIC.getIn(['allTopics',topicId])
    topicList.push(topic.toJS())
  })
  return {pickedTopics:topics.toJS(),allTopics:topicList}
}


export function getTopicsByCategoryId(state,categoryId){
  let topics = state.NEWTOPIC.getIn(['pickedTopics',categoryId])||[]
  let topicList = []
  topics.forEach((topicId)=>{
    let topic = state.NEWTOPIC.getIn(['allTopics',topicId])
    topicList.push(topic.toJS())
  })
  return {categoryTopics:topics.toJS(),allTopics:topicList}
}

export function getCommentsByTopicId(state,topicId){
  let topicComments = state.NEWTOPIC.get('commentsForTopic')||[]

  let comments = topicComments.get(topicId)||[]
  let commentList = []
  let commentIdList = []

  comments.forEach((item)=>{
    let allComments = state.NEWTOPIC.get('allComments')||[]
    let comment = allComments.get(item)
    if(comment){
      commentList.push(comment.toJS())
      commentIdList.push(item)
    }
  })
  return {commentList:commentList,comments:commentIdList}
}

export function getCommentsByCommentId(state,commentId){
  let topicComments = state.NEWTOPIC.get('commentsForComment')||[]

  let comments = topicComments.get(commentId)||[]
  let commentList = []
  let commentIdList = []
  comments.forEach((item)=>{
    let allComments = state.NEWTOPIC.get('allComments')||[]
    let comment = allComments.get(item)
    if(comment){
      commentList.push(comment.toJS())
      commentIdList.push(item)
    }
  })
  return {commentList:commentList,comments:commentIdList}
}


export function isCommentLiked(state,commentId){
  let commentUps = state.NEWTOPIC.get('myCommentsUps')||[]
  let isLiked = false
  commentUps.forEach((item)=>{
    if(item==commentId){
      isLiked = true
    }
  })
  return isLiked
}

export function isTopicLiked(state,topicId){
  let topicUps = state.NEWTOPIC.get('myTopicsUps')||[]
  let isLiked = false
  topicUps.forEach((item)=>{
    if(item==topicId){
      isLiked = true
    }
  })
  return isLiked
}