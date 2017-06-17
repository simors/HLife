/**
 * Created by zachary on 2016/12/20.
 */
import {Map, List, Record} from 'immutable'
import AV from 'leancloud-storage'
import * as numberUtils from '../util/numberUtils'
import * as locSelector from '../selector/locSelector'
import {store} from '../store/persistStore'

export const ShopRecord = Record({
  id: undefined,
  name: undefined,  //店主姓名
  phone: undefined, //店主电话
  shopName: undefined, //店铺名称
  shopAddress: undefined,//店铺地址
  coverUrl: undefined, //店铺封面图片地址
  contactNumber: undefined, //店铺联系电话（客服电话）
  contactNumber2: undefined, //店铺联系电话（备用电话）
  certification: '',
  targetShopCategory: {}, //店铺所属分类信息
  geo:[], //店铺地理坐标
  geoCity:undefined, //店铺地理坐标对应城市名
  geoDistrict:'', //店铺地理坐标对应区名
  geoProvince: undefined,
  geoProvinceCode: undefined,
  geoCityCode: undefined,
  geoDistrictCode: undefined,
  distance: undefined, //用户与店铺的距离
  distanceUnit: 'km', //用户与店铺的距离单位
  geoName: undefined, //店铺地理坐标对应城市区域名称
  pv: 0, //店铺点击量
  score: 4.5, //店铺评分
  ourSpecial: '', //本店特色
  openTime: '', //营业时间
  album: List(), //店铺相册
  createdAt: undefined, //创建时间戳
  updatedAt: undefined,  //更新时间戳
  owner: {}, //店铺拥有者信息
  containedTag: [], //店铺拥有的标签
  containedPromotions: List(), //店铺促销活动
  nextSkipNum: 0, //分页查询,跳过条数
  status: -1, //0-后台关闭； 1-正常； 2-店主自己关闭
  payment: 0, // 记录店铺注册后是否已完成支付流程，0表示未支付，1表示已支付
  tenant: 0,  // 记录店铺注册时缴纳的入驻费
}, 'ShopRecord')

