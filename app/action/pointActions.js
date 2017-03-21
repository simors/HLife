/**
 * Created by yangyang on 2017/3/21.
 */
import {createAction} from 'redux-actions'
import * as lcPoints from '../api/leancloud/pointsMall'
import {activeUserId} from '../selector/authSelector'
import {UPDATE_USER_POINT} from '../constants/authActionTypes'

let updateUserPoint = createAction(UPDATE_USER_POINT)

export function fetchUserPoint(payload) {
  return (dispatch, getState) => {
    let userId = activeUserId(getState())
    lcPoints.getUserPoints({userId}).then((point) => {
      dispatch(updateUserPoint({userId, point}))
    })
  }
}

export function calUserRegist(payload) {
  return (dispatch, getState) => {
    let userId = payload.userId
    lcPoints.calUserRegist({userId}).then((point) => {
      dispatch(updateUserPoint({userId, point}))
    })
  }
}

export function calRegistPromoter(payload) {
  return (dispatch, getState) => {
    let userId = payload.userId
    lcPoints.calRegistPromoter({userId}).then((point) => {
      dispatch(updateUserPoint({userId, point}))
    })
  }
}

export function calRegistShoper(payload) {
  return (dispatch, getState) => {
    let userId = payload.userId
    lcPoints.calRegistShoper({userId}).then((point) => {
      dispatch(updateUserPoint({userId, point}))
    })
  }
}

export function calPublishTopic(payload) {
  return (dispatch, getState) => {
    let userId = payload.userId
    lcPoints.calPublishTopic({userId}).then((point) => {
      dispatch(updateUserPoint({userId, point}))
    })
  }
}

export function calPublishComment(payload) {
  return (dispatch, getState) => {
    let userId = payload.userId
    lcPoints.calPublishComment({userId}).then((point) => {
      dispatch(updateUserPoint({userId, point}))
    })
  }
}

export function calPublishActivity(payload) {
  return (dispatch, getState) => {
    let userId = payload.userId
    lcPoints.calPublishActivity({userId}).then((point) => {
      dispatch(updateUserPoint({userId, point}))
    })
  }
}

export function calInvitePromoter(payload) {
  return (dispatch, getState) => {
    let userId = payload.userId
    lcPoints.calInvitePromoter({userId}).then((point) => {
      dispatch(updateUserPoint({userId, point}))
    })
  }
}

export function calInviteShoper(payload) {
  return (dispatch, getState) => {
    let userId = payload.userId
    lcPoints.calInviteShoper({userId}).then((point) => {
      dispatch(updateUserPoint({userId, point}))
    })
  }
}