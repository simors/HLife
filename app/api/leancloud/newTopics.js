/**
 * Created by lilu on 2017/7/4.
 */
import AV from 'leancloud-storage'
import {List, Record, Map} from 'immutable'
import ERROR from '../../constants/errorCode'
import {TopicCommentsItem} from '../../models/NewTopicModel'
import {Up} from '../../models/shopModel'
import {Geolocation} from '../../components/common/BaiduMap'
import * as AVUtils from '../../util/AVUtils'
import * as newTopicSelector from '../../selector/newTopicSelector'
import * as topicSelector from '../../selector/topicSelector'

import * as authSelector from '../../selector/authSelector'
import {store} from '../../store/persistStore'
import * as locSelector from '../../selector/locSelector'


export function fetchAllComments(payload) {
  let params = {
    topicId: payload.topicId,
    userId: payload.userId,
    commentId: payload.commentId,
    isRefresh: payload.isRefresh,
    lastCreatedAt: payload.lastCreatedAt
  }
  return AV.Cloud.run('hlifeTopicFetchComments', params).then((results)=> {
    return {comments: results.allComments, commentList: results.commentList}
  }, (err)=> {
    // console.log('err====>',err)

    throw err
  })
}

export function fetchAllUserUps() {
  let userId = authSelector.activeUserId()
    return AV.Cloud.run('hlifeTopicFetchUserUps', {userId: userId}).then((results)=> {
      return {commentsUps: results.commentList, topicsUps: results.topicList}
    }, (err)=> {
      throw err
    })

}

export function likeTopic(payload) {
  let targetId = payload.targetId
  let upType = payload.upType
  let upItem = undefined
  let isLiked = false
  let userId = authSelector.activeUserId()
  // console.log('likeTopic.topicId===', topicId)
  if(userId&&userId!=''){
    return AV.Cloud.run('hlifeTopicUpByUser', {...payload, userId: userId}).then((result)=> {
      return result
    }, (err)=> {
      throw err
    })
  }
}

export function publishTopicComments(payload) {
  console.log('payload====>',payload)
  return AV.Cloud.run('hlifeTopicPubulishTopicComment',{payload:payload}).then(function (result) {
    console.log('result========>',result)
    if (result) {
      let topicInfo = topicSelector.getTopicById(store.getState(), payload.topicId)
      let activeUser = authSelector.activeUserInfo(store.getState())
      let pushUserid = topicInfo && topicInfo.userId
      if(pushUserid && activeUser.id != pushUserid) {
        AVUtils.pushByUserList([pushUserid], {
          alert: `${activeUser.nickname}评论了您,立即查看`,
          sceneName: 'TOPIC_DETAIL',
          sceneParams: {
            topic: topicInfo
          }
        })
      }
      return result
    }
  },  (err) => {
    console.log('err========>',err)

    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}