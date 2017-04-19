/**
 * Created by wanpeng on 2017/3/28.
 */
import {createAction} from 'redux-actions'
import * as lcPayment from '../api/leancloud/payment'
import {CREATE_PAYMENT, CREATE_TRANSFERS, ADD_CARD, GET_PAYMENTINFO, SET_PASSWORD} from '../constants/paymentActionTypes'
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

    console.log("createPingppTransfers payload", payload)
    console.log("createPingppTransfers formData", formData)

    let authPayload = {
      userId: payload.userId,
      password: formData.passwordInput.text,
    }

    lcPayment.paymentAuth(authPayload).then(() => {
      let transfersPayload = {
        userId: payload.userId,
        order_no: payload.order_no,
        amount: formData.amountInput.text,
        account:formData.accountInput.text,
        userName: formData.nameInput.text,
        channel: payload.channel,
      }
      return lcPayment.createPingppTransfers(transfersPayload)
    }).then((result) => {
      console.log("lcPayment.createPingppTransfers return", result)
      if(payload.success) {
        payload.success()
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

export function fetchPaymentInfo(payload) {
  return (dispatch, getState) => {
    lcPayment.getPaymentInfo(payload).then((result) => {
      if(payload.success) {
        payload.success()
      }
      let getPaymentInfoAction = createAction(GET_PAYMENTINFO)
      dispatch(getPaymentInfoAction({paymentInfo: result}))
    }).catch((error) => {
      console.log("fetchPaymentInfo error", error)
      if(payload.error) {
        payload.error(error)
      }
    })
  }
}


export function setPaymentPassword(payload) {
  return (dispatch, getState) => {
    lcPayment.setPaymentPassword(payload).then((result) => {
      console.log("setPaymentPassword result", result)
      if (payload.success) {
        payload.success()
      }
      let setPasswordAction =createAction(SET_PASSWORD)
      dispatch(setPasswordAction({}))
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}