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
    case promoterActionTypes.CLEAR_INVITE_CODE:
      return handleClearInviteCode(state, action)
    case promoterActionTypes.SET_ACTIVE_PROMOTER:
      return handleSetActivePromoter(state, action)
    case promoterActionTypes.SET_USER_PROMOTER_MAP:
      return handleSetUserPromoterMap(state, action)
    case promoterActionTypes.UPDATE_PROMOTER_INFO:
      return handleUpdatePromoter(state, action)
    case promoterActionTypes.UPDATE_TENANT_FEE:
      return handleUpdateTenant(state, action)
    case promoterActionTypes.UPDATE_UPPROMOTER_ID:
      return handleUpdateUpPromoter(state, action)
    case promoterActionTypes.SET_PROMOTER_TEAM:
      return handleSetPromoterTeam(state, action)
    case promoterActionTypes.ADD_PROMOTER_TEAM:
      return handleAddPromoterTeam(state, action)
    case promoterActionTypes.SET_PROMOTER_SHOPS:
      return handleSetPromoterShops(state, action)
    case promoterActionTypes.ADD_PROMOTER_SHOPS:
      return handleAddPromoterShops(state, action)
    case promoterActionTypes.UPDATE_PROMOTER_PERFORMANCE:
      return handleUpdateTotalPerformance(state, action)
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

function handleClearInviteCode(state, action) {
  state = state.set('inviteCode', undefined)
  return state
}

function handleSetActivePromoter(state, action) {
  let promoterId = action.payload.promoterId
  state = state.set('activePromoter', promoterId)
  return state
}

function handleSetUserPromoterMap(state, action) {
  let userId = action.payload.userId
  let promoterId = action.payload.promoterId
  state = state.setIn(['userToPromoter', userId], promoterId)
  return state
}

function handleUpdatePromoter(state, action) {
  let promoterId = action.payload.promoterId
  let promoter = action.payload.promoter
  state = state.setIn(['promoters', promoterId], promoter)
  return state
}

function handleUpdateTenant(state, action) {
  let tenant = action.payload.tenant
  state = state.set('fee', tenant)
  return state
}

function handleUpdateUpPromoter(state, action) {
  let upPromoterId = action.payload.upPromoterId
  state = state.set('upPromoterId', upPromoterId)
  return state
}

function handleSetPromoterTeam(state, action) {
  let team = action.payload.team
  let promoterId = action.payload.promoterId
  state = state.setIn(['team', promoterId], new List(team))
  return state
}

function handleAddPromoterTeam(state, action) {
  let newTeam = action.payload.newTeam
  let promoterId = action.payload.promoterId
  let team = state.getIn(['team', promoterId])
  state = state.setIn(['team', promoterId], team.concat(new List(newTeam)))
  return state
}

function handleSetPromoterShops(state, action) {
  let shops = action.payload.shops
  let promoterId = action.payload.promoterId
  state = state.setIn(['invitedShops', promoterId], new List(shops))
  return state
}

function handleAddPromoterShops(state, action) {
  let newShops = action.payload.newShops
  let promoterId = action.payload.promoterId
  let shops = state.getIn(['invitedShops', promoterId])
  state = state.setIn(['invitedShops', promoterId], shops.concat(new List(newShops)))
  return state
}

function handleUpdateTotalPerformance(state, action) {
  let statistics = action.payload.statistics
  state = state.set('statistics', statistics)
  return state
}

function onRehydrate(state, action) {
  var incoming = action.payload.CONFIG
  if (!incoming) return state

  return state
}