export class ShopInfo extends ShopRecord {
  static fromLeancloudObject(lcObj, type) {
    try{
      let shopRecord = new ShopRecord()
      let attrs = lcObj.attributes
      if(type) {
        lcObj = attrs[type]
        if(lcObj) {
          attrs = lcObj.attributes
        }else{
          return shopRecord
        }
      }
      return shopRecord.withMutations((record) => {
        // console.log('lcObj======', lcObj)
        // console.log('attrs======', attrs)
        record.set('id', lcObj.id)
        // record.set('name', attrs.name)
        record.set('phone', attrs.phone)
        record.set('shopName', attrs.shopName)
        record.set('shopAddress', attrs.shopAddress)
        record.set('coverUrl', attrs.coverUrl)
        record.set('contactNumber', attrs.contactNumber)
        record.set('contactNumber2', attrs.contactNumber2)
        // record.set('certification', attrs.certification)
        record.set('status', attrs.status && parseInt(attrs.status))

        let targetShopCategory = {}
        if(attrs.targetShopCategory && attrs.targetShopCategory.attributes) {
          let targetShopCategoryAttrs = attrs.targetShopCategory.attributes
          targetShopCategory.imageSource = targetShopCategoryAttrs.imageSource
          targetShopCategory.shopCategoryId = targetShopCategoryAttrs.shopCategoryId
          targetShopCategory.status = targetShopCategoryAttrs.status
          targetShopCategory.text = targetShopCategoryAttrs.text
          targetShopCategory.id = attrs.targetShopCategory.id
        }
        record.set('targetShopCategory', targetShopCategory)

        let owner = {}
        if(attrs.owner && attrs.owner.attributes) {
          let ownerAttrs = attrs.owner.attributes
          owner.nickname = ownerAttrs.nickname
          owner.avatar = ownerAttrs.avatar
          owner.id = attrs.owner.id
        }
        record.set('owner', owner)

        let containedTag = []
        if(attrs.containedTag && attrs.containedTag.length) {
          attrs.containedTag.forEach((item)=>{
            let containedTagAttrs = item.attributes
            // console.log('attrs.containedTag.item=====', item)
            let tag = {
              id: item.id,
              name: containedTagAttrs.name,
              createdDate: numberUtils.formatLeancloudTime(item.createdAt, 'YYYY-MM-DD HH:mm:SS'),
              createdAt: item.createdAt.valueOf(),
              updatedAt: item.updatedAt.valueOf(),
            }
            containedTag.push(tag)
          })
        }
        record.set('containedTag', containedTag)

        let containedPromotions = []
        if(attrs.containedPromotions && attrs.containedPromotions.length) {
          // console.log('attrs.containedPromotions=====', attrs.containedPromotions)
          attrs.containedPromotions.forEach((promotion)=>{
            // console.log('promotion==!!!!!!!!===', promotion)
            // console.log('promotion._hasData==!!!!!!!!===', promotion._hasData)
            if(promotion._hasData) {
              let _targetShopLcObj = lcObj
              let promotionRecord = ShopPromotion.fromLeancloudObject(promotion, _targetShopLcObj)
              // console.log('promotionRecord==!!!!!!!!===', promotionRecord)
              containedPromotions.push(promotionRecord)
            }
          })
        }
        // console.log('containedPromotions=>????????====', containedPromotions)
        record.set('containedPromotions', new List(containedPromotions))

        record.set('geo', attrs.geo)
        // console.log('lcObj.userCurGeo===', lcObj.userCurGeo)
        // console.log('attrs.geo===', attrs.geo)
        if(attrs.geo) {
          let userCurGeo = locSelector.getGeopoint(store.getState())
          let curGeoPoint = new AV.GeoPoint(userCurGeo)
          let geo = new AV.GeoPoint(attrs.geo)
          let distance = geo.kilometersTo(curGeoPoint)
          let distanceUnit = 'km'
          if(distance > 1) {
            distance = Number(distance).toFixed(1)
          }else {
            distance = Number(distance * 1000).toFixed(0)
            distanceUnit = 'm'
          }
          record.set('distance', distance)
          record.set('distanceUnit', distanceUnit)
        }
        record.set('nextSkipNum', lcObj.nextSkipNum || 0)
        record.set('geoName', attrs.geoName)
        record.set('geoCity', attrs.geoCity)
        record.set('geoDistrict', attrs.geoDistrict)
        record.set('geoDistrictCode', attrs.geoDistrictCode)
        record.set('geoCityCode', attrs.geoCityCode)
        record.set('geoProvince', attrs.geoProvince)
        record.set('geoProvinceCode', attrs.geoProvinceCode)
        // record.set('pv', numberUtils.formatNum(attrs.pv))
        record.set('score', attrs.score)
        record.set('ourSpecial', attrs.ourSpecial)
        record.set('openTime', attrs.openTime)
        record.set('album', new List(attrs.album))
        record.set('payment', attrs.payment)
        record.set('tenant', attrs.tenant)
        record.set('createdAt', lcObj.createdAt.valueOf())
        record.set('updatedAt', lcObj.updatedAt.valueOf())
      })
    }catch(err) {
      console.log('shopModel.err=======', err)
      throw err
    }
  }

