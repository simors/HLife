/**
 * Created by yangyang on 2017/3/27.
 */
import {Record, Map, List} from 'immutable'
import {REHYDRATE} from 'redux-persist/constants'
import {Promoter} from '../models/promoterModel'
import * as promoterActionTypes from '../constants/promoterActionTypes'

const initialState = Promoter()

export default function promoterReducer(state = initialState, action) {
  switch (action.type) {
    case promoterActionTypes.GENERATE_INVITE_CODE:
      return handleGenerateInviteCode(state, action)
    case promoterActionTypes.SET_ACTIVE_PROMOTER:
      return handleSetActivePromoter(state, action)
    case promoterActionTypes.UPDATE_PROMOTER_INFO:
      return handleUpdatePromoter(state, action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function handleGenerateInviteCode(state, action) {
  let code = action.payload.code
  state = state.set('inviteCode',  code)
  return state
}

function handleSetActivePromoter(state, action) {
  let promoterId = action.payload.promoterId
  state = state.set('activePromoter', promoterId)
  return state
}

function handleUpdatePromoter(state, action) {
  let promoterId = action.payload.promoterId
  let promoter = action.payload.promoter
  state = state.setIn(['promoters', promoterId], promoter)
  return state
}

function onRehydrate(state, action) {
  var incoming = action.payload.CONFIG
  if (!incoming) return state

  return state
}