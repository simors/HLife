/**
 * Created by yangyang on 2017/3/24.
 */
import AV from 'leancloud-storage'
import ERROR from '../../constants/errorCode'
import * as AVUtils from '../../util/AVUtils'

export function generateInviteCode() {
  return AV.Cloud.run('utilGetInvitationCode').then((result) => {
    return result
  }, (err) => {
    throw err
  })
}

export function promoterCertification(payload) {
  let params = {
    inviteCode: payload.inviteCode,
    name: payload.name,
    phone: payload.phone,
    liveProvince: payload.liveProvince,
    liveCity: payload.liveCity,
    liveDistrict: payload.liveDistrict,
  }
  return AV.Cloud.run('promoterCertificate', params).then((promoterInfo) => {
    return promoterInfo
  }, (err) => {
    throw err
  })
}

export function fetchPromterByUser(payload) {
  let userId = payload.userId
  let params = {
    userId,
  }
  return AV.Cloud.run('promoterFetchByUser', params).then((promoter) => {
    return promoter
  }, (err) => {
    throw err
  })
}

export function getShopTenantFee(payload) {
  let params = {
    province: payload.province,
    city: payload.city,
  }

  return AV.Cloud.run('promoterGetShopTenantByCity', params).then((tenantFee) => {
    return tenantFee.tenant
  }, (err) => {
    throw err
  })
}

export function getPormoterTenant(payload) {
  return AV.Cloud.run('promoterGetPromoterTenant').then((tenantFee) => {
    return tenantFee.tenant
  }, (err) => {
    throw err
  })
}

export function getUpPromoter(payload) {
  let params = {
    userId: payload.userId,
  }
  return AV.Cloud.run('promoterGetUpPromoter', params).then((promoterInfo) => {
    return promoterInfo
  }, (err) => {
    throw err
  })
}