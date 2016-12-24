/**
 * Created by yangyang on 2016/12/20.
 */
import {Map} from 'immutable'

export function activeUserId(state) {
  return state.AUTH.activeUser
}

export function getAUTH(state) {
  return state.AUTH.toJS()
}

export function getUserInfo(state) {
  return getAUTH(state).userInfo
}

export function getUserId(state) {
  return getUserInfo(state).id
}