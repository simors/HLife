/**
 * Created by wanpeng on 2017/3/28.
 */
import {createAction} from 'redux-actions'
import * as lcPayment from '../api/leancloud/payment'
import {CREATE_PAYMENT, CREATE_TRANSFERS, IDENTIFY_INFO} from '../constants/paymentActionTypes'

let createPaymentAction = createAction(CREATE_PAYMENT)

export function createPingppPayment(payload) {
  return (dispatch, getState) => {
    paymentPayload = {
      user: payload.user,
      subject: payload.subject,
      order_no: payload.order_no,
      amount: payload.amount,
      channel: payload.channel,
    }
    lcPayment.createPingppPayment(paymentPayload).then((result) => {
      console.log("lcPayment.createPingppPayment return", result)
      if(payload.success) {
        payload.success(result.charge)
      }
      dispatch(createPaymentAction({charge: result.charge}))
    }).catch((error) => {
      if(payload.error) {
        payload.error(error)
      }
    })
  }
}

export function createPingppTransfers(payload) {
  return (dispatch, getState) => {
    transfersPayload = {

    }
    lcPayment.createPingppTransfers(transfersPayload).then((result) => {
      console.log("lcPayment.createPingppTransfers return", result)
      if(payload.success) {
        payload.success(result.charge)
      }
      let createTransfersAction = createAction(CREATE_TRANSFERS)
      dispatch(createTransfersAction({transfers: result.transfers}))
    }).catch((error) => {
      if(payload.error) {
        payload.error(error)
      }
    })
  }
}

export function identifyCardInfo(payload) {
  return (dispatch, getState) => {
    identifyPayload = {

    }
    lcPayment.identifyCardInfo(identifyPayload).then((result) => {
      console.log("lcPayment.identifyCardInfo return", result)
      if(payload.success) {
        payload.success(result.charge)
      }
      let createIdentifyAction = createAction(IDENTIFY_INFO)
      dispatch(createIdentifyAction({}))
    }).catch((error) => {
      if(payload.error) {
        payload.error(error)
      }
    })
  }
}