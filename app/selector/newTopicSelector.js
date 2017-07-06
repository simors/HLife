/**
 * Created by lilu on 2017/7/5.
 */


export function getCommentsByTopicId(state,topicId){
  let topicComments = state.NEWTOPIC.get('commentsForTopic')||[]

  let comments = topicComments.get(topicId)||[]
  let commentList = []
  comments.forEach((item)=>{
    let allComments = state.NEWTOPIC.get('allComments')||[]
    let comment = allComments.get(item)
    commentList.push(comment.toJS())
  })
  return commentList
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