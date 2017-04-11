/**
 * Created by yangyang on 2017/3/27.
 */

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

export function getMyTeam(state) {
  let myTeam = []
  let team = state.PROMOTER.get('myTeam')
  team.forEach((promoterId) => {
    let promoter = getPromoterById(state, promoterId)
    if (promoter) {
      myTeam.push(promoter)
    }
  })
  return myTeam
}