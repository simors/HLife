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
      return destroyTopicDraft
    default:
      return state
  }
}


function updateShopPromotionDraft(state,action){
  let payload = action.payload
  let id = payload.id
  let shopPromotionDraft = payload.shopPromotionDraft
  let _map = state.get('shopPromotions')
  _map = _map.set(id, shopPromotionDraft)
  state = state.set('shopPromotions', _map)
  return state
}


function updateTopicDraft(state,action){
  let payload = action.payload
  console.log('payload',payload)
  let id = payload.id
  let topicDraft = payload.topicDraft
  let _map = state.get('topics')
  _map = _map.set(id, topicDraft)
  state = state.set('topics', _map)
  return state
}

function destroyTopicDraft(state,action){

}

function destroyShopPromotionDraft(state,action){

}