/**
 * Created by lilu on 2017/7/5.
 */


export function getCommentsByTopicId(state,topicId){
  let topicComments = state.NEWTOPIC.get('commentsForTopic')||[]

  let comments = topicComments.get(topicId)||[]
  let commentList = []
  let commentIdList = []
  comments.forEach((item)=>{
    let allComments = state.NEWTOPIC.get('allComments')||[]
    let comment = allComments.get(item)
    commentList.push(comment.toJS())
    commentIdList.push(item)
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