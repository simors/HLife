import AV from 'leancloud-storage'
import {List} from 'immutable'
import ERROR from '../../constants/errorCode'
import {TopicsItem, TopicCommentsItem} from '../../models/TopicModel'
import {Up} from '../../models/shopModel'

export function publishTopics(payload) {
  let Topics = AV.Object.extend('Topics')
  let topic = new Topics()

  var topicCategory = AV.Object.createWithoutData('TopicCategory', payload.categoryId)
  var user = AV.Object.createWithoutData('_User', payload.userId)


  topic.set('category', topicCategory)
  topic.set('user', user)
  topic.set('imgGroup', payload.imgGroup)
  topic.set('content', payload.content)
  topic.set('title', payload.title)
  topic.set('abstract', payload.abstract)
  topic.set('commentNum', 0)

  return topic.save().then(function (result) {
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function fetchTopicLikesCount(payload) {
  let topicId = payload.topicId
  let upType = payload.upType
  let query = new AV.Query('Up')
  query.equalTo('targetId', topicId)
  query.equalTo('upType', upType)
  query.equalTo('status', true)
  return query.count().then((results)=> {
    return results
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function fetchUserLikeTopicInfo(payload) {
  let shopId = payload.topicId
  let upType = payload.upType
  let currentUser = AV.User.current()

  let query = new AV.Query('Up')
  query.equalTo('targetId', shopId)
  query.equalTo('upType', upType)
  query.equalTo('user', currentUser)
  query.include('user')
  return query.first().then((result) =>{
    let userUpShopInfo = undefined
    if(result && result.attributes) {
      userUpShopInfo = Up.fromLeancloudObject(result)
    }
    return userUpShopInfo
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function likeTopic(payload) {
  let topicId = payload.topicId
  let upType = payload.upType
  let currentUser = AV.User.current()
  return fetchUserLikeTopicInfo(payload).then((userLikeTopicInfo) => {
    if (!userLikeTopicInfo) {
      let Up = AV.Object.extend('Up')
      let up = new Up()
      up.set('targetId', topicId)
      up.set('upType', upType)
      up.set('user', currentUser)
      return up.save()
    }
    else if (userLikeTopicInfo.id && !userLikeTopicInfo.status) {
      let up = AV.Object.createWithoutData('Up', userLikeTopicInfo.id)
      up.set('status', true)
      return up.save()
    }
    return {
      code: '10107',
      message: '您已经赞过该话题了'
    }
  }).then((result) => {
    if (result && '10107' == result.code) {
      return result
    }
    return {
      topicId: topicId,
      code: '10108',
      message: '成功点赞'
    }
  }).catch((err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function unLikeTopic(payload) {
  let topicId = payload.topicId
  return fetchUserLikeTopicInfo(payload).then((userLikeTopicInfo) => {
    if (userLikeTopicInfo && userLikeTopicInfo.id) {
      let up = AV.Object.createWithoutData('Up', userLikeTopicInfo.id)
      up.set('status', false)
      return up.save()
    }
    return {
      code: '10009',
      message: '您还没有赞过该话题'
    }
  }).then((result) => {
    if (result && '10009' == result.code) {
      return result
    }
    return {
      topicId: topicId,
      code: '10010',
      message: '取消点赞成功'
    }
  }).catch((err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function publishTopicComments(payload) {
  let TopicComments = AV.Object.extend('TopicComments')
  let topicComment = new TopicComments()

  var topic = AV.Object.createWithoutData('Topics', payload.topicId)
  var user = AV.Object.createWithoutData('_User', payload.userId)
  var parentComment = AV.Object.createWithoutData('TopicComments', payload.commentId)

  topicComment.set('topic', topic)
  topicComment.set('user', user)
  topicComment.set('content', payload.content)

  if (payload.commentId) {
    topicComment.set('parentComment', parentComment)
  }

  return topicComment.save().then(function (result) {
    if (result) {
      let relation = topic.relation('comments')
      relation.add(topicComment);
      topic.increment("commentNum", 1)

      return topic.save().then(function (result) {
      }, function (err) {
        err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
        throw err
      })
    }
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function getTopics(payload) {
  let categoryId = payload.categoryId
  let query = new AV.Query('Topics')
  if(categoryId) {
    var category = AV.Object.createWithoutData('TopicCategory', categoryId);
    query.equalTo('category', category)
  }
  query.include(['user']);
  query.descending('createdAt')
  return query.find().then(function (results) {
    let topics = []
    results.forEach((result) => {
      topics.push(TopicsItem.fromLeancloudObject(result))
    })
    return new List(topics)
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function getTopicComments(payload) {
  let topicId = payload.topicId
  let topic = AV.Object.createWithoutData('Topics', topicId);
  let relation = topic.relation('comments')
  let query = relation.query()
  query.include(['user']);
  query.include(['parentComment']);
  query.include(['parentComment.user']);
  query.descending('createdAt')
  return query.find().then(function (results) {
      let topicComments = []
      if (results) {
        results.forEach((result) => {
          topicComments.push(TopicCommentsItem.fromLeancloudObject(result))
        })
      }
      return new List(topicComments)
    }
    , function (err) {
      err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
      throw err
    })
}