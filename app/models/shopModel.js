/**
 * Created by zachary on 2016/12/20.
 */
import {Map, List, Record} from 'immutable'
import AV from 'leancloud-storage'

export const ShopRecord = Record({
  id: undefined,
  name: undefined,  //店主姓名
  phone: undefined, //店主电话
  shopName: undefined, //店铺名称
  shopAddress: undefined,//店铺地址
  coverUrl: undefined, //店铺封面图片地址
  contactNumber: undefined, //店铺联系电话（客服电话）
  targetShopCategory: {}, //店铺所属分类信息
  geo:[], //店铺地理坐标
  distance: undefined, //用户与店铺的距离
  geoName: undefined, //店铺地理坐标对应城市区域名称
  pv: 1000, //店铺点击量
  score: 4.5, //店铺评分
  album: [], //店铺相册
  createdAt: undefined, //创建时间戳
  updatedAt: undefined  //更新时间戳
}, 'ShopRecord')

export class ShopInfo extends ShopRecord {
  static fromLeancloudObject(lcObj) {
    let shopRecord = new ShopRecord()
    let attrs = lcObj.attributes
    return shopRecord.withMutations((record) => {
      record.set('id', lcObj.id)
      record.set('name', attrs.name)
      record.set('phone', attrs.phone)
      record.set('shopName', attrs.shopName)
      record.set('shopAddress', attrs.shopAddress)
      record.set('coverUrl', attrs.coverUrl)
      record.set('contactNumber', attrs.contactNumber)
      let targetShopCategory = {}
      targetShopCategory.imageSource = attrs.imageSource
      targetShopCategory.shopCategoryId = attrs.shopCategoryId
      targetShopCategory.status = attrs.status
      targetShopCategory.text = attrs.text
      record.set('targetShopCategory', attrs.targetShopCategory)
      record.set('geo', attrs.geo)
      let geo = new AV.GeoPoint(attrs.geo)
      let distance = geo.kilometersTo(lcObj.userCurGeo)
      record.set('distance', Number(distance).toFixed(0))
      record.set('geoName', attrs.geoName)
      record.set('pv', attrs.pv)
      record.set('score', attrs.score)
      record.set('album', attrs.album)
      record.set('createdAt', lcObj.createdAt.valueOf())
      record.set('updatedAt', lcObj.updatedAt.valueOf())
    })
  }
}

export const Shop = Record({
  shopList: List()
}, 'Shop')