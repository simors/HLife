/**
 * Created by wanpeng on 2017/3/28.
 */
import AV from 'leancloud-storage'
import ERROR from '../../constants/errorCode'
import * as AVUtils from '../../util/AVUtils'
import {PaymentRecord} from '../../models/paymentModel'

export function createPingppPayment(payload) {
  let params = {
    user: payload.user,
    subject: payload.subject,
    order_no: payload.order_no,
    amount: payload.amount,
    channel: payload.channel,
    metadata: payload.metadata
  }

  return AV.Cloud.run('hLifeCreatePayment', params).then((chargeInfo) => {
    return chargeInfo
  }).catch((error) => {
    error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
    throw  error
  })
}

export function createPingppTransfers(payload) {
  console.log("lcPayment.createPingppTransfers payload", payload)
  let params = {
    order_no: payload.order_no,
    amount: payload.amount,
    userName: payload.userName,
    channel: payload.channel,
    metadata: payload.metadata,
    card_number: payload.card_number,
    open_bank_code: payload.open_bank_code,
    open_bank: payload.open_bank
  }

  return AV.Cloud.run('hLifeCreateTransfers', params).then((transfersInfo) => {
    return transfersInfo
  }).catch((error) => {
    error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
    throw error
  })
}

export function identifyCardInfo(payload) {
  let params = {
    userId: payload.userId,
    bankCode: payload.bankCode,
    cardNumber: payload.cardNumber,
    userName: payload.userName,
    idNumber: payload.idNumber,
    phone: payload.phone,
  }
  return AV.Cloud.run('hLifeIdNameCardNumberIdentify', params).then((result) => {
    console.log(result.message)
    return result.result
  }).catch((error) => {
    error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
    throw  error
  })
}

export function getPaymentInfo(payload) {
  let params = {
    userId: payload.userId
  }

  return AV.Cloud.run('hLifeGetPaymentInfoByUserId', params).then((result) => {
    let paymentInfoRecord = PaymentRecord(result)
    return paymentInfoRecord
  }).catch((error) => {
    if(!error.message)
      error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
    throw  error
  })
}

export function setPaymentPassword(payload) {
  let params = {
    userId: payload.userId,
    password: payload.password,
  }
  return AV.Cloud.run('hLifeSetPaymentPassword', params).then((result) => {
    return result
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })

}

export function paymentAuth(payload) {
  let params = {
    userId: payload.userId,
    password: payload.password
  }

  return AV.Cloud.run('hLifePaymentPasswordAuth', params).then((result) => {
    return result
  }).catch((error) => {
    error.message = "密码错误"
    throw  error
  })
}

export function fetchDealRecords(payload) {
  let params = {
    userId: payload.userId,
    limit: payload.limit,
    lastTime: payload.lastTime,
  }

  return AV.Cloud.run('pingPPFetchDealRecords', params).then((result) => {
    return result
  }).catch((error) => {
    throw  error
  })
}