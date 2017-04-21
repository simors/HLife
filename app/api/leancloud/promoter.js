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

export function getMyPromoterTeam(payload) {
  let params = {
    limit: payload.limit,
    lastUpdatedAt: payload.lastUpdatedAt,
  }
  return AV.Cloud.run('promoterGetPromoterTeam', params).then((result) => {
    return {promoters: result.promoters, users: result.users}
  }, (err) => {
    throw err
  })
}

export function getPromoterTeamById(payload) {
  let params = {
    limit: payload.limit,
    promoterId: payload.promoterId,
    lastUpdatedAt: payload.lastUpdatedAt,
  }
  return AV.Cloud.run('promoterGetPromoterTeamById', params).then((result) => {
    return {promoters: result.promoters, users: result.users}
  }, (err) => {
    throw err
  })
}

export function getMyInvitedShops(payload) {
  let params = {
    limit: payload.limit,
    lastCreatedAt: payload.lastCreatedAt,
  }
  return AV.Cloud.run('promoterGetPromoterShops', params).then((result) => {
    return result.shops
  }, (err) => {
    throw err
  })
}

export function getTotalPerformance(payload) {
  let params = {
    province: payload.province,
    city: payload.city,
    district: payload.district,
  }
  return AV.Cloud.run('promoterGetTotalPerformance', params).then((result) => {
    return result
  }, (err) => {
    throw err
  })
}

export function getAreaAgents(payload) {
  let params = {
    identity: payload.identity,
    province: payload.province,
    city: payload.city,
  }
  return AV.Cloud.run('promoterGetAreaAgentManager', params).then((result) => {
    return result
  }, (err) => {
    throw err
  })
}

export function setCityShopTenant(payload) {
  let params = {
    province: payload.province,
    city: payload.city,
    fee: payload.fee,
  }
  return AV.Cloud.run('promoterSetShopTenant', params).then((tenant) => {
    return tenant
  }, (err) => {
    throw err
  })
}

export function getCityShopTenant(payload) {
  let params = {
    province: payload.province,
    city: payload.city,
  }
  return AV.Cloud.run('promoterGetShopTenantByCity', params).then((tenant) => {
    return tenant
  }, (err) => {
    throw err
  })
}

export function fetchPromoterByArea(payload) {
  let params = {
    liveProvince: payload.liveProvince,
    liveCity: payload.liveCity,
    maxShopEarnings: payload.maxShopEarnings,
    maxRoyaltyEarngings: payload.maxRoyaltyEarngings,
    lastTime: payload.lastTime,
  }
  return AV.Cloud.run('promoterFetchNonAgentPromoter', params).then((result) => {
    return result
  }, (err) => {
    throw err
  })
}

export function setAreaAgent(payload) {
  let params = {
    promoterId: payload.promoterId,
    identity: payload.identity,
    province: payload.province,
    city: payload.city,
    district: payload.district,
  }
  return AV.Cloud.run('promoterSetAgent', params).then((result) => {
    return result
  }, (err) => {
    throw err
  })
}

export function cancelAreaAgent(payload) {
  let params = {
    promoterId: payload.promoterId,
  }
  return AV.Cloud.run('promoterCancelAgent', params).then((result) => {
    return result
  }, (err) => {
    throw err
  })
}

export function fetchPromoterByNameOrId(payload) {
  let params = {
    keyword: payload.keyword,
  }
  return AV.Cloud.run('promoterGetPromoterByNameOrId', params).then((result) => {
    return result
  }, (err) => {
    throw err
  })
}

export function fetchPromoterDealRecords(payload) {
  let params = {
    promoterId: payload.promoterId,
    limit: payload.limit,
    lastTime: payload.lastTime,
  }
  return AV.Cloud.run('promoterGetEarningRecords', params).then((result) => {
    return result
  }, (err) => {
    throw err
  })
}