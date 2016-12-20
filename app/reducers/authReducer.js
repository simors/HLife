/**
 * Created by zachary on 2016/12/9.
 */

import * as AuthTypes from '../constants/authActionTypes'
import {REHYDRATE} from 'redux-persist/constants'
import {Map, List} from 'immutable'
const initialState = new Map()

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
  state = state.set('userInfo', userInfo)
  return state
}

function handleLoginSuccess(state, action) {
  const userInfo = action.payload.userInfo
  state = state.set('userInfo', userInfo)
  return state
}

function handleShopCertificationSuccess(state, action) {
  state = state.set('shop',  action.payload)
  return state
}
