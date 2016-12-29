/**
 * Created by zachary on 2016/12/20.
 */
import {Map, List, Record} from 'immutable'
import AV from 'leancloud-storage'
import * as numberUtils from '../util/numberUtils'

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
  ourSpecial: '', //本店特色
  openTime: '', //营业时间
  album: [], //店铺相册
  createdAt: undefined, //创建时间戳
  updatedAt: undefined,  //更新时间戳
  owner: {}, //店铺拥有者信息
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
      let targetShopCategoryAttrs = attrs.targetShopCategory.attributes
      if(targetShopCategoryAttrs) {
        targetShopCategory.imageSource = attrs.targetShopCategory.attributes.imageSource
        targetShopCategory.shopCategoryId = attrs.targetShopCategory.attributes.shopCategoryId
        targetShopCategory.status = attrs.targetShopCategory.attributes.status
        targetShopCategory.text = attrs.targetShopCategory.attributes.text
      }
      record.set('targetShopCategory', targetShopCategory)

      let owner = {}
      let ownerAttrs = attrs.owner.attributes
      if(ownerAttrs) {
        owner.nickname = ownerAttrs.nickname
        owner.avatar = ownerAttrs.avatar
      }
      record.set('owner', owner)

      record.set('geo', attrs.geo)
      let geo = new AV.GeoPoint(attrs.geo)
      let distance = geo.kilometersTo(lcObj.userCurGeo)
      record.set('distance', Number(distance).toFixed(0))
      record.set('geoName', attrs.geoName)
      record.set('pv', attrs.pv)
      record.set('score', attrs.score)
      record.set('ourSpecial', attrs.ourSpecial)
      record.set('openTime', attrs.openTime)
      record.set('album', attrs.album)
      record.set('createdAt', lcObj.createdAt.valueOf())
      record.set('updatedAt', lcObj.updatedAt.valueOf())
    })
  }
}

export const ShopAnnouncementRecord = Record({
  id: undefined,
  content: '', //店铺公告内容
  coverUrl: '', //公告封面
  createdDate: '', //创建日期
  createdAt: undefined, //创建时间戳
  updatedAt: undefined,  //更新时间戳
})

export class ShopAnnouncement extends ShopAnnouncementRecord {
  static fromLeancloudObject(lcObj) {
    let shopAnnouncement = new ShopAnnouncementRecord()
    let attrs = lcObj.attributes
    return shopAnnouncement.withMutations((record)=>{
      // console.log('ShopAnnouncement.lcObj=', lcObj)
      record.set('id', lcObj.id)
      record.set('content', attrs.content)
      record.set('coverUrl', attrs.coverUrl)
      let fullYear = lcObj.createdAt.getFullYear()
      let month = lcObj.createdAt.getMonth()
      let date = lcObj.createdAt.getDate()
      let hours = lcObj.createdAt.getHours()
      let minutes = lcObj.createdAt.getMinutes()
      let seconds = lcObj.createdAt.getSeconds()
      let createdDate = fullYear + '-' + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds
      record.set('createdDate', createdDate)
      record.set('createdAt', lcObj.createdAt.valueOf())
      record.set('updatedAt', lcObj.updatedAt.valueOf())
    })
  }
}

export const ShopCommentRecord = Record({
  id: undefined, //店铺评论id
  content: '', //评论内容
  blueprints: [], //晒图
  containedReply: [], //回复列表
  targetShop: {}, //目标店铺
  score: 4, // 用户打分
  user: {}, //评论用户详细信息
  createdDate: '', //格式化后的创建时间
  createdAt: undefined, //创建时间戳
  updatedAt: undefined,  //更新时间戳
})

export class ShopComment extends ShopCommentRecord {
  static fromLeancloudObject(lcObj) {
    let shopComment = new ShopCommentRecord()
    let attrs = lcObj.attributes
    return shopComment.withMutations((record)=>{
      // console.log('shopComment.lcObj=', lcObj)
      record.set('id', lcObj.id)
      record.set('content', attrs.content)
      record.set('blueprints', attrs.blueprints)
      record.set('score', attrs.score)

      let targetShop = {}
      let targetShopAttrs = attrs.targetShop.attributes
      if(targetShopAttrs) {
        targetShop.shopName = targetShopAttrs.shopName
      }
      record.set('targetShop', targetShop)

      let user = {}
      let userAttrs = attrs.user.attributes
      if(user) {
        user.shopName = userAttrs.nickname
        user.avatar = userAttrs.avatar
      }
      record.set('user', user)

      record.set('createdDate', numberUtils.formatLeancloudTime((lcObj.createdAt, 'YYYY-DD-MM')))
      record.set('createdAt', lcObj.createdAt.valueOf())
      record.set('updatedAt', lcObj.updatedAt.valueOf())
    })
  }
}

export const Shop = Record({
  shopList: List(),
  shopAnnouncements: Map(),
  userFollowShopsInfo: Map(),
  shopComments: Map(),
  shopCommentsTotalCounts: Map()
}, 'Shop')