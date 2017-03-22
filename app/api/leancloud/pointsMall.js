/**
 * Created by yangyang on 2017/3/21.
 */
import AV from 'leancloud-storage'

export function getUserPoints(payload) {
  let userId = payload.userId
  let params = {}
  params.userId = userId
  return AV.Cloud.run('pointsGetUserPoint', params).then((UserPoint) => {
    return UserPoint.point
  })
}

export function calUserRegist(payload) {
  let userId = payload.userId
  let params = {}
  params.userId = userId
  return AV.Cloud.run('pointsCalUserRegist', params).then((UserPoint) => {
    return UserPoint.point
  })
}

export function calRegistPromoter(payload) {
  let userId = payload.userId
  let params = {}
  params.userId = userId
  return AV.Cloud.run('pointsCalRegistPromoter', params).then((UserPoint) => {
    return UserPoint.point
  })
}

export function calRegistShoper(payload) {
  let userId = payload.userId
  let params = {}
  params.userId = userId
  return AV.Cloud.run('pointsCalRegistShoper', params).then((UserPoint) => {
    return UserPoint.point
  })
}

export function calPublishTopic(payload) {
  let userId = payload.userId
  let params = {}
  params.userId = userId
  return AV.Cloud.run('pointsCalPublishTopic', params).then((UserPoint) => {
    return UserPoint.point
  })
}

export function calPublishComment(payload) {
  let userId = payload.userId
  let params = {}
  params.userId = userId
  return AV.Cloud.run('pointsCalPublishComment', params).then((UserPoint) => {
    return UserPoint.point
  })
}

export function calPublishActivity(payload) {
  let userId = payload.userId
  let params = {}
  params.userId = userId
  return AV.Cloud.run('pointsCalPublishActivity', params).then((UserPoint) => {
    return UserPoint.point
  })
}

export function calInvitePromoter(payload) {
  let userId = payload.userId
  let params = {}
  params.userId = userId
  return AV.Cloud.run('pointsCalInvitePromoter', params).then((UserPoint) => {
    return UserPoint.point
  })
}

export function calInviteShoper(payload) {
  let userId = payload.userId
  let params = {}
  params.userId = userId
  return AV.Cloud.run('pointsCalInviteShoper', params).then((UserPoint) => {
    return UserPoint.point
  })
}