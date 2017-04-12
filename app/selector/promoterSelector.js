/**
 * Created by yangyang on 2017/3/27.
 */
import {selectShopDetail} from './shopSelector'

export function inviteCode(state) {
  let code = state.PROMOTER.get('inviteCode')
  return code
}

export function activePromoter(state) {
  let activeId = state.PROMOTER.get('activePromoter')
  return activeId
}

export function getPromoterById(state, id) {
  let promoter = state.PROMOTER.getIn(['promoters', id])
  if (promoter) {
    return promoter.toJS()
  }
  return undefined
}

export function selectPromoterByUserId(state, userId) {
  let promoterId = state.PROMOTER.getIn(['userToPromoter', userId])
  if (promoterId) {
    let promoter = getPromoterById(state, promoterId)
    return promoter
  }
  return undefined
}

export function isPromoterPaid(state, id) {
  let promoter = getPromoterById(state, id)
  if (promoter) {
    return promoter.payment
  }
  return 0
}

export function getTenantFee(state) {
  let fee = state.PROMOTER.get('fee')
  return fee
}

export function getUpPromoterId(state) {
  let upPromoterId = state.PROMOTER.get('upPromoterId')
  return upPromoterId
}

export function getTeamMember(state, promoterId) {
  let team = []
  let teamArray = state.PROMOTER.getIn(['team', promoterId])
  if (!teamArray) {
    return team
  }
  teamArray.forEach((memPromoterId) => {
    let promoter = getPromoterById(state, memPromoterId)
    if (promoter) {
      team.push(promoter)
    }
  })
  return team
}

export function getInvitedShop(state, promoterId) {
  let shops = []
  let shopArray = state.PROMOTER.getIn(['invitedShops', promoterId])
  if (!shopArray) {
    return shops
  }
  shopArray.forEach((shopId) => {
    let shop = selectShopDetail(state, shopId)
    if (shop) {
      shops.push(shop)
    }
  })
  return shops
}

export function selectPromoterIdentity(state, id) {
  let promoter = getPromoterById(state, id)
  if (promoter) {
    return promoter.identity
  }
  return undefined
}