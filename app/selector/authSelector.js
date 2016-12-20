/**
 * Created by yangyang on 2016/12/20.
 */

export function activeUserId(state) {
  return state.AUTH.activeUser
}

export function getUserDetailId(state, userId) {
  let profileMap = state.AUTH.profiles
  let profile = profileMap.get(userId)
  if (profile == undefined) {
    return undefined
  }

  return profile.get('userInfo').get('detailId')
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

export function activeUserInfoById(state) {
  let activeUser = activeUserAndToken(state).activeUser
  return activeUser ? state.AUTH.getUserInfoById(activeUser) : new UserInfo()
}

export function activeUserDetailById(state) {
  let activeUser = activeUserAndToken(state).activeUser
  return activeUser ? state.AUTH.getUserDetailById(activeUser) : new UserDetail()
}

export function userInfoById(state, userId) {
  return state.AUTH ? state.AUTH.getUserInfoById(userId) : new UserInfo()
}

export function userDetailById(state, userId) {
  return state.AUTH ? state.AUTH.getUserDetailById(userId) : new UserDetail()
}