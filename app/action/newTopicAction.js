/**
 * Created by lilu on 2017/7/4.
 */
import {createAction} from 'redux-actions'
import * as topicActionTypes from '../constants/newTopicActionTypes'
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

export function fetchAllComments(payload) {
  return (dispatch, getState) => {
    let more = payload.more
    lcTopics.fetchAllComments(payload).then((result) => {
      let commentList = result.commentList
      let allComments = result.comments
      if(allComments && allComments.length) {
          let updateAction = createAction(topicActionTypes.FETCH_ALL_COMMENTS)
          dispatch(updateAction({comments:allComments}))
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