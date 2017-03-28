/**
 * Created by yangyang on 2017/3/27.
 */

export function inviteCode(state) {
  let code = state.PROMOTER.get('inviteCode')
  return code
}

export function getPromoterById(state, id) {
  let promoter = state.PROMOTER.getIn(['promoters', id])
  if (promoter) {
    return promoter.toJS()
  }
  return undefined
}