/**
 * Created by lilu on 2017/7/4.
 */
import {createAction} from 'redux-actions'
import * as topicActionTypes from '../constants/newTopicActionTypes'
import {TopicCommentsItem, TopicsItem, TopicUpInfoItem} from '../models/NewTopicModel'
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
import * as authSelector from '../selector/authSelector'
import * as AuthTypes from '../constants/authActionTypes'


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

      if (allComments && allComments.length) {
        let comments = []
        allComments.forEach((item)=> {
          let comment = TopicCommentsItem.fromLeancloudApi(item)
          comments.push(comment)
        })

        let updateAction = createAction(topicActionTypes.FETCH_ALL_COMMENTS)
        dispatch(updateAction({comments: comments}))
      }

      if (payload.commentId && payload.commentId != '') {
        if (more) {
          let updateAction = createAction(topicActionTypes.FETCH_COMMENT_ADD_COMMENTS)
          dispatch(updateAction({commentId: payload.commentId, comments: commentList}))
        } else {
          let updateAction = createAction(topicActionTypes.FETCH_COMMENT_SET_COMMENTS)
          dispatch(updateAction({commentId: payload.commentId, comments: commentList}))
        }
      } else if (payload.topicId && payload.topicId != '') {
        if (more) {
          let updateAction = createAction(topicActionTypes.FETCH_TOPIC_ADD_COMMENTS)
          dispatch(updateAction({topicId: payload.topicId, comments: commentList}))
        } else {
          let updateAction = createAction(topicActionTypes.FETCH_TOPIC_SET_COMMENTS)
          dispatch(updateAction({topicId: payload.topicId, comments: commentList}))
        }
      }

      if (payload.success) {
        payload.success(commentList.length == 0)
      }
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}

export function fetchAllUserUps(payload) {
  return (dispatch, getState)=> {
    let userId = authSelector.activeUserId(store.getState())
    if (userId && userId != '') {
      lcTopics.fetchAllUserUps(userId).then((results)=> {
        let commentsUps = results.commentsUps
        let topicsUps = results.topicsUps
        if (results.commentsUps && results.commentsUps.length) {
          let updateAction = createAction(topicActionTypes.FETCH_MY_COMMENTS_UPS)
          dispatch(updateAction({commentsUps: commentsUps}))
        }
        if (results.topicsUps && results.topicsUps.length) {
          let updateAction = createAction(topicActionTypes.FETCH_MY_TOPICS_UPS)
          dispatch(updateAction({topicsUps: topicsUps}))
        }
        if (payload.success) {
          payload.success()
        }
      }, (err)=> {
        if (payload.error) {
          payload.error(err)
        }
      })
    }
  }
}

export function fetchUpItem(payload) {
  return (dispatch, getState)=> {
    let isLiked = false
    if (payload.upType == 'topicComment') {
      isLiked = topicSelector.isCommentLiked(store.getState(), payload.targetId)
    } else if (payload.upType == 'topic') {
      isLiked = topicSelector.isTopicLiked(store.getState(), payload.targetId)
    }
    if (isLiked) {
      let err = {message: '您已经点赞过!'}
      if (payload.error) {
        payload.error(err)
      }
    } else {
      lcTopics.likeTopic(payload).then((result)=> {
        let up = TopicUpInfoItem.fromLeancloudApi(result)

        if (payload.upType == 'topicComment') {
          let updateAction = createAction(topicActionTypes.UP_COMMENT_SUCCESS)
          dispatch(updateAction({targetId: up.targetId}))
        } else if (payload.upType == 'topic') {
          let updateAction = createAction(topicActionTypes.UP_TOPIC_SUCCESS)
          dispatch(updateAction({upItem: up}))
          dispatch(notifyTopicLike({topicId: payload.targetId}))
        }
        if (payload.success) {
          payload.success()
        }
      }, (err)=> {
        if (payload.error) {
          payload.error(err)
        }
      })
    }

  }
}