  static fromLeancloudApi(lcObj) {
    try{
      let shopRecord = new ShopRecord()
      return shopRecord.withMutations((record) => {
        record.set('id', lcObj.id)
        // record.set('name', lcObj.name)
        record.set('phone', lcObj.phone)
        record.set('shopName', lcObj.shopName)
        record.set('shopAddress', lcObj.shopAddress)
        record.set('coverUrl', lcObj.coverUrl)
        record.set('contactNumber', lcObj.contactNumber)
        record.set('contactNumber2', lcObj.contactNumber2)
        // record.set('certification', lcObj.certification)
        record.set('status', lcObj.status && parseInt(lcObj.status))

        let targetShopCategory = {}
        if(lcObj.targetShopCategory) {
          let targetShopCategoryAttrs = lcObj.targetShopCategory
          targetShopCategory.imageSource = targetShopCategoryAttrs.imageSource
          targetShopCategory.shopCategoryId = targetShopCategoryAttrs.shopCategoryId
          targetShopCategory.status = targetShopCategoryAttrs.status
          targetShopCategory.text = targetShopCategoryAttrs.text
          targetShopCategory.id = targetShopCategoryAttrs.id
        }
        record.set('targetShopCategory', targetShopCategory)

        let owner = {}
        if(lcObj.owner) {
          let ownerAttrs = lcObj.owner
          owner.nickname = ownerAttrs.nickname
          owner.avatar = ownerAttrs.avatar
          owner.id = ownerAttrs.id
        }
        record.set('owner', owner)

        let containedTag = []
        if(lcObj.containedTag && lcObj.containedTag.length) {
          lcObj.containedTag.forEach((containedTagAttrs)=>{
            let tag = {
              id: containedTagAttrs.id,
              name: containedTagAttrs.name,
              createdDate: numberUtils.formatLeancloudTime(new Date(containedTagAttrs.createdAt), 'YYYY-MM-DD HH:mm:SS'),
              createdAt: containedTagAttrs.createdAt,
              updatedAt: containedTagAttrs.updatedAt,
            }
            containedTag.push(tag)
          })
        }
        record.set('containedTag', containedTag)

        let containedPromotions = []
        if(lcObj.containedPromotions && lcObj.containedPromotions.length) {
          lcObj.containedPromotions.forEach((promotion)=>{
            let promotionRecord = ShopPromotion.fromLeancloudApi(promotion)
            containedPromotions.push(promotionRecord)
          })
        }
        record.set('containedPromotions', new List(containedPromotions))

        record.set('geo', lcObj.geo)
        if(lcObj.geo) {
          let userCurGeo = locSelector.getGeopoint(store.getState())
          let curGeoPoint = new AV.GeoPoint(userCurGeo)
          let geo = new AV.GeoPoint(lcObj.geo)
          let distance = geo.kilometersTo(curGeoPoint)
          let distanceUnit = 'km'
          if(distance > 1) {
            distance = Number(distance).toFixed(1)
          }else {
            distance = Number(distance * 1000).toFixed(0)
            distanceUnit = 'm'
          }
          record.set('distance', distance)
          record.set('distanceUnit', distanceUnit)
        }
        record.set('nextSkipNum', lcObj.nextSkipNum || 0)
        record.set('geoName', lcObj.geoName)
        record.set('geoCity', lcObj.geoCity)
        record.set('geoDistrict', lcObj.geoDistrict)
        record.set('geoDistrictCode', lcObj.geoDistrictCode)
        record.set('geoCityCode', lcObj.geoCityCode)
        record.set('geoProvince', lcObj.geoProvince)
        record.set('geoProvinceCode', lcObj.geoProvinceCode)
        // record.set('pv', numberUtils.formatNum(lcObj.pv))
        record.set('score', lcObj.score)
        record.set('ourSpecial', lcObj.ourSpecial)
        record.set('openTime', lcObj.openTime)
        record.set('album', new List(lcObj.album))
        record.set('payment', lcObj.payment)
        record.set('tenant', lcObj.tenant)
        record.set('createdAt', lcObj.createdAt)
        record.set('updatedAt', lcObj.updatedAt)
      })
    } catch(err) {
      console.log(err)
      throw err
    }
  }
}

