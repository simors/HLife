/**
 * Created by yangyang on 2016/12/20.
 */
import {Map} from 'immutable'
import {UserInfo} from '../models/userModels'
import {DoctorInfo} from '../models/doctorModel'

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

export function activeDoctorInfo(state) {
  return state.DOCTOR.get('doctor')? state.DOCTOR.get('doctor'): new DoctorInfo()
}