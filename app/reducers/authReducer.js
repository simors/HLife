/**
 * Created by zachary on 2016/12/9.
 */

import * as AuthTypes from '../constants/authActionTypes'
import {REHYDRATE} from 'redux-persist/constants'
import {Map, List} from 'immutable'
import {UserState} from '../models/userModels'

const initialState = new UserState()

export default function authReducer(state = initialState, action) {
  switch(action.type) {
    case AuthTypes.REGISTER_SUCCESS:
      return handleRegisterSuccess(state, action)
    case AuthTypes.LOGIN_SUCCESS:
      return handleLoginSuccess(state, action)
    case AuthTypes.SHOP_CERTIFICATION_SUCCESS:
      return handleShopCertificationSuccess(state, action)
    default:
      return state
  }
}

function handleRegisterSuccess(state, action) {
  let userInfo = action.payload.userInfo
  state = state.set('activeUser', userInfo.id)
  state = state.set('token', userInfo.token)
  state = state.setIn(['profiles', userInfo.id], userInfo)
  return state
}

function handleLoginSuccess(state, action) {
  const userInfo = action.payload.userInfo
  state = state.set('activeUser', userInfo.id)
  state = state.set('token', userInfo.token)
  state = state.setIn(['profiles', userInfo.id], userInfo)
  return state
}

function handleShopCertificationSuccess(state, action) {
  state = state.set('shop',  action.payload)
  return state
}
