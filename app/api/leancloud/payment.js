/**
 * Created by wanpeng on 2017/3/28.
 */
import AV from 'leancloud-storage'
import ERROR from '../../constants/errorCode'
import * as AVUtils from '../../util/AVUtils'

export function createPingppPayment(payload) {
  let params = {
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