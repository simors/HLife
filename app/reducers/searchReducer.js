/**
 * Created by wanpeng on 2017/5/11.
 */
import {Record, Map, List} from 'immutable'
import * as uiTypes from '../constants/uiActionTypes'
import {Search} from '../models/SearchModels'


const initialState = Search()


export default function
  searchReducer(state = initialState, action) {
  switch (action.type) {
    case uiTypes.SEARCH_ALL:
      return
    case uiTypes.SEARCH_USER:
      return handleUpdateUserResult(state, action)
    case uiTypes.SEARCH_SHOP:
      return handleUpdateShopResult(state, action)
    case uiTypes.SEARCH_TOPIC:
      return handleUpdateTopicResult(state, action)
    default:
      return state
  }
}

function handleUpdateUserResult(state, action) {
  let payload = action.payload
  if(payload.hits) {
    state = state.setIn(['user', 'hits'], payload.hits)
  }
  if(payload.users) {
    state = state.setIn(['user', 'results'], payload.users)
  }
  if(payload.sid) {
    state = state.setIn(['user', 'sid'], payload.sid)
  }
  return state
}


function handleUpdateShopResult(state, action) {
  let payload = action.payload
  if(payload.hits) {
    state = state.setIn(['shop', 'hits'], payload.hits)
  }
  if(payload.shops) {
    state = state.setIn(['shop', 'results'], payload.shops)
  }
  if(payload.sid) {
    state = state.setIn(['shop', 'sid'], payload.sid)
  }
  return state
}

function handleUpdateTopicResult(state, action) {
  let payload = action.payload
  if(payload.hits) {
    state = state.setIn(['topic', 'hits'], payload.hits)
  }
  if(payload.topics) {
    state = state.setIn(['topic', 'results'], payload.topics)
  }
  if(payload.sid) {
    state = state.setIn(['topic', 'sid'], payload.sid)
  }
  return state
}