/**
 * Created by wanpeng on 2017/3/28.
 */
import {selectShopDetail} from './shopSelector'
import {selectUserInfoById} from './authSelector'
import {getPromoterById} from './promoterSelector'

export function getPaymentInfo(state) {
  let paymentInfo = state.PAYMENT.get('paymentInfo')
  return paymentInfo
}

export function selectPaymentDealRecords(state, userId) {
  let recordsList = state.PAYMENT.getIn(['dealRecords', userId])
  if (!recordsList) {
    return []
  }
  let earnRecords = []
  let records = recordsList.toJS()
  records.forEach((record) => {
    let deal = {}
    deal.cost = record.cost
    deal.dealType = record.dealType
    deal.shop = selectShopDetail(state, record.shopId)
    deal.promoter = getPromoterById(state, record.invitedPromoterId)
    deal.user = selectUserInfoById(state, record.userId)
    deal.dealTime = record.dealTime
    earnRecords.push(deal)
  })
  return earnRecords
}