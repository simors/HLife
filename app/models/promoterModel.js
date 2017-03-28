/**
 * Created by lilu on 2017/1/12.
 */
import {Record, Map, List} from 'immutable'

export const PromoterRecord = Record({
  id: undefined,
  userId: undefined,              // 对应的用户id
  name: undefined,                // 真实姓名
  cardId: undefined,              // 居民身份证号码
  phone: undefined,               // 联系手机号码
  upUser: undefined,              // 推荐人
  address:undefined               // 住址
}, 'PromoterRecord')

export class PromoterInfo extends PromoterRecord {
  static fromLeancloudObject(lcObj) {
    let promoter = new PromoterInfo()
    promoter = promoter.withMutations((record) => {
      record.set('id', lcObj.objectId)
      record.set('userId', lcObj.user.id)
      record.set('name', lcObj.name)
      record.set('cardId', lcObj.cardId)
      record.set('phone', lcObj.phone)
      record.set('upUser', lcObj.upUser.id)
      record.set('address', lcObj.address)
    })
    return promoter
  }
}

export const Promoter = Record({
  activePromoter: undefined,        // 当前推广员id
  inviteCode: undefined,            // 生成的邀请码
  promoters: Map(),                 // 推广员记录，键为推广员id，值为PromoterInfo
}, 'Promoter')

