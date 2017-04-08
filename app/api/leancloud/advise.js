/**
 * Created by lilu on 2017/4/8.
 */
import AV from 'leancloud-storage'
import {List} from 'immutable'
import ERROR from '../../constants/errorCode'
import {TopicsItem, TopicCommentsItem, TopicLikeUser} from '../../models/TopicModel'
import {Up} from '../../models/shopModel'
import {Geolocation} from '../../components/common/BaiduMap'
import * as AVUtils from '../../util/AVUtils'
import * as topicSelector from '../../selector/topicSelector'
import * as authSelector from '../../selector/authSelector'
import {store} from '../../store/persistStore'
import * as locSelector from '../../selector/locSelector'

export function publishAdvise(payload) {

  let Advise = AV.Object.extend('UserFeedBack')
  let advise = new Advise()

  // var topicCategory = AV.Object.createWithoutData('TopicCategory', payload.categoryId)
  var user = AV.Object.createWithoutData('_User', payload.userId)

  advise.set('geoPoint', payload.geoPoint)
  advise.set('position', payload.position)
  advise.set('city', payload.city)
  advise.set('district', payload.district)
  advise.set('province', payload.province)
  // topic.set('category', topicCategory)
  advise.set('user', user)
  advise.set('imgGroup', payload.imgGroup)
  advise.set('content', payload.content)
  // topic.set('title', payload.title)
  // topic.set('abstract', payload.abstract)
  // topic.set('commentNum', 0)
  // topic.set('likeCount', 0)

  return advise.save().then(function (result) {

    return {success:true}
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}