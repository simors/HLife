/**
 * Created by zachary on 2016/12/9.
 */

import * as AuthTypes from '../constants/authActionTypes'
import {UserState, UserInfo, UserDetail, UserProfile} from '../models/userModels'
import {REHYDRATE} from 'redux-persist/constants'
import {Map, List} from 'immutable'
const initialState = new UserState()

export default function authReducer(state = initialState, action) {
  switch(action.type) {
    case AuthTypes.REGISTER_SUCCESS:
      return handleRegisterSuccess(state, action)
    case AuthTypes.LOGIN_SUCCESS:
      return handleLoginSuccess(state, action)
    default:
      return state
  }
}

function handleRegisterSuccess(state, action) {
  let userInfo = action.payload.userInfo
  if (!state.getIn(['profiles', userInfo.id])) {
    state = state.setIn(['profiles', userInfo.id], new UserProfile())
  }
  state = state.setIn(['profiles', userInfo.id, 'userInfo'], userInfo)
  state = state.set('activeUser', userInfo.id)
  state = state.set('token', action.payload.token)

  return state
}

function handleLoginSuccess(state, action) {
  const userInfo = action.payload.userInfo

  if (!state.getIn(['profiles', userInfo.id])) {
    state = state.setIn(['profiles', userInfo.id], new UserProfile())
  }

  state = state.setIn(['profiles', userInfo.id, 'userInfo'], userInfo)

  const userDetail = action.payload.userDetail
  state = state.setIn(['profiles', userInfo.id, 'userDetail'], userDetail)

  state = state.set('activeUser', userInfo.id)
  state = state.set('token', action.payload.userInfo.token)

  return state
}