export const ShopPromotionRecord = Record({
  id: undefined,
  coverUrl: '',
  typeId: '',
  type: '',
  typeDesc: '',
  title: '',
  abstract: '',
  promotingPrice: '',
  originalPrice: '',
  status: '',
  pv: 0,
  targetShop: {}, //所属店铺
  promotionDetailInfo: '',
  createdDate: undefined, //格式化后的创建时间
  createdAt: undefined, //创建时间戳
  updatedAt: undefined,  //更新时间戳
  updatedDate: undefined,  //格式化后的更新时间
  updatedDuration: undefined, //更新时长
  nextSkipNum: 0, //分页查询,跳过条数
  geo: undefined, // 地理位置
})

export class ShopPromotion extends ShopPromotionRecord {
  static fromLeancloudObject(lcObj, targetShopLcObj) {
    let shopPromotion = new ShopPromotionRecord()
    let attrs = lcObj.attributes
    return shopPromotion.withMutations((record)=>{
      // console.log('shopPromotion.lcObj=', lcObj)
      record.set('id', lcObj.id)
      record.set('coverUrl', attrs.coverUrl)
      record.set('typeId', attrs.typeId)
      record.set('type', attrs.type)
      record.set('typeDesc', attrs.typeDesc)
      record.set('title', attrs.title)
      record.set('abstract', attrs.abstract)
      record.set('promotingPrice', attrs.promotingPrice)
      record.set('originalPrice', attrs.originalPrice)
      record.set('status', attrs.status)
      // record.set('pv', numberUtils.formatNum(attrs.pv))
      record.set('promotionDetailInfo', attrs.promotionDetailInfo)
      record.set('nextSkipNum', lcObj.nextSkipNum || 0)

      let targetShop = {}

      if(attrs.targetShop) {
        let targetShopAttrs = attrs.targetShop.attributes
        targetShop.id = attrs.targetShop.id
        if(targetShopLcObj) {
          targetShopAttrs = targetShopLcObj.attributes
          targetShop.id = targetShopLcObj.id
        }

        if(targetShopAttrs) {
          targetShop.shopName = targetShopAttrs.shopName
          targetShop.geoDistrict = targetShopAttrs.geoDistrict
          targetShop.geo = targetShopAttrs.geo
          if(targetShopAttrs.geo) {
            let userCurGeo = locSelector.getGeopoint(store.getState())
            let curGeoPoint = new AV.GeoPoint(userCurGeo)
            let shopGeoPoint = new AV.GeoPoint(targetShopAttrs.geo)
            let distance = shopGeoPoint.kilometersTo(curGeoPoint)
            let distanceUnit = 'km'
            if(distance > 1) {
              distance = Number(distance).toFixed(1)
            }else {
              distance = Number(distance * 1000).toFixed(0)
              distanceUnit = 'm'
            }
            targetShop.distance = distance
            targetShop.distanceUnit = distanceUnit
          }
    
          // console.log('targetShopAttrs----------->>>>>>', targetShopAttrs)
          let targetShopOwner = targetShopAttrs.owner
          if(targetShopOwner) {
            targetShop.owner = {
              id: targetShopOwner.id,
              ...targetShopOwner.attributes
            }
          }
        }
      }
      
      // console.log('targetShop------******----->>>>>>', targetShop)
      record.set('targetShop', targetShop)

      record.set('createdDate', numberUtils.formatLeancloudTime(lcObj.createdAt, 'YYYY-MM-DD HH:mm:SS'))
      record.set('createdAt', lcObj.createdAt.valueOf())
      record.set('updatedAt', lcObj.updatedAt.valueOf())
      record.set('updatedDuration', numberUtils.getConversationTime(lcObj.updatedAt))
      record.set('updatedDate', numberUtils.formatLeancloudTime(lcObj.updatedAt, 'YYYY-MM-DD HH:mm:SS'))
    })
  }

