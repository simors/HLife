/**
 * Created by wanpeng on 2017/3/28.
 */

export function getPaymentInfo(state) {
  let paymentInfo = state.PAYMENT.get('paymentInfo')
  return paymentInfo
}