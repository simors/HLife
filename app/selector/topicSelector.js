/**
 * Created by wuxingyu on 2016/12/24.
 */

export function getTopics(state) {
  return state.TOPIC.toJS().topics
}

export function getTopicComments(state) {
  return state.TOPIC.toJS().topicComments
}


export function getTopicLikedTotalCount(state, topicId) {
  return state.TOPIC.toJS().TopicLikesNum[topicId]
}


export function isTopicLiked(state, topicId) {
  return state.TOPIC.toJS().IsLikedByCurrentUser[topicId]
}