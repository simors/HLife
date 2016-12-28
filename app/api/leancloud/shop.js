/**
 * Created by zachary on 2016/12/24.
 */
import AV from 'leancloud-storage'
import {Map, List, Record} from 'immutable'
import ERROR from '../../constants/errorCode'
import {
  ShopInfo,
  ShopAnnouncement
} from '../../models/shopModel'

export function getShopList(payload) {
  let shopCategoryId = payload.shopCategoryId
  let sortId = payload.sortId // 0-智能,1-按好评,2-按距离
  let distance = payload.distance
  let geo = payload.geo
  let geoName = payload.geoName
  let isRefresh = payload.isRefresh
  let lastScore = payload.lastScore
  let lastGeo = payload.lastGeo
  let query = new AV.Query('Shop')
  if(shopCategoryId){
    //构建内嵌查询
    let innerQuery = new AV.Query('ShopCategory')
    innerQuery.equalTo('shopCategoryId', shopCategoryId)
    //执行内嵌查询
    query.matchesQuery('targetShopCategory', innerQuery)
  }

  //用 include 告知服务端需要返回的关联属性对应的对象的详细信息，而不仅仅是 objectId
  query.include(['targetShopCategory', 'owner'])

  if(sortId == 1) {
    if(!isRefresh) { //分页查询
      query.skip(1)
      query.lessThanOrEqualTo('score', lastScore)
    }
    query.addDescending('score')
  }else if(sortId == 2) {
    if(!isRefresh) { //分页查询
      query.skip(1)
      query.lessThanOrEqualTo('geo', lastGeo)
    }
    query.addDescending('geo')
    query.addDescending('score')
  }else{
    if(!isRefresh) { //分页查询
      query.skip(1)
      query.lessThanOrEqualTo('score', lastScore)
    }
    query.addDescending('score')
    query.addDescending('geo')
  }
  query.limit(5) // 最多返回 5 条结果
  if(distance) {
    if (Array.isArray(geo)) {
      let point = new AV.GeoPoint(geo)
      query.withinKilometers('geo', point, distance)
    }
  }else {
    query.contains('geoName', geoName)
  }
  return query.find().then(function (results) {
    // console.log('getShopList.results=', results)
    return AV.GeoPoint.current().then(function(geoPoint){
      let shopList = []
      results.forEach((result) => {
        result.userCurGeo = geoPoint
        shopList.push(ShopInfo.fromLeancloudObject(result))
      })
      return new List(shopList)
    })
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function getShopAnnouncement(payload) {
  let shopAnnouncements = []
  let shopId = payload.id //店铺id
  let shop = AV.Object.createWithoutData('Shop', shopId)
  let relation = shop.relation('containedAnnouncements')
  let query = relation.query()
  query.addDescending('createdAt')
  return query.find().then(function(results) {
    // console.log('getShopAnnouncement.results=====', results)
    results.forEach((result)=>{
      shopAnnouncements.push(ShopAnnouncement.fromLeancloudObject(result))
    })
    return new List(shopAnnouncements)
  }, function(err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function isFollowedShop(payload) {
  let shopId = payload.id
  let shop = AV.Object.createWithoutData('Shop', shopId)
  let currentUser = AV.User.current()

  let query = new AV.Query('ShopFollower')
  query.equalTo('follower', currentUser)
  query.equalTo('shop', shop)

  return query.find().then((result)=>{
    if(result && result.length) {
      return {
        shopId: shopId,
        code: '10001',
        message: '您已关注过该店铺,请不要重复关注'
      }
    }
    return {
      shopId: shopId,
      code: '10000',
      message: '未关注'
    }
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function followShop(payload) {

  return isFollowedShop(payload).then((result) =>{
    if(result && '10001' == result.code) {
      return result
    }

    let shopId = payload.id
    let shop = AV.Object.createWithoutData('Shop', shopId)
    let currentUser = AV.User.current()

    let ShopFollower = AV.Object.extend('ShopFollower')
    let shopFollower = new ShopFollower()
    shopFollower.set('follower', currentUser)
    shopFollower.set('shop', shop)

    let ShopFollowee = AV.Object.extend('ShopFollowee')
    let shopFollowee = new ShopFollowee()
    shopFollowee.set('user', currentUser)
    shopFollowee.set('followee', shop)

    return shopFollower.save().then(function(shopFollowerResult){
      return shopFollowee.save()
    }).then(()=>{
      return {
        code: '10002',
        message: '关注成功'
      }
    }).catch((err) =>{
      err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
      throw err
    })
  }).catch((err) =>{
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })


}
