import AV from 'leancloud-storage'
import {List} from 'immutable'
import ERROR from '../../constants/errorCode'
import {TopicArticlesItem} from '../../models/TopicModel'

export function publishTopics(payload) {
  let Topics = AV.Object.extend('Topics')
  let topic = new Topics()

  var topicCategory = AV.Object.createWithoutData('TopicCategory', payload.categoryId);

  topic.set('dependent', topicCategory);
  topic.set('imgGroup', payload.imgGroup)
  topic.set('content', payload.content)

  return topic.save().then(function (doctor) {
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function getTopicArticles(payload) {
  let categoryId = payload.categoryId
  var category = AV.Object.createWithoutData('TopicCategory', categoryId);
  let query = new AV.Query('Topics')
  query.equalTo('dependent', category)
  return query.find().then(function (results) {
    let topicArticles = []
    results.forEach((result) => {
      topicArticles.push(TopicArticlesItem.fromLeancloudObject(result))
    })
    return new List(topicArticles)
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}
