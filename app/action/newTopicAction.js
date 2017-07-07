/**
 * Created by lilu on 2017/7/4.
 */
import {createAction} from 'redux-actions'
import * as topicActionTypes from '../constants/newTopicActionTypes'
import {TopicCommentsItem} from '../models/NewTopicModel'
import * as uiTypes from '../constants/uiActionTypes'
import {getInputFormData, isInputFormValid} from '../selector/inputFormSelector'
import * as lcTopics from '../api/leancloud/newTopics'
import {notifyTopicComment, notifyTopicLike} from './messageAction'
import * as locSelector from '../selector/locSelector'
import AV from 'leancloud-storage'
import * as pointAction from '../action/pointActions'
import * as ImageUtil from '../util/ImageUtil'
import * as numberUtils from '../util/numberUtils'
import {trim} from '../util/Utils'
import * as topicSelector from '../selector/newTopicSelector'
import {store} from '../store/persistStore'

export function fetchAllComments(payload) {
  // console.log('hahahahahahahahahah')
  return (dispatch, getState) => {
    let more = payload.more
    if (!more) {
      more = false
    }
    lcTopics.fetchAllComments(payload).then((result) => {
      let commentList = result.commentList

      let allComments = result.comments

      if(allComments && allComments.length) {
        let comments = []
        allComments.forEach((item)=>{
          let comment = TopicCommentsItem.fromLeancloudObject(item)
          comments.push(comment)
        })

        let updateAction = createAction(topicActionTypes.FETCH_ALL_COMMENTS)
          dispatch(updateAction({comments:comments}))
      }

      if(payload.commentId && payload.commentId!='') {
        if(more){
          let updateAction = createAction(topicActionTypes.FETCH_COMMENT_ADD_COMMENTS)
          dispatch(updateAction({commentId:payload.commentId,comments:commentList}))
        }else{
          let updateAction = createAction(topicActionTypes.FETCH_COMMENT_SET_COMMENTS)
          dispatch(updateAction({commentId:payload.commentId,comments:commentList}))
        }
      }else if(payload.topicId&&payload.topicId!=''){
        if(more){
          let updateAction = createAction(topicActionTypes.FETCH_TOPIC_ADD_COMMENTS)
          dispatch(updateAction({topicId:payload.topicId,comments:commentList}))
        }else{
          let updateAction = createAction(topicActionTypes.FETCH_TOPIC_SET_COMMENTS)
          dispatch(updateAction({topicId:payload.topicId,comments:commentList}))
        }
      }

      if(payload.success) {
        payload.success(commentList.length==0)
      }
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}

export function fetchAllUserUps(payload){
  return(dispatch,getState)=>{
    lcTopics.fetchAllUserUps().then((results)=>{

      console.log('results====>',results)
      let commentsUps = results.commentsUps
      let topicsUps = results.topicsUps
      if(results.commentsUps&&results.commentsUps.length){
        let updateAction = createAction(topicActionTypes.FETCH_MY_COMMENTS_UPS)
        dispatch(updateAction({commentsUps:commentsUps}))
      }
      if(results.topicsUps&&results.topicsUps.length){
        let updateAction = createAction(topicActionTypes.FETCH_MY_TOPICS_UPS)
        dispatch(updateAction({topicsUps:topicsUps}))
      }
      if(payload.success){
        payload.success()
      }
    },(err)=>{
      if(payload.error){
        payload.error(err)

      }
    })
  }
}

export function fetchUpItem(payload){
  return(dispatch,getState)=>{
    let isLiked = false
    if (payload.upType == 'topicComment') {
      isLiked = topicSelector.isCommentLiked(store.getState(),payload.targetId)
      if (isLiked) {
        let err = {message: '您已经点赞过该评论!'}
        if(payload.error){
          payload.error(err)
        }
      }
    }else{
      lcTopics.likeTopic(payload).then((result)=>{
        if(payload.upType=='topicComment'){
          let updateAction = createAction(topicActionTypes.UP_COMMENT_SUCCESS)
          dispatch(updateAction({targetId:result}))
        }else if(payload.upType=='topic'){
          let updateAction = createAction(topicActionTypes.UP_TOPIC_SUCCESS)
          dispatch(updateAction({targetId:result}))
        }
        if(payload.success){
          payload.success()
        }
      },(err)=>{
        if(payload.error){
          payload.error(err)
        }
      })
    }
  }
}