  static fromLeancloudApi(lcObj) {
    let shopPromotion = new ShopPromotionRecord()
    return shopPromotion.withMutations((record)=> {
      record.set('id', lcObj.id)
      record.set('coverUrl', lcObj.coverUrl)
      record.set('typeId', lcObj.typeId)
      record.set('type', lcObj.type)
      record.set('typeDesc', lcObj.typeDesc)
      record.set('title', lcObj.title)
      record.set('abstract', lcObj.abstract)
      record.set('promotingPrice', lcObj.promotingPrice)
      record.set('originalPrice', lcObj.originalPrice)
      record.set('status', lcObj.status)
      record.set('promotionDetailInfo', lcObj.promotionDetailInfo)
      record.set('geo', lcObj.geo)

      let targetShop = {
        ...lcObj.targetShop
      }
      let userCurGeo = locSelector.getGeopoint(store.getState())
      let curGeoPoint = new AV.GeoPoint(userCurGeo)
      let shopGeoPoint = targetShop.geo
      if (shopGeoPoint) {
        let distance = shopGeoPoint.kilometersTo(curGeoPoint)
        let distanceUnit = 'km'
        if(distance > 1) {
          distance = Number(distance).toFixed(1)
        }else {
          distance = Number(distance * 1000).toFixed(0)
          distanceUnit = 'm'
        }
        targetShop.distance = distance
        targetShop.distanceUnit = distanceUnit
      }

      record.set('targetShop', targetShop)
      record.set('createdDate', numberUtils.formatLeancloudTime(new Date(lcObj.createdAt), 'YYYY-MM-DD HH:mm:SS'))
      record.set('createdAt', lcObj.createdAt)
      record.set('updatedAt', lcObj.updatedAt)
      record.set('updatedDuration', numberUtils.getConversationTime(new Date(lcObj.updatedAt)))
      record.set('updatedDate', numberUtils.formatLeancloudTime(new Date(lcObj.updatedAt), 'YYYY-MM-DD HH:mm:SS'))
    })
  }
}

export const ShopAnnouncementRecord = Record({
  id: undefined,
  content: '', //店铺公告内容
  coverUrl: '', //公告封面
  createdDate: '', //创建日期
  createdDay: '', //创建日期:日
  createdMonth: '', //创建日期:月
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
      record.set('createdDay', date)
      record.set('createdMonth', month)
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
  containedUps: [], //点赞列表
  targetShop: {}, //目标店铺
  score: 4, // 用户打分
  user: {}, //评论用户详细信息
  createdDate: '', //格式化后的创建时间
  createdDetailDate: '',
  shopCommentTime: '', //评论列表友好显示时间
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
        user.id = attrs.user.id
        user.nickname = userAttrs.nickname
        user.avatar = userAttrs.avatar
      }
      record.set('user', user)
      record.set('shopCommentTime', numberUtils.getConversationTime(lcObj.updatedAt.valueOf()))
      record.set('createdDetailDate', numberUtils.formatLeancloudTime(lcObj.createdAt, 'YYYY-MM-DD HH:mm:SS'))
      record.set('createdDate', numberUtils.formatLeancloudTime(lcObj.createdAt, 'YYYY-MM-DD'))
      record.set('createdAt', lcObj.createdAt.valueOf())
      record.set('updatedAt', lcObj.updatedAt.valueOf())
    })
  }
  
  static fromLeancloudJson(lcJson) {
    let shopComment = new ShopCommentRecord()
    return shopComment.withMutations((record)=>{
      record.set('id', lcJson.id)
      record.set('content', lcJson.content)
      record.set('blueprints', lcJson.blueprints)
      record.set('score', lcJson.score)
      record.set('targetShop', lcJson.targetShop)
      record.set('user', lcJson.user)
      record.set('shopCommentTime', lcJson.shopCommentTime)
      record.set('createdDate', lcJson.createdDate.split(' ')[0])
      record.set('createdDetailDate', lcJson.createdDate)
      record.set('createdAt', lcJson.createdAt)
      record.set('updatedAt', lcJson.updatedAt)
      record.set('containedReply', lcJson.replys)
      record.set('containedUps', lcJson.ups)
    })
  }
}

