/**
 * Created by lilu on 2017/1/12.
 */
import {Record, Map, List} from 'immutable'

export const PromoterRecord = Record({
  name:           undefined, //真实姓名
  cardId:             undefined, //居民身份证号码
  phone:          undefined, //联系手机号码
 // desc:           undefined, //备注
 // upUser: undefined,
  id:undefined,
  level:undefined,
  address:undefined
}, 'PromoterRecord')

export class PromoterInfo extends PromoterRecord {
  static fromLeancloudObject(lcObj) {
    let promoter = new PromoterInfo()
    let attrs = lcObj.attributes
    promoter= promoter.withMutations((record) => {
      record.set('name', attrs.name)
      record.set('cardId', attrs.cardId)
      console.log('promoter=====>',promoter)

      record.set('phone', attrs.phone)
  //    record.set('upUser', attrs.upUser)
      record.set('id', lcObj.id)
      record.set('level', attrs.level)
      record.set('address', attrs.address)
    })
    return promoter
  }
}

export const Promoter = Record({
  promoter: Map(),
  // likerList: Map(),
}, 'Promoter')

