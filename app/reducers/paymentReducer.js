/**
 * Created by wanpeng on 2017/3/28.
 */
import {Map, List, Record} from 'immutable'
import {REHYDRATE} from 'redux-persist/constants'
import * as PaymentActionTypes from '../constants/paymentActionTypes'
import {Payment, PaymentRecord} from '../models/paymentModel'

const initialState = Payment()

export default function paymentReducer(state = initialState, action) {
  switch (action.type) {
    case PaymentActionTypes.CREATE_PAYMENT:
      return handleCreatePayment(state, action)
    case PaymentActionTypes.CREATE_TRANSFERS:
      return state
    case PaymentActionTypes.ADD_CARD:
      return handleAddCard(state, action)
    case PaymentActionTypes.GET_PAYMENTINFO:
      return handleGetBalance(state, action)
    case PaymentActionTypes.SET_PASSWORD:
      return handleSetPassword(state, action)
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
    state = state.set('paymentInfo', cardInfo)
  }

  return state
}

function handleGetBalance(state, action) {
  record = action.payload.paymentInfo
  if(record)
    state = state.set('paymentInfo', record)
  return state
}

function handleSetPassword(state, action) {
  let record = state.get('paymentInfo')
  record = record.set('password', true)
  state = state.set('paymentInfo', record)
  return state
}

function onRehydrate(state, action) {
  var incoming = action.payload.PAYMENT
  if(incoming && incoming.paymentInfo) {
    let paymentInfo = incoming.paymentInfo
    state = state.set('paymentInfo', PaymentRecord(paymentInfo))
  }

  return state
}
