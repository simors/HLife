import AV from 'leancloud-storage'
import {List} from 'immutable'
import ERROR from '../../constants/errorCode'
import {TopicsItem} from '../../models/TopicModel'

export function publishTopics(payload) {
  let Topics = AV.Object.extend('Topics')
  let topic = new Topics()

  var topicCategory = AV.Object.createWithoutData('TopicCategory', payload.categoryId)
  var user = AV.Object.createWithoutData('_User', payload.userId)


  topic.set('category', topicCategory)
  topic.set('user', user)
  topic.set('imgGroup', payload.imgGroup)
  topic.set('content', payload.content)

  return topic.save().then(function (doctor) {
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
