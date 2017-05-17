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
    case  uiTypes.SEARCH_CLEAR:
      return handleClearResult(state, action)
    case uiTypes.SEARCH_USER:
      return handleUpdateUserResult(state, action)
    case uiTypes.SEARCH_USER_CLEAR:
      return handleClearUserResult(state, action)
    case uiTypes.SEARCH_SHOP:
      return handleUpdateShopResult(state, action)
    case uiTypes.SEARCH_SHOP_CLEAR:
      return handleClearShopResult(state, action)
    case uiTypes.SEARCH_TOPIC:
      return handleUpdateTopicResult(state, action)
    case uiTypes.SEARCH_TOPIC_CLEAR:
      return handleClearTopicResult(state, action)
    default:
      return state
  }
}

function handleClearResult(state, action) {
  state = state.setIn(['user', 'hits'], 0)
  state = state.setIn(['user', 'results'], [])
  state = state.setIn(['user', 'sid'], '')

  state = state.setIn(['shop', 'hits'], 0)
  state = state.setIn(['shop', 'results'], [])
  state = state.setIn(['shop', 'sid'], '')

  state = state.setIn(['topic', 'hits'], 0)
  state = state.setIn(['topic', 'results'], [])
  state = state.setIn(['topic', 'sid'], '')
  return state
}

function handleClearUserResult(state, action) {
  state = state.setIn(['user', 'hits'], 0)
  state = state.setIn(['user', 'results'], [])
  state = state.setIn(['user', 'sid'], '')

  return state
}

function handleClearShopResult(state, action) {
  state = state.setIn(['shop', 'hits'], 0)
  state = state.setIn(['shop', 'results'], [])
  state = state.setIn(['shop', 'sid'], '')

  return state
}

function handleClearTopicResult(state, action) {
  state = state.setIn(['topic', 'hits'], 0)
  state = state.setIn(['topic', 'results'], [])
  state = state.setIn(['topic', 'sid'], '')
  return state
}

function handleUpdateUserResult(state, action) {
  let payload = action.payload
  let results = state.getIn(['user', 'results'])
  if(payload.hits) {
    state = state.setIn(['user', 'hits'], payload.hits)
  }
  if(payload.users) {
    results = results.concat(payload.users)
    state = state.setIn(['user', 'results'], results)
  }
  if(payload.sid) {
    state = state.setIn(['user', 'sid'], payload.sid)
  }
  return state
}


function handleUpdateShopResult(state, action) {
  let payload = action.payload
  let results = state.getIn(['shop', 'results'])

  if(payload.hits) {
    state = state.setIn(['shop', 'hits'], payload.hits)
  }
  if(payload.shops) {
    results = results.concat(payload.shops)
    state = state.setIn(['shop', 'results'], results)
  }
  if(payload.sid) {
    state = state.setIn(['shop', 'sid'], payload.sid)
  }
  return state
}

function handleUpdateTopicResult(state, action) {
  let payload = action.payload
  let results = state.getIn(['topic', 'results'])

  if(payload.hits) {
    state = state.setIn(['topic', 'hits'], payload.hits)
  }
  if(payload.topics) {
    results = results.concat(payload.topics)
    state = state.setIn(['topic', 'results'], results)
  }
  if(payload.sid) {
    state = state.setIn(['topic', 'sid'], payload.sid)
  }
  return state
}