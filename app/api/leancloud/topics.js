import AV from 'leancloud-storage'
import {Map, List, Record} from 'immutable'
import {ShopRecord, ShopInfo} from '../../models/shopModel'
import ERROR from '../../constants/errorCode'
import * as oPrs from './databaseOprs'

export function pubishTopics(payload) {
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