export const ShopCommentUp4CloudRecord = Record({
  id: undefined, //点赞id
  status: false, //是否点赞
  user: {}, //点赞用户
  shopCommentUpTime: undefined, //友好显示时间
  createdDate: undefined, //格式化后的创建时间
  createdAt: undefined, //创建时间戳
  updatedAt: undefined, //更新时间戳
})

export class ShopCommentUp4Cloud extends ShopCommentUp4CloudRecord {
  static fromLeancloudJson(lcJson) {
    let ShopCommentUp4Cloud = new ShopCommentUp4CloudRecord()
    return ShopCommentUp4Cloud.withMutations((record)=>{
      record.set('id', lcJson.id)
      record.set('status', lcJson.status)
      record.set('user', lcJson.user)
      record.set('shopCommentUpTime', lcJson.shopCommentUpTime)
      record.set('createdDate', lcJson.createdDate)
      record.set('createdAt', lcJson.createdAt)
      record.set('updatedAt', lcJson.updatedAt)
    })
  }
}

export const UpRecord = Record({
  id: undefined, // 点赞id
  upType: '', //点赞类型: enum('shop', 'shopComment', 'article', 'articleComment', 'topic', 'topicComment')
  targetId: '', //点赞类型对应的对象id
  status: false, //是否点赞
  createdDate: '', //格式化后的创建时间
  user: {},
  createdAt: undefined, //创建时间戳
  updatedAt: undefined,  //更新时间戳
})

export class Up extends UpRecord {
  static fromLeancloudObject(lcObj) {
    let up = new UpRecord()
    let attrs = lcObj.attributes
    return up.withMutations((record) => {
      record.set('id', lcObj.id)
      record.set('upType', attrs.upType)
      record.set('targetId', attrs.targetId)
      record.set('status', attrs.status)

      let userAttrs = attrs.user.attributes
      let user = {}
      user.id = attrs.user.id
      user.nickname = userAttrs.nickname
      record.set('user', user)
      record.set('createdDate', numberUtils.formatLeancloudTime(lcObj.createdAt, 'YYYY-MM-DD'))
      record.set('createdAt', lcObj.createdAt.valueOf())
      record.set('updatedAt', lcObj.updatedAt.valueOf())
    })
  }

  static fromLeancloudApi(lcObj) {
    let up = new UpRecord()
    return up.withMutations((record)=> {
      for(let key in lcObj) {
        record.set(key, lcObj[key])
      }
    })
  }
}

export const ShopCommentReplyRecord = Record({
  id: undefined, // id
  content: undefined, // 回复内容
  replyShopCommentId: undefined, // 回复的id
  shopCommentReplyTime: undefined, // 回复的id
  user: {}, // 发表回复的用户
  createdDate: '', //格式化后的创建时间
  createdAt: undefined, //创建时间戳
  updatedAt: undefined,  //更新时间戳
})

export class ShopCommentReply extends ShopCommentReplyRecord {
  static fromLeancloudObject(lcObj) {
    let shopCommentReply = new ShopCommentReply()
    let attrs = lcObj.attributes
    return shopCommentReply.withMutations((record) => {
      record.set('id', lcObj.id)
      record.set('content', attrs.content)

      let userAttrs = attrs.user.attributes
      let user = {}
      user.id = attrs.user.id
      user.nickname = userAttrs.nickname
      user.avatar = userAttrs.avatar
      record.set('user', user)

      record.set('replyId', attrs.replyId)

      let replyShopCommentAttrs = attrs.replyShopComment.attributes
      let replyShopComment = {}
      replyShopComment.id = attrs.replyShopComment.id
      replyShopComment.score = replyShopCommentAttrs.score
      record.set('replyShopComment', replyShopComment)

      record.set('createdDate', numberUtils.formatLeancloudTime(lcObj.createdAt, 'YYYY-MM-DD'))
      record.set('createdAt', lcObj.createdAt.valueOf())
      record.set('updatedAt', lcObj.updatedAt.valueOf())
    })
  }
}

