/**
 * Created by lilu on 2017/7/4.
 */
import AV from 'leancloud-storage'
import {List, Record, Map} from 'immutable'
import ERROR from '../../constants/errorCode'
import {TopicCommentsItem,TopicsItem} from '../../models/NewTopicModel'
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

export function fetchAllUserUps(userId) {

      return AV.Cloud.run('hlifeTopicFetchUserUps', {userId: userId}).then((results)=> {
        // console.log('results======>',results)
        return {commentsUps: results.commentList, topicsUps: results.topicList}
      }, (err)=> {
        throw err
      })

}

export function likeTopic(payload) {

  let userId = authSelector.activeUserId(store.getState())
  if(userId&&userId!=''){
    return AV.Cloud.run('hlifeTopicUpByUser', {...payload, userId: userId}).then((result)=> {
      let topicInfo = topicSelector.getTopicById(store.getState(), payload.topicId)
      let activeUser = authSelector.activeUserInfo(store.getState())
      let pushUserid = topicInfo && topicInfo.userId
      if(pushUserid && activeUser.id != pushUserid) {
        AVUtils.pushByUserList([pushUserid], {
          alert: `${activeUser.nickname}点赞了您的评论,立即查看`,
          sceneName: 'TOPIC_DETAIL',
          sceneParams: {
            topic: topicInfo
          }
        })
      }
      return result
    }, (err)=> {
      throw err
    })
  }
}

export function publishTopicComments(payload) {
  return AV.Cloud.run('hlifeTopicPubulishTopicComment',{payload:payload}).then( (result) => {
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

    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function fetchTopicList(payload){
  // console.log('payload==========>',payload)
  return AV.Cloud.run('fetchTopicList',{payload:payload}).then((results)=>{
    if(results){
     return results
    }
  },(err)=>{
    throw err
  })
}