/**
 * Created by wanpeng on 2017/3/28.
 */
import {Map, List} from 'immutable'
import {REHYDRATE} from 'redux-persist/constants'
import * as PaymentActionTypes from '../constants/paymentActionTypes'
import {Payment} from '../models/paymentModel'

const initialState = Payment()

export default function paymentReducer(state = initialState, action) {
  switch (action.type) {
    case PaymentActionTypes.CREATE_PAYMENT:
      return handleCreatePayment(state, action)
    case PaymentActionTypes.CREATE_TRANSFERS:
      return state
    case PaymentActionTypes.ADD_CARD:
      return handleAddCard(state, action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function handleCreatePayment(state, action) {
  return state
}

function handleAddCard(state, action) {
  let cardInfo = action.payload.cardInfo
  if(cardInfo) {
    state = state.set('card', cardInfo)
  }

  return state
}

function onRehydrate(state, action) {
  var incoming = action.payload.PAYMENT
  if(incoming) {
    state = state.set('card', incoming.card)
  }

  return state
}