export const ShopCommentUpRecord = Record({
  id: undefined, // id
  status: false, //是否点赞
  user: {}, // 点赞用户
  createdDate: '', //格式化后的创建时间
  createdAt: undefined, //创建时间戳
  updatedAt: undefined,  //更新时间戳
})

export class ShopCommentUp extends ShopCommentUpRecord {
  static fromLeancloudObject(lcObj) {
    let shopCommentUp = new ShopCommentUp()
    let attrs = lcObj.attributes
    return shopCommentUp.withMutations((record)=>{
      record.set('id', lcObj.id)
      record.set('status', attrs.status)

      let userAttrs = attrs.user.attributes
      let user = {}
      user.id = attrs.user.id
      user.nickname = userAttrs.nickname
      user.avatar = userAttrs.avatar
      record.set('user', user)

      record.set('createdDate', numberUtils.formatLeancloudTime(lcObj.createdAt, 'YYYY-MM-DD'))
      record.set('createdAt', lcObj.createdAt.valueOf())
      record.set('updatedAt', lcObj.updatedAt.valueOf())
    })
  }
}

export const ShopTagRecord = Record({
  id: undefined,
  name: undefined,
  createdDate: '', //格式化后的创建时间
  createdAt: undefined, //创建时间戳
  updatedAt: undefined,  //更新时间戳
})

export class ShopTag extends ShopTagRecord {
  static fromLeancloudObject(lcObj) {
    let shopTag = new ShopTag()
    let attrs = lcObj.attributes
    return shopTag.withMutations((record)=>{
      record.set('id', lcObj.id)
      record.set('name', attrs.name)
      record.set('createdDate', numberUtils.formatLeancloudTime(lcObj.createdAt, 'YYYY-MM-DD'))
      record.set('createdAt', lcObj.createdAt.valueOf())
      record.set('updatedAt', lcObj.updatedAt.valueOf())
    })
  }
}

export const ShopGoodsRecord = Record({
  id: undefined,
  targetShop: undefined,
  goodsName: undefined,
  price: undefined,
  originalPrice: undefined,
  coverPhoto: undefined,
  album: undefined,
  status: undefined,
  detail: undefined,
  promotion: undefined,
  updatedAt: undefined,
})

export class ShopGoods extends ShopGoodsRecord {
  static fromLeancloudApi(lcObj) {
    let shopGoods = new ShopGoods()
    return shopGoods.withMutations((record) => {
      record.set('id', lcObj.objectId)
      record.set('targetShop', lcObj.targetShop.id)
      record.set('goodsName', lcObj.goodsName)
      record.set('price', lcObj.price)
      record.set('originalPrice', lcObj.originalPrice)
      record.set('coverPhoto', lcObj.coverPhoto)
      record.set('album', new List(lcObj.album))
      record.set('status', lcObj.status)
      record.set('detail', lcObj.detail)
      record.set('promotion', lcObj.promotion)
      record.set('updatedAt', lcObj.updatedAt)
    })
  }
}

export const Shop = Record({
  shopList: List(),
  localShopList: List(),
  shopPromotionList: List(),
  myShopExpriredPromotionList: Map(),
  fetchShopListArrivedLastPage: false,
  shopAnnouncements: Map(),
  userFollowShopsInfo: Map(),
  shopComments: Map(),
  shopCommentsTotalCounts: Map(),
  userUpShopsInfo: Map(),
  shopTagList: List(),
  userOwnedShopInfo:Map(),
  shopFollowers: Map(),
  shopFollowersTotalCount: Map(),
  similarShops: Map(),
  shopDetails: Map(),
  shopPromotionDetails: Map(),
  guessYouLikeShopList: List(),
  userFollowedShops: Map(),
  shopPromotionMaxNum: 3,
  shopGoods: Map(),         // 店铺商品列表，键为店铺id，值为ShopGoods组成的List
}, 'Shop')