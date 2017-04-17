/**
 * Created by wanpeng on 2017/3/28.
 */
import AV from 'leancloud-storage'
import ERROR from '../../constants/errorCode'
import * as AVUtils from '../../util/AVUtils'

export function createPingppPayment(payload) {
  let params = {
    user: payload.user,
    subject: payload.subject,
    order_no: payload.order_no,
    amount: payload.amount,
    channel: payload.channel,
  }

  return AV.Cloud.run('hLifeCreatePayment', params).then((chargeInfo) => {
    return chargeInfo
  }).catch((error) => {
    error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
    throw  error
  })
}

export function createPingppTransfers(payload) {
  let params = {
    order_no: payload.order_no,
    amount: payload.amount,
    cardNumber: payload.cardNumber,
    userName: payload.userName,
  }

  return AV.Cloud.run('hLifeCreateTransfers', params).then((transfersInfo) => {
    return transfersInfo
  }).catch((error) => {
    error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
    throw  error
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