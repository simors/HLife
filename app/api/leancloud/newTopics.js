/**
 * Created by lilu on 2017/7/4.
 */
import AV from 'leancloud-storage'
import {List,Record,Map} from 'immutable'
import ERROR from '../../constants/errorCode'
import {TopicCommentsItem} from '../../models/NewTopicModel'
import {Up} from '../../models/shopModel'
import {Geolocation} from '../../components/common/BaiduMap'
import * as AVUtils from '../../util/AVUtils'
import * as topicSelector from '../../selector/topicSelector'
import * as authSelector from '../../selector/authSelector'
import {store} from '../../store/persistStore'
import * as locSelector from '../../selector/locSelector'


export function fetchAllComments(payload){
  let params = {
    topicId: payload.topicId,
    userId: payload.userId,
    commentId: payload.commentId,
    isRefresh: payload.isRefresh,
    lastCreatedAt: payload.lastCreatedAt
  }
  return AV.Cloud.run('hlifeTopicFetchComments',params).then((results)=>{
    return {comments:results.allComments,commentList:results.commentList}
  },(err)=>{
    return err
  })
}

export function fetchAllUserUps(){
  let currentUser = AV.User.current()
  let userId = currentUser.id
  return AV.Cloud.run('hlifeTopicFetchUserUps',{userId:userId}).then((results)=>{
    return {commentsUps:results.commentList,topicsUps:results.topicList}
  })
}