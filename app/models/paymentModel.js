/**
 * Created by wanpeng on 2017/3/28.
 */

import {Record, Map, List} from 'immutable'

export const ChargeRecord = Record({
  id: undefined,  //Ping++支付对象ID
  createdAt: undefined, //支付创建时的 Unix 时间戳
  paid: undefined,  //是否已付款
  refunded: undefined, //是否存在退款信息，无论退款是否成功
  channel: undefined, //支付使用的第三方支付渠道
  order_no: undefined, //商户订单号
  amount: undefined,  //订单总金额 单位为对应币种的最小货币单位，人民币为分
  currency: undefined, //3 位 ISO 货币代码，人民币为  cny
  subject: undefined, //商品标题
  body: undefined,  //商品描述信息
  time_paid: undefined, //订单支付完成时的 Unix 时间戳
  time_expire: undefined, //订单失效时的 Unix 时间戳
  transaction_no: undefined,  //支付渠道返回的交易流水号
  failure_code: undefined,  //订单的错误码
  credential: undefined,  //支付凭证，用于客户端发起支付
}, 'ChargeRecord')

export class ChargeInfo extends ChargeRecord {
  static fromLeancloudObject(lcObj) {
    return undefined
  }
}

export const Payment = Record({
  payment: List(),
}, 'Payment')