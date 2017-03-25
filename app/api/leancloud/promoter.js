/**
 * Created by yangyang on 2017/3/24.
 */
import AV from 'leancloud-storage'
import ERROR from '../../constants/errorCode'
import * as AVUtils from '../../util/AVUtils'

export function promoterCertification(payload) {
  let params = {
    inviteCode: payload.inviteCode,
    name: payload.name,
    phone: payload.phone,
    cardId: payload.cardId,
    address: payload.address,
  }
  return AV.Cloud.run('promoterCertificate', params).then((promoterInfo) => {
    return promoterInfo
  }, (err) => {
    throw err
  })
}