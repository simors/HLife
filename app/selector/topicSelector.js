/**
 * Created by wuxingyu on 2016/12/24.
 */

export function getTopics(state) {
  return state.TOPIC.toJS().topics
}

export function getAllTopics(state) {
  return state.TOPIC.toJS().allTopics
}

export function getMyTopics(state) {
  return state.TOPIC.toJS().myTopics
}

export function getPickedTopics(state) {
  return state.TOPIC.toJS().pickedTopics
}

export function getLocalTopics(state) {
  return state.TOPIC.toJS().localTopics
}

export function getLocalCity(state) {
  return state.TOPIC.toJS().city
}

export function getTopicComments(state) {
  return state.TOPIC.toJS().topicComments
}


export function getTopicLikedTotalCount(state, topicId) {
  return state.TOPIC.toJS().TopicLikesNum[topicId]
}

export function getTopicLikeUsers(state, topicId) {
  return state.TOPIC.toJS().TopicLikeUsers[topicId]
}

export function isTopicLiked(state, topicId) {
  return state.TOPIC.toJS().IsLikedByCurrentUser[topicId]
}

export function getTopicById(state, topicId) {
  let topicList = state.TOPIC.get('topics')
  for (let [userId, value] of topicList) {
    let topic = value.find((item) => {
      return item.objectId == topicId
    })
    if (topic) {
      return topic.toJS()
    }
  }
  let localTopicList = state.TOPIC.get('localTopics')
  for (let key of localTopicList) {
    if(key.objectId == topicId) {
      return key.toJS()
    }
  }

  let pickedTopicList = state.TOPIC.get('pickedTopics')
  for (let key of pickedTopicList) {
    if(key.objectId == topicId) {
      return key.toJS()
    }
  }

  return undefined
}

export function selectUserTopics(state, userId) {
  let userTopicsList = state.TOPIC.getIn(['userTopics', userId])
  if(userTopicsList) {
    return userTopicsList.toJS()
  }
  return []
}

export function getMainPageTopics(state) {
  let topics = state.TOPIC.get('mainPageTopics')
  if (topics) {
    return topics.toJS()
  }
  return []
}

export function selectUserTopicsTotalCount(state, userId) {
  let userTopicsTotalCount = state.TOPIC.userTopicsTotalCount.get(userId)
  return userTopicsTotalCount ? userTopicsTotalCount : 0
}