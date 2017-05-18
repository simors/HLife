/**
 * Created by wanpeng on 2017/3/28.
 */

import {Record, Map, List} from 'immutable'

export const PaymentRecord = Record({
  id_name: undefined, //身份证姓名
  id_number: undefined, //身份证号码
  card_number: undefined, //银行卡号
  phone_number: undefined,  //手机号(11位)
  balance: 0, //余额
  password: false, //支付密码是否设置
  alipay_account: undefined,  //支付宝账号
  open_id: undefined, //微信open_id
  open_bank_code: undefined, //银行代号
  open_bank: undefined, //银行
}, 'PaymentRecord')

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

export const DealRecord = Record({
  cost: undefined,              // 收益金额
  dealType: undefined,          // 收益的类型，1表示邀请推广员，2表示邀请店铺
  shopId: undefined,            // 如果收益类型为邀请店铺，那么这个字段记录被邀请的店铺id
  invitedPromoterId: undefined, // 如果收益类型为邀请推广员，那么这个字段记录被邀请推广员的id
  userId: undefined,            // 如果收益类型为邀请推广员，那么这个字段记录被邀请推广员的用户id
  dealTime: undefined,          // 记录收益时间
})

export class ChargeInfo extends ChargeRecord {
  static fromLeancloudObject(lcObj) {
    return undefined
  }
}

export const Payment = Record({
  payment: List(),
  paymentInfo: PaymentRecord(),
  dealRecords: Map(),
}, 'Payment')