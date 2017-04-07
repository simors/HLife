/**
 * Created by wanpeng on 2017/3/28.
 */
import {createAction} from 'redux-actions'
import * as lcPayment from '../api/leancloud/payment'
import {CREATE_PAYMENT} from '../constants/paymentActionTypes'

let createPaymentAction = createAction(CREATE_PAYMENT)

export function createPingppPayment(payload) {
  return (dispatch, getState) => {
    paymentPayload = {
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