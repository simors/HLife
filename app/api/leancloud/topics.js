import AV from 'leancloud-storage'
import {List} from 'immutable'
import ERROR from '../../constants/errorCode'
import {TopicsItem, TopicCommentsItem} from '../../models/TopicModel'

export function publishTopics(payload) {
  let Topics = AV.Object.extend('Topics')
  let topic = new Topics()

  var topicCategory = AV.Object.createWithoutData('TopicCategory', payload.categoryId)
  var user = AV.Object.createWithoutData('_User', payload.userId)


  topic.set('category', topicCategory)
  topic.set('user', user)
  topic.set('imgGroup', payload.imgGroup)
  topic.set('content', payload.content)
  topic.set('commentNum', 0)

  return topic.save().then(function (result) {
  }, function (err) {
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
  var category = AV.Object.createWithoutData('TopicCategory', categoryId);
  let query = new AV.Query('Topics')
  query.equalTo('category', category)
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