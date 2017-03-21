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