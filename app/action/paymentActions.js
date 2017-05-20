/**
 * Created by wanpeng on 2017/3/28.
 */
import {createAction} from 'redux-actions'
import * as lcPayment from '../api/leancloud/payment'
import {CREATE_PAYMENT, CREATE_TRANSFERS, ADD_CARD, GET_PAYMENTINFO, SET_PASSWORD} from '../constants/paymentActionTypes'
import * as uiTypes from '../constants/uiActionTypes'
import {getInputFormData, isInputFormValid} from '../selector/inputFormSelector'
import {UserInfo} from '../models/userModels'
import {ShopInfo} from '../models/shopModel'
import {PromoterInfo} from '../models/promoterModel'
import * as shopActionTypes from '../constants/shopActionTypes'
import * as AuthTypes from '../constants/authActionTypes'
import * as promoterActionTypes from '../constants/promoterActionTypes'
import * as paymentActionTypes from '../constants/paymentActionTypes'
import {activeUserId} from '../selector/authSelector'

let createPaymentAction = createAction(CREATE_PAYMENT)
let addShopDetail = createAction(shopActionTypes.FETCH_SHOP_DETAIL_SUCCESS)
let addUserProfile = createAction(AuthTypes.ADD_USER_PROFILE)
let setUserPromoterMap = createAction(promoterActionTypes.SET_USER_PROMOTER_MAP)
let updatePromoter = createAction(promoterActionTypes.UPDATE_PROMOTER_INFO)
let setUserDealRecords = createAction(paymentActionTypes.SET_DEAL_RECORDS)
let addUserDealRecords = createAction(paymentActionTypes.ADD_DEAL_RECORDS)

export function createPingppPayment(payload) {
  return (dispatch, getState) => {
    paymentPayload = {
      user: payload.user,
      subject: payload.subject,
      order_no: payload.order_no,
      amount: payload.amount,
      channel: payload.channel,
      metadata: payload.metadata
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
      userId: payload.metadata.userId,
      password: formData.passwordInput.text,
    }

    lcPayment.paymentAuth(authPayload).then(() => {
      let transfersPayload = {
        order_no: payload.order_no,
        amount: formData.amountInput.text,
        card_number:formData.accountInput.text,
        userName: formData.nameInput.text,
        channel: payload.channel,
        metadata: payload.metadata,
        open_bank_code: formData.bankCodeInput.text.open_bank_code,
        open_bank: formData.bankCodeInput.text.open_bank,
      }
      return lcPayment.createPingppTransfers(transfersPayload)
    }).then((result) => {
      console.log("lcPayment.createPingppTransfers return", result)
      if(payload.success) {
        payload.success()
      }
      let createTransfersAction = createAction(CREATE_TRANSFERS)
      dispatch(createTransfersAction({transfers: result.transfers}))
    }, function (error) {
      if(payload.error) {
        payload.error(error)
      }
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

export function getUserDealRecords(payload) {
  return (dispatch, getState) => {
    let more = payload.more
    if (!more) {
      more = false
    }
    lcPayment.fetchDealRecords(payload).then((records) => {
      console.log('records:', records)
      let deals = records.dealRecords
      let dealRecords = []
      deals.forEach((record) => {
        let dealRecord = {}
        dealRecord.cost = record.cost
        dealRecord.dealType = record.dealType
        dealRecord.dealTime = record.dealTime
        if (record.dealType == 2) {
          dealRecord.shopId = record.shop.objectId
          let shop = record.shop
          let shopRecord = ShopInfo.fromLeancloudApi(shop)
          dispatch(addShopDetail({id: shop.objectId, shopInfo: shopRecord}))
        } else if (record.dealType == 1) {
          dealRecord.invitedPromoterId = record.promoter.objectId
          dealRecord.userId = record.user.id
          let promoter = record.promoter
          let promoterRecord = PromoterInfo.fromLeancloudObject(promoter)
          dispatch(updatePromoter({promoterId: record.promoter.objectId, promoter: promoterRecord}))
          dispatch(setUserPromoterMap({userId: promoter.user.id, promoterId: record.promoter.objectId}))
          let user = record.user
          let userInfo = UserInfo.fromLeancloudApi(user)
          dispatch(addUserProfile({userInfo}))
        } else if (record.dealType == 5) {
          dealRecord.userId = record.user.id
          let user = record.user
          let userInfo = UserInfo.fromLeancloudApi(user)
          dispatch(addUserProfile({userInfo}))
        } else {
          dealRecord.userId = record.user.id
          let user = record.user
          let userInfo = UserInfo.fromLeancloudApi(user)
          dispatch(addUserProfile({userInfo}))
        }
        dealRecords.push(dealRecord)
      })
      if (more) {
        dispatch(addUserDealRecords({userId: activeUserId(getState()), dealRecords: dealRecords}))
      } else {
        dispatch(setUserDealRecords({userId: activeUserId(getState()), dealRecords: dealRecords}))
      }
      if (payload.success) {
        payload.success(dealRecords.length == 0)
      }
    }).catch((err) => {
      if (payload.error) {
        payload.error(err.message)
      }
    })
  }
}