/**
 * Created by zachary on 2016/12/20.
 */
import {Map, List, Record} from 'immutable'

export const ShopRecord = Record({
  id: undefined,
  name: undefined,
  phone: undefined,
  shopName: undefined,
  shopAddress: undefined,
  createdAt: undefined,
  updatedAt: undefined
}, 'ShopRecord')

export class ShopInfo extends ShopRecord {
  static fromLeancloudObject(lcObj) {
    console.log('ShopInfo=', lcObj)
    let shopRecord = new ShopRecord()
    let attrs = lcObj.attributes
    return shopRecord.withMutations((record) => {
      record.set('id', lcObj.id)
      record.set('name', attrs.name)
      record.set('phone', attrs.phone)
      record.set('shopName', attrs.shopName)
      record.set('shopAddress', attrs.shopAddress)
      record.set('createdAt', lcObj.createdAt.toDateString())
      record.set('updatedAt', lcObj.updatedAt.toDateString())
    })
  }
}