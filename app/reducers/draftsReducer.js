/**
 * Created by lilu on 2017/4/13.
 */
import {Record, Map, List} from 'immutable'
import {REHYDRATE} from 'redux-persist/constants'
import {Drafts} from '../models/draftsModels'
import * as draftActionTypes from '../constants/draftActionTypes'
const initialState = Drafts()

export default function draftsReducer(state = initialState, action) {
  switch (action.type) {
    case draftActionTypes.UPDATE_SHOP_PROMOTION_DRAFT:
      return updateShopPromotionDraft(state, action)
    case draftActionTypes.UPDATE_TOPIC_DRAFT:
      return updateTopicDraft(state, action)
    case draftActionTypes.DESTROY_SHOP_PROMOTION_DRAFT:
      return destroyShopPromotionDraft(state,action)
    case draftActionTypes.DESTROY_TOPIC_DRAFT:
      return destroyTopicDraft(state,action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}


function updateShopPromotionDraft(state,action){
  let payload = action.payload
  console.log('payload======>',payload)
  let id = payload.id
  let data = {...payload}
  let _map = state.get('shopPromotions')
  _map = _map.set(id, data)
  state = state.set('shopPromotions', _map)
  return state
}


function updateTopicDraft(state,action){
  let payload = action.payload
  console.log('payload',payload)
  let id = payload.id
  // let topicDraft = payload.topicDraft
  // let draftD = payload.draftDate
  // let images = payload.images
  // let categoryId = payload.categoryId
  // let city = payload.city
  let data = {...payload}
  let _map = state.get('topics')
  _map = _map.set(id, data)
  state = state.set('topics', _map)
  return state
}

function destroyTopicDraft(state,action){
  let payload = action.payload
  let id = payload.id
  console.log('id',id)
  let _map = state.get('topics')
  _map = _map.delete(id)
  state  = state.set('topics',_map)
  return state
}

function destroyShopPromotionDraft(state,action){
  let payload = action.payload
  let id = payload.id
  let _map = state.get('shopPromotions')
  _map = _map.delete(id)
  state  = state.set('shopPromotions',_map)
  return state
}


function onRehydrate(state, action) {
  let incoming = action.payload.DRAFTS
  console.log('incoming',incoming)
  if(incoming){
      let topics = Map(incoming.topics)
      let shopPromotions = Map(incoming.shopPromotions)
      state = state.set('topics',topics)
      state = state.set('shopPromotions',shopPromotions)
  }

  return state
}