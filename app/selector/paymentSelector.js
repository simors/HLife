/**
 * Created by wanpeng on 2017/3/28.
 */

export function getPaymentInfo(state) {
  let cardInfo = state.PAYMENT.get('paymentInfo')
  return cardInfo
}