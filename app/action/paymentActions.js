/**
 * Created by wanpeng on 2017/3/28.
 */
import {createAction} from 'redux-actions'
import * as lcPayment from '../api/leancloud/payment'
import {CREATE_PAYMENT, CREATE_TRANSFERS, ADD_CARD} from '../constants/paymentActionTypes'
import * as uiTypes from '../constants/uiActionTypes'
import {getInputFormData, isInputFormValid} from '../selector/inputFormSelector'



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
  console.log("identifyCardInfo payload", payload)
  return (dispatch, getState) => {
    let formCheck = createAction(uiTypes.INPUTFORM_VALID_CHECK)
    dispatch(formCheck({formKey: payload.formKey}))
    let isFormValid = isInputFormValid(getState(), payload.formKey)
    if (!isFormValid.isValid) {
      if (payload.error) {
        payload.error({message: isFormValid.errMsg})
      }
      return
    }
    const formData = getInputFormData(getState(), payload.formKey)
    identifyPayload = {
      userId: payload.userId,
      bankCode: payload.bankCode,
      cardNumber: payload.cardNumber,
      userName: formData.userNameInput.text,
      idNumber: formData.idNumberInput.text,
      phone: formData.phoneInput.text,
    }
    lcPayment.identifyCardInfo(identifyPayload).then((result) => {
      console.log("lcPayment.identifyCardInfo return", result)
      if(payload.success) {
        payload.success()
      }
      let createAddCardAction = createAction(ADD_CARD)
      dispatch(createAddCardAction({cardInfo: result.data}))
    }).catch((error) => {
      if(payload.error) {
        payload.error(error)
      }
    })
  }
}