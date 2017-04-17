/**
 * Created by wanpeng on 2017/3/28.
 */

export function getPaymentCard(state) {
  let cardInfo = state.PAYMENT.get('card')
  return cardInfo
}