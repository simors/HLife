/**
 * Created by zachary on 2016/12/9.
 */

import * as AuthTypes from '../constants/authActionTypes'
import {REHYDRATE} from 'redux-persist/constants'
import {Map, List} from 'immutable'
import {UserState, UserInfo} from '../models/userModels'


const initialState = new UserState()

export default function authReducer(state = initialState, action) {
  switch(action.type) {
    case AuthTypes.REGISTER_SUCCESS:
      return handleRegisterSuccess(state, action)
    case AuthTypes.LOGIN_SUCCESS:
      return handleLoginSuccess(state, action)
    case AuthTypes.SHOP_CERTIFICATION_SUCCESS:
      return handleShopCertificationSuccess(state, action)
    case AuthTypes.PROFILE_SUBMIT_SUCCESS:
      return handleProfileSubmitSuccess(state, action)
    case AuthTypes.ADD_USER_PROFILE:
      return handleAddUserProfile(state, action)
    case AuthTypes.FETCH_USER_FOLLOWEES_SUCCESS:
      return handleFetchUserFolloweesSuccess(state, action)
    case AuthTypes.FETCH_USER_FAVORITEARTICLE_SUCCESS:
      return handleFetchUserFavoriteArticleSuccess(state,action)
    case REHYDRATE:
      return onRehydrate(state, action)
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
  state = state.set('activeUser', userInfo.get('id'))
  state = state.set('token', userInfo.get('token'))
  state = state.setIn(['profiles', userInfo.id], userInfo)
  return state
}

function handleShopCertificationSuccess(state, action) {
  let payload = action.payload
  let shop = payload.shop
  state = state.set('shop',  shop)
  return state
}

function handleProfileSubmitSuccess(state, action) {
  let userInfo = action.payload.userInfo

  state = state.setIn(['profiles', userInfo.id], userInfo)
  return state
}

function handleAddUserProfile(state, action) {
  let userInfo = action.payload.userInfo
  state = state.setIn(['profiles', userInfo.id], userInfo)
  return state
}

function handleFetchUserFolloweesSuccess(state, action) {
  let currentUserId = action.payload.currentUserId
  let followees = action.payload.followees
  state = state.setIn(['followees', currentUserId], followees)
  return state
}

function handleFetchUserFavoriteArticleSuccess(state,action){
  let currentUserId = action.payload.currentUserId
  let favoriteArticles = action.payload.favoriteArticles
  state = state.setIn(['favoriteArticles',currentUserId],favoriteArticles)
  return state
}

function onRehydrate(state, action) {
  var incoming = action.payload.AUTH
  if (incoming) {
    if (!incoming.activeUser) {
      return state
    }
    state = state.set('activeUser', incoming.activeUser)
    state = state.set('token', incoming.token)

    const profiles = Map(incoming.profiles)
    try {
      for (let [userId, profile] of profiles) {
        if (userId && profile) {
          const userInfo = new UserInfo({...profile})
          state = state.setIn(['profiles', userId], userInfo)
        }
      }
    } catch (e) {
      profiles.clear()
    }
  }
  return state
}