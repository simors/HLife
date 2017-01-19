/**
 * Created by yangyang on 2016/12/20.
 */
import {Map} from 'immutable'
import {UserInfo} from '../models/userModels'

export function activeUserId(state) {
  return state.AUTH.activeUser
}

export function activeUserAndToken(state) {
  return {
    token: state.AUTH ? state.AUTH.token : undefined,
    activeUser: state.AUTH ? state.AUTH.activeUser : undefined,
  }
}

export function isUserLogined(state) {
  let activeUser = activeUserAndToken(state).activeUser
  return activeUser ? true : false
}

export function userInfoById(state, userId) {
  return state.AUTH ? state.AUTH.getUserInfoById(userId) : new UserInfo()
}

export function activeUserInfo(state) {
  let activeUser = activeUserId(state)
  return activeUser ? state.AUTH.getUserInfoById(activeUser) : new UserInfo()
}

export function selectUserFollowees(state) {
  let activeUser = activeUserAndToken(state).activeUser
  let userFollowees = state.AUTH.followees.get(activeUser)
  return userFollowees ? userFollowees.toJS() : []
}

export function selectUserFollowers(state) {
  let userFollowers = state.AUTH.followers
  return userFollowers ? userFollowers.toJS() : []
}
export function selectUserFollowersTotalCount(state) {
  return state.AUTH.followersTotalCount
}

export function getHealthProfileSize(state) {
  return state.AUTH.healthProfiles? state.AUTH.healthProfiles.size : 0
}

export function selectUserFavoriteArticles(state) {
  let activeUser = activeUserAndToken(state).activeUser
  let userFavoriteArticles = state.AUTH.favoriteArticles.get(activeUser)
  return userFavoriteArticles ? userFavoriteArticles.toJS() : []
}

export function getHealthProfileList(state) {
  let healthProfileList = []
  let healthProfileMap = state.AUTH.get('healthProfiles')
  if (healthProfileMap) {
    healthProfileMap.forEach((value) => {
      healthProfileList.push(value)
    })
  }
  return healthProfileList
}