export function fetchPublishTopicComment(payload, formData) {
  return (dispatch, getState) => {
    let position = locSelector.getLocation(getState())
    let province = locSelector.getProvince(getState())
    let city = locSelector.getCity(getState())
    let district = locSelector.getDistrict(getState())
    let geoPoint = locSelector.getGeopoint(getState())
    // if (geoPoint.latitude == 0 && geoPoint.longitude == 0) {
    //   if (payload.error) {
    //     payload.error({message: '请为应用打开地理位置权限！'})
    //   }
    //   return
    // }
    let publishTopicCommentPayload = {
      position: position,
      geoPoint: new AV.GeoPoint(geoPoint.latitude, geoPoint.longitude),
      province: province,
      city: city,
      district: district,
      content: payload.content,
      topicId: payload.topicId,
      commentId: payload.commentId,
      replyId: payload.replyId,
      userId: payload.userId
    }
    if ((!payload.content) || payload.content.length == 0) {
      payload.error({message: "输入不能为空"})
      return
    }
    lcTopics.publishTopicComments(publishTopicCommentPayload).then((result) => {
      let comment = TopicCommentsItem.fromLeancloudApi(result)
      let publishCommentAction = createAction(topicActionTypes.PUBLISH_COMMENT_SUCCESS)
      dispatch(publishCommentAction({comment: comment}))
      dispatch(notifyTopicComment({
        topicId: payload.topicId,
        replyTo: payload.replyTo,
        commentId: result.commentId,
        content: payload.content,
        commentTime: new Date(result.createdAt),
      }))

      dispatch(pointAction.calPublishComment({userId: payload.userId}))   // 计算发布话题评论积分
      if (payload.success) {
        payload.success()
      }
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}

export function fetchAllTopics(payload) {
  return (dispath, getState)=> {
    lcTopics.fetchTopicList(payload).then((results)=> {

      let topics = []
      let topicList = []
      results.topics.forEach((item)=> {
        // console.log('item',item)
        let topic = TopicsItem.fromLeancloudApi(item)
        topics.push(topic)
        topicList.push(item.objectId)
      })
      // console.log('topicList---==>',topicList)

      switch (payload.type) {
        case "topics":
          let fetchCateTopics = undefined
          if (!payload.isRefresh) {
            fetchCateTopics = createAction(topicActionTypes.FETCH_ADD_CATE_TOPICS)
          } else {
            fetchCateTopics = createAction(topicActionTypes.FETCH_SET_CATE_TOPICS)
          }
          dispath(fetchCateTopics({topics: topics, topicList: topicList, categoryId: payload.categoryId}))
          break
        case "mainPageTopics":
          let fetchMainPageTopics = undefined
          if (!payload.isRefresh) {
            fetchMainPageTopics = createAction(topicActionTypes.FETCH_ADD_MAINPAGE_TOPICS)
          } else {
            fetchMainPageTopics = createAction(topicActionTypes.FETCH_SET_MAINPAGE_TOPICS)
          }
          dispath(fetchMainPageTopics({topics: topics, topicList: topicList}))
          break
        case "userTopics":
          let fetchUserTopics = undefined

          if (!payload.isRefresh) {
            fetchUserTopics = createAction(topicActionTypes.FETCH_ADD_USER_TOPICS)
          } else {
            fetchUserTopics = createAction(topicActionTypes.FETCH_SET_USER_TOPICS)
          }

          dispath(fetchUserTopics({topics: topics, topicList: topicList, userId: payload.userId}))
          break
        case "localTopics":
          let fetchLocalTopics = undefined
          if (!payload.isRefresh) {
            fetchLocalTopics = createAction(topicActionTypes.FETCH_ADD_LOCAL_TOPICS)
          } else {
            fetchLocalTopics = createAction(topicActionTypes.FETCH_SET_LOCAL_TOPICS)
          }
          dispath(fetchLocalTopics({topics: topics, topicList: topicList}))
          break
        case "pickedTopics":
          let fetchPickedTopics = undefined
          if (!payload.isRefresh) {
            fetchPickedTopics = createAction(topicActionTypes.FETCH_ADD_PICKED_TOPICS)
          } else {
            fetchPickedTopics = createAction(topicActionTypes.FETCH_SET_PICKED_TOPICS)
          }
          dispath(fetchPickedTopics({topics: topics, topicList: topicList}))
          break

      }
      if (payload.success) {
        payload.success(results.topics.length == 0)
      }
    }, (err)=> {
      if (payload.error) {
        payload.error(err)
      }
    })
  }
}

export function fetchTopicDetailInfo(payload) {
  return (dispatch, getState)=> {
    lcTopics.fetchTopicDetailInfo(payload).then((results)=> {
      // console.log('results==============>',results)
      let upList = []
      results.likeUsers.forEach((item)=> {
        let up = TopicUpInfoItem.fromLeancloudApi(item)
        upList.push(up)
      })
      let upAction = createAction(topicActionTypes.FETCH_SET_TOPIC_UPS)
      dispatch(upAction({topicId: payload.topicId, upList: upList}))

      // console.log('upList',upList)
      let followerAction = createAction(AuthTypes.FETCH_USER_FOLLOWERS_TOTAL_COUNT_SUCCESS)
      dispatch(followerAction(results.followerCount))

    }, (err)=> {
      if (payload.error) {
        payload.error(err)
      }
    })
  }
}

export function fetchUpsByTopicId(payload) {
  return (dispatch, getState)=> {
    lcTopics.fetchUpsByTopicId(payload).then((results)=> {
      // console.log('results==============>',results)
      let upList = []
      results.ups.forEach((item)=> {
        let up = TopicUpInfoItem.fromLeancloudApi(item)
        upList.push(up)
      })
      if (!!payload.isRefresh) {
        let upAction = createAction(topicActionTypes.FETCH_SET_TOPIC_UPS)
        dispatch(upAction({topicId: payload.topicId, upList: upList}))
      } else {
        let upAction = createAction(topicActionTypes.FETCH_ADD_TOPIC_UPS)
        dispatch(upAction({topicId: payload.topicId, upList: upList}))
      }
      if (payload.success) {
        payload.success(results.ups.length)
        // payload.success(topicLikeUsers.size <= 0)
      }
    }, (err)=> {
      if (payload.error) {
        payload.error(err)
      }
    })
  }
}

export function fetchPublishTopic(payload, formData) {
  return (dispatch, getState) => {
    let formData = undefined
    if (payload.formKey) {
      let formCheck = createAction(uiTypes.INPUTFORM_VALID_CHECK)
      dispatch(formCheck({formKey: payload.formKey}))
      let isFormValid = isInputFormValid(getState(), payload.formKey)
      if (isFormValid && !isFormValid.isValid) {
        if (payload.error) {
          payload.error({message: isFormValid.errMsg})
        }
        return
      }
      formData = getInputFormData(getState(), payload.formKey)
    }
    let position = locSelector.getLocation(getState())
    let province = locSelector.getProvince(getState())
    let city = locSelector.getCity(getState())
    let district = locSelector.getDistrict(getState())
    let geoPoint = locSelector.getGeopoint(getState())
    ImageUtil.batchUploadImgs2(payload.images).then((leanUris) => {
      // if (!leanUris || leanUris == '') {
      //   throw new Error('话题发布失败，请重新发布！')
      // }
      if (leanUris.length != 0) {
        if (formData.topicContent && formData.topicContent.text.length &&
          leanUris && leanUris.length) {
          let contentImgs = leanUris.concat([]).reverse()
          formData.topicContent.text.forEach((value) => {
            if (value.type == 'COMP_IMG' && value.url)
              value.url = contentImgs.pop()
          })
        }
      }

      let publishTopicPayload = {
        position: position,
        geoPoint: new AV.GeoPoint(geoPoint.latitude, geoPoint.longitude),
        province: province,
        city: city,
        district: district,
        title: trim(formData.topicName.text),
        content: JSON.stringify(formData.topicContent.text),
        abstract: trim(formData.topicContent.abstract),
        imgGroup: leanUris,
        categoryId: payload.categoryId,
        userId: payload.userId,
      }
      return lcTopics.publishTopics(publishTopicPayload).then((result) => {

        let publishAction = createAction(topicActionTypes.FETCH_PUBLISH_TOPIC_SUCCESS)
        dispatch(publishAction({topic: result, stateKey: payload.stateKey}))
        dispatch(pointAction.calPublishTopic({userId: payload.userId}))        // 计算发布话题积分
        if (payload.success) {
          payload.success()
        }
      }).catch((error) => {
        console.log("error: ", error)
        if (payload.error) {
          payload.error(error)
        }
      })
    }).catch((error) => {
      if (payload.error) {
        payload.error({message: error.message})
      }
    })
  }
}

export function fetchUpdateTopic(payload, formData) {
  return (dispatch, getState) => {
    let formData = undefined
    if (payload.formKey) {
      let formCheck = createAction(uiTypes.INPUTFORM_VALID_CHECK)
      dispatch(formCheck({formKey: payload.formKey}))
      let isFormValid = isInputFormValid(getState(), payload.formKey)
      if (isFormValid && !isFormValid.isValid) {
        if (payload.error) {
          payload.error({message: isFormValid.errMsg})
        }
        return
      }
      formData = getInputFormData(getState(), payload.formKey)
    }
    ImageUtil.batchUploadImgs2(payload.images).then((leanUris) => {
      // if (!leanUris || leanUris == '') {
      //   throw new Error('话题发布失败，请重新发布！')
      // }
      if (leanUris.length != 0) {
        if (formData.topicContent && formData.topicContent.text.length &&
          leanUris && leanUris.length) {
          let contentImgs = leanUris.concat([]).reverse()
          formData.topicContent.text.forEach((value) => {
            if (value.type == 'COMP_IMG' && value.url)
              value.url = contentImgs.pop()
          })
        }
      }
      let updateTopicPayload = {
        title: trim(formData.topicName.text),
        content: JSON.stringify(formData.topicContent.text),
        abstract: trim(formData.topicContent.abstract),
        imgGroup: leanUris,
        categoryId: payload.categoryId,
        topicId: payload.topicId,
      }
      return lcTopics.updateTopic(updateTopicPayload).then((result) => {
        if (payload.success) {
          payload.success()
        }
        let updateAction = createAction(topicActionTypes.FETCH_UPDATE_TOPIC_SUCCESS)
        dispatch(updateAction({topic: result}))
      }).catch((error) => {
        if (payload.error) {
          payload.error(error)
        }
      })
    }, (err)=> {
      throw err
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })

  }
}