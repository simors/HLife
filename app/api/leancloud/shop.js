/**
 * Created by zachary on 2016/12/24.
 */
import AV from 'leancloud-storage'
import {Map, List, Record} from 'immutable'
import ERROR from '../../constants/errorCode'
import {
  ShopInfo,
  ShopAnnouncement,
  ShopComment,
  Up,
  ShopCommentReply,
  ShopCommentUp,
  ShopCommentUp4Cloud,
  ShopTag,
  ShopPromotion
} from '../../models/shopModel'
import {UserInfo} from '../../models/userModels'
import {Geolocation} from '../../components/common/BaiduMap'
import * as AVUtils from '../../util/AVUtils'
import * as shopSelector from '../../selector/shopSelector'
import * as authSelector from '../../selector/authSelector'
import {store} from '../../store/persistStore'

export function getShopList(payload) {
  // console.log('getShopList.payload==', payload)
  let shopCategoryId = payload.shopCategoryId
  let sortId = payload.sortId // 0-智能,1-按好评,2-按距离;3-按等级(grade)
  let distance = payload.distance
  let geo = payload.geo
  let geoCity = payload.geoCity
  let isRefresh = payload.isRefresh
  // let lastCreatedAt = payload.lastCreatedAt
  // let lastScore = payload.lastScore
  // let lastGeo = payload.lastGeo
  let skipNum = payload.isRefresh ? 0 : (payload.skipNum || 0)
  let shopTagId = payload.shopTagId
  let query = new AV.Query('Shop')
  if(shopCategoryId){
    //构建内嵌查询
    let innerQuery = new AV.Query('ShopCategory')
    innerQuery.equalTo('shopCategoryId', shopCategoryId)
    //执行内嵌查询
    query.matchesQuery('targetShopCategory', innerQuery)
  }

  //用 include 告知服务端需要返回的关联属性对应的对象的详细信息，而不仅仅是 objectId
  query.include(['targetShopCategory', 'owner', 'containedTag', 'containedPromotions'])

  if(sortId == 1) {
    if(!isRefresh) { //分页查询
      query.skip(skipNum)
      // query.lessThanOrEqualTo('score', lastScore)
    }
    query.addDescending('score')
  }else if(sortId == 2) {
    if(!isRefresh) { //分页查询
      query.skip(skipNum)
      // query.lessThanOrEqualTo('geo', lastGeo)
    }
  }else if(sortId == 3) {
    if(!isRefresh) { //分页查询
      query.skip(skipNum)
    }
    query.addDescending('grade')
  }else{
    if(!isRefresh) { //分页查询
      query.skip(skipNum)
      // query.lessThanOrEqualTo('score', lastScore)
    }
    query.addDescending('score')
    // query.addDescending('geo')
  }
  query.limit(5) // 最多返回 5 条结果
  if(distance) {
    // console.log('getShopList.geo===', geo)
    // console.log('getShopList.Array.isArray(geo)===', Array.isArray(geo))
    if (Array.isArray(geo)) {
      let point = new AV.GeoPoint(geo)
      query.withinKilometers('geo', point, distance)
    }
  }else {
    // console.log('getShopList.geoCity===', geoCity)
    // console.log('getShopList.typeof geoCity===', typeof geoCity)
    if(geoCity) {
      query.contains('geoCity', geoCity)
    }
    if (Array.isArray(geo)) {
      let point = new AV.GeoPoint(geo)
      query.withinKilometers('geo', point, 100)
    }
  }
  if(shopTagId) {
    let shopTag = AV.Object.createWithoutData('ShopTag', shopTagId)
    query.equalTo('containedTag', shopTag)
  }

  query.equalTo('isOpen', true)
  // console.log('getShopList.query===', query)
  return query.find().then(function (results) {
    // console.log('getShopList.results=', results)
    let point = null
    if (Array.isArray(geo)) {
      point = new AV.GeoPoint(geo)
    }
    let shopList = []
    results.forEach((result) => {
      result.userCurGeo = point
      result.nextSkipNum = parseInt(skipNum) + results.length
      shopList.push(ShopInfo.fromLeancloudObject(result))
    })
    return new List(shopList)
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function fetchShopPromotionList(payload) {
  let distance = payload.distance
  let geo = payload.geo
  let geoCity = payload.geoCity
  let isRefresh = payload.isRefresh
  let skipNum = payload.isRefresh ? 0 : (payload.skipNum || 0)
  let query = new AV.Query('ShopPromotion')

  query.include(['targetShop'])
  query.limit(5) // 最多返回 5 条结果

  if(!isRefresh) { //分页查询
    query.skip(skipNum)
  }

  //构建内嵌查询
  let innerQuery = new AV.Query('Shop')
  if(distance) {
    if (Array.isArray(geo)) {
      let point = new AV.GeoPoint(geo)
      innerQuery.withinKilometers('geo', point, distance)
    }
  }else {
    if(geoCity) {
      innerQuery.contains('geoCity', geoCity)
    }
    if (Array.isArray(geo)) {
      let point = new AV.GeoPoint(geo)
      innerQuery.withinKilometers('geo', point, 100) //距离降序
    }
  }
  //执行内嵌查询
  query.matchesQuery('targetShop', innerQuery)

  query.equalTo('status', "1")

  // console.log('fetchShopPromotionList.query==*******===', query)
  return query.find().then(function (results) {
    // console.log('fetchShopPromotionList.results===*******===', results)
    let shopPromotionList = []
    results.forEach((result) => {
      result.nextSkipNum = parseInt(skipNum) + results.length
      shopPromotionList.push(ShopPromotion.fromLeancloudObject(result))
    })
    return new List(shopPromotionList)
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })

}

export function fetchShopDetail(payload) {
  let id = payload.id
  let query = new AV.Query('Shop')
  query.equalTo('objectId', id)
  query.include(['targetShopCategory', 'owner', 'containedTag', 'containedPromotions'])
  return query.first().then(function (result) {
    // console.log('fetchShopDetail.result=', result)
    Geolocation.getCurrentPosition()
    .then(data => {
      let point = new AV.GeoPoint([data.latitude, data.longitude])
      result.userCurGeo = point
      let shopInfo = ShopInfo.fromLeancloudObject(result)
      return new Map(shopInfo)
    }, (reason)=>{
      let shopInfo = ShopInfo.fromLeancloudObject(result)
      return new Map(shopInfo)
    })

  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function getShopAnnouncement(payload) {
  let shopAnnouncements = []
  let shopId = payload.id //店铺id
  let isRefresh = payload.isRefresh
  let lastCreatedAt = payload.lastCreatedAt
  // let lastUpdatedAt = payload.lastUpdatedAt

  let shop = AV.Object.createWithoutData('Shop', shopId)
  let relation = shop.relation('containedAnnouncements')
  let query = relation.query()
  // console.log('getShopAnnouncement.shopId=====', shopId)
  if(!isRefresh && lastCreatedAt) { //分页查询
    query.lessThan('createdAt', new Date(lastCreatedAt))
  }
  query.addDescending('createdAt')
  query.limit(5)
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

export function deleteShopAnnouncement(payload) {
  let shopAnnouncementId = payload.shopAnnouncementId
  let shopAnnouncement = AV.Object.createWithoutData('ShopAnnouncement', shopAnnouncementId)
  return shopAnnouncement.destroy().then((success)=>{
    return success
  }, function(err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function fetchUserFollowShops(payload) {
  let userId = payload.userId
  let isRefresh = payload.isRefresh
  let lastCreatedAt = payload.lastCreatedAt
  let currentUser = AV.User.current()
  if(!userId) {
    userId = currentUser.id
  }
  let user = AV.Object.createWithoutData('_User', userId)
  let query = new AV.Query('ShopFollowee')
  query.equalTo('user', user)
  if(!isRefresh) { //分页查询
    if(lastCreatedAt) {
      query.lessThan('createdAt', new Date(lastCreatedAt))
    }else {
      return new Promise((resolve, reject)=>{
        resolve({
          userId: userId,
          userFollowedShops: new List([])
        })
      })
    }
  }
  query.addDescending('createdAt')
  query.limit(5)
  query.include(['followee','followee.targetShopCategory', 'followee.owner', 'followee.containedTag'])
  let userFollowedShops = []
  return query.find().then(function(results) {
    // console.log('fetchUserFollowShops.results=====', results)
    results.forEach((result)=>{
      userFollowedShops.push(ShopInfo.fromLeancloudObject(result, 'followee'))
    })
    return {
      userId: userId,
      userFollowedShops: new List(userFollowedShops)
    }
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
      let shopDetail = shopSelector.selectShopDetail(store.getState(), shopId)
      // console.log('followShop.shopDetail==', shopDetail)
      AVUtils.pushByUserList([shopDetail.owner.id], {
        alert: '有新的用户关注了您的店铺,立即查看',
      })
      return {
        shopId: shopId,
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

export function submitShopComment(payload) {
  let shopId = payload.id
  let score = payload.score
  let content = payload.content
  let blueprints = payload.blueprints
  let shop = AV.Object.createWithoutData('Shop', shopId)
  let currentUser = AV.User.current()

  let ShopComment = AV.Object.extend('ShopComment')
  let shopComment = new ShopComment()
  shopComment.set('user', currentUser)
  shopComment.set('targetShop', shop)
  if(score) {
    shopComment.set('score', score)
  }
  if(blueprints) {
    shopComment.set('blueprints', blueprints)
  }
  shopComment.set('content', content)

  return shopComment.save().then((results) => {
    // console.log('submitShopComment.results=', results)
    let shopDetail = shopSelector.selectShopDetail(store.getState(), shopId)
    let activeUser = authSelector.activeUserInfo(store.getState())
    // console.log('followShop.shopDetail==', shopDetail)
    AVUtils.pushByUserList([shopDetail.owner.id], {
      alert: `${activeUser.nickname}评论了您的店铺,立即查看`,
      sceneName: 'SHOP_COMMENT_LIST',
      sceneParams: {
        shopId: shopId
      }
    })
    return results
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

//deprecated
export function fetchShopCommentList(payload) {
  let shopId = payload.id
  let query = new AV.Query('ShopComment')
  let isRefresh = payload.isRefresh
  let lastCreatedAt = payload.lastCreatedAt
  if(!isRefresh && lastCreatedAt) { //分页查询
    query.lessThan('createdAt', new Date(lastCreatedAt))
  }

  //构建内嵌查询
  let innerQuery = new AV.Query('Shop')
  innerQuery.equalTo('objectId', shopId)
  //执行内嵌查询
  query.matchesQuery('targetShop', innerQuery)

  query.include(['targetShop', 'user'])

  query.addDescending('createdAt')
  query.limit(5) // 最多返回 5 条结果
  return query.find().then((results)=>{
    // console.log('fetchShopCommentList.results=', results)
    let shopComment = []
    results.forEach((result)=>{
      shopComment.push(ShopComment.fromLeancloudObject(result))
    })
    return new List(shopComment)
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}


export function fetchShopCommentListByCloudFunc(payload) {
  return AV.Cloud.run('hLifeFetchShopCommentList', payload).then((results)=>{
    let shopComments = []
    results.forEach((result)=>{
      shopComments.push(ShopComment.fromLeancloudJson(result))
    })
    return new List(shopComments)
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function fetchShopCommentTotalCount(payload) {
  let shopId = payload.id
  let query = new AV.Query('ShopComment')
  //构建内嵌查询
  let innerQuery = new AV.Query('Shop')
  innerQuery.equalTo('objectId', shopId)
  //执行内嵌查询
  query.matchesQuery('targetShop', innerQuery)
  return query.count().then((results)=>{
    return results
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function fetchUserUpShopInfo(payload) {
  let shopId = payload.id
  let upType = 'shop'
  let currentUser = AV.User.current()
  
  let query = new AV.Query('Up')
  query.equalTo('targetId', shopId)
  query.equalTo('upType', upType)
  query.equalTo('user', currentUser)
  query.include('user')
  return query.first().then((result) =>{
    let userUpShopInfo = {}
    if(result && result.attributes) {
      userUpShopInfo = Up.fromLeancloudObject(result)
    }
    return userUpShopInfo
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function userUpShop(payload) {
  let shopId = payload.id
  let upType = 'shop'
  let currentUser = AV.User.current()

  return fetchUserUpShopInfo(payload).then((userUpShopInfo) => {
    if(!userUpShopInfo || !userUpShopInfo.id) {
      let Up = AV.Object.extend('Up')
      let up = new Up()
      up.set('targetId', shopId)
      up.set('upType', upType)
      up.set('user', currentUser)
      return up.save()
    }else if(userUpShopInfo.id && !userUpShopInfo.status) {
      let up = AV.Object.createWithoutData('Up', userUpShopInfo.id)
      up.set('status', true)
      return up.save()
    }
    return {
      code: '10007',
      message: '您已经赞过该店铺了'
    }
  }).then((result) => {
    if(result && '10007' == result.code) {
      return result
    }
    let shopDetail = shopSelector.selectShopDetail(store.getState(), shopId)
    let activeUser = authSelector.activeUserInfo(store.getState())
    // console.log('followShop.shopDetail==', shopDetail)
    AVUtils.pushByUserList([shopDetail.owner.id], {
      alert: `${activeUser.nickname}点赞了您的店铺,立即查看`,
      sceneName: 'SHOP_COMMENT_LIST',
      sceneParams: {
        shopId: shopId
      }
    })
    return {
      shopId: shopId,
      code: '10008',
      message: '点赞成功'
    }
  }).catch((err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function userUnUpShop(payload) {
  let shopId = payload.id

  return fetchUserUpShopInfo(payload).then((userUpShopInfo) => {
    if(userUpShopInfo && userUpShopInfo.id) {
      let up = AV.Object.createWithoutData('Up', userUpShopInfo.id)
      up.set('status', false)
      return up.save()
    }
    return {
      code: '10009',
      message: '您还没有赞过该店铺'
    }
  }).then((result) => {
    if(result && '10009' == result.code) {
      return result
    }
    return {
      shopId: shopId,
      code: '10010',
      message: '取消点赞成功'
    }
  }).catch((err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

//deprecated
export function fetchShopCommentUpedUserList(payload) {
  let shopCommentId = payload.shopCommentId
  let targetShopComment = AV.Object.createWithoutData('ShopComment', shopCommentId)
  let query = new AV.Query('ShopCommentUp')
  query.equalTo('targetShopComment', targetShopComment)
  query.include(['user'])
  return query.find().then((results) =>{
    let shopCommentUpedUserList = []
    // console.log('fetchShopCommentUpedUserList...results===========', results)
    if(results && results.attributes && results.attributes.length) {
      results.forEach((result)=>{
        shopCommentUpedUserList.push(ShopCommentUp.fromLeancloudObject(result))
      })
    }
    return new List(shopCommentUpedUserList)
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function fetchShopCommentUpedUserListByCloudFunc(payload) {
  return AV.Cloud.run('hLifeFetchShopCommentUpedUserList', payload).then((results)=>{
    // console.log('hLifeFetchShopCommentUpedUserList.results===', results)
    let shopCommentUpedUsers = []
    results.forEach((result)=>{
      shopCommentUpedUsers.push(ShopCommentUp4Cloud.fromLeancloudJson(result))
    })
    // console.log('hLifeFetchShopCommentUpedUserList.shopCommentUpedUsers===', shopCommentUpedUsers)
    return new List(shopCommentUpedUsers)
  }, (err) => {
    // console.log('err=======', err)
    // console.log('err.code=======', err.code)
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function userUpShopComment(payload) {
  let shopCommentUpId = payload.shopCommentUpId
  let shopCommentId = payload.shopCommentId
  let shopId = payload.shopId
  let currentUser = AV.User.current()
  let targetShopComment = AV.Object.createWithoutData('ShopComment', shopCommentId)

  let shopCommentUp = null
  if(shopCommentUpId) {
    shopCommentUp = AV.Object.createWithoutData('ShopCommentUp', shopCommentUpId)
    shopCommentUp.set('status', true)
  }else {
    let ShopCommentUp = AV.Object.extend('ShopCommentUp')
    shopCommentUp = new ShopCommentUp()
    shopCommentUp.set('targetShopComment', targetShopComment)
    shopCommentUp.set('user', currentUser)
  }
  return shopCommentUp.save().then((result)=>{
    let shopComment = shopSelector.selectShopCommentInfo(store.getState(), shopId, shopCommentId)
    // console.log('userUpShopComment.shopComment==', shopComment)
    let pushUserId = shopComment && shopComment.user && shopComment.user.id
    if(pushUserId) {
      let activeUser = authSelector.activeUserInfo(store.getState())
      let shopDetail = shopSelector.selectShopDetail(store.getState(), shopId)
      AVUtils.pushByUserList([pushUserId], {
        alert: `${activeUser.nickname}在${shopDetail.shopName}店铺中点赞了您的评论,立即查看`,
        sceneName: 'SHOP_COMMENT_LIST',
        sceneParams: {
          shopId: shopId
        }
      })
    }

    return result
  }, (err)=>{
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function userUnUpShopComment(payload) {
  let shopCommentUpId = payload.shopCommentUpId
  let shopCommentId = payload.shopCommentId
  let currentUser = AV.User.current()
  let targetShopComment = AV.Object.createWithoutData('ShopComment', shopCommentId)

  let shopCommentUp = null
  if(shopCommentUpId) {
    shopCommentUp = AV.Object.createWithoutData('ShopCommentUp', shopCommentUpId)
    shopCommentUp.set('status', false)
  }else {
    let ShopCommentUp = AV.Object.extend('ShopCommentUp')
    shopCommentUp = new ShopCommentUp()
    shopCommentUp.set('targetShopComment', targetShopComment)
    shopCommentUp.set('user', currentUser)
    shopCommentUp.set('status', false)
  }
  return shopCommentUp.save().then((result)=>{
    return result
  }, (err)=>{
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function reply(payload) {
  let replyShopCommentId = payload.replyShopCommentId
  let replyId = payload.replyId
  let currentUser = AV.User.current()
  let replyContent = payload.replyContent
  let shopId = payload.shopId

  let replyShopComment = AV.Object.createWithoutData('ShopComment', replyShopCommentId)
  let ShopCommentReply = AV.Object.extend('ShopCommentReply')
  let shopCommentReply = new ShopCommentReply()

  shopCommentReply.set('content', replyContent)
  if(replyId) {
    let parentReply = AV.Object.createWithoutData('ShopCommentReply', replyId)
    shopCommentReply.set('parentReply', parentReply)
  }
  shopCommentReply.set('replyShopComment', replyShopComment)
  shopCommentReply.set('user', currentUser)

  return shopCommentReply.save().then((results) => {
    let pushUserId = ''
    if(replyId) {
      let shopCommentReply = shopSelector.selectShopCommentReplyInfo(store.getState(), shopId, replyShopCommentId, replyId)
      pushUserId = shopCommentReply && shopCommentReply.user && shopCommentReply.user.id
    }else {
      let shopComment = shopSelector.selectShopCommentInfo(store.getState(), shopId, replyShopCommentId)
      pushUserId = shopComment && shopComment.user && shopComment.user.id
    }
    if(pushUserId) {
      let shopDetail = shopSelector.selectShopDetail(store.getState(), shopId)
      console.log('reply.pushUserId==', pushUserId)
      let activeUser = authSelector.activeUserInfo(store.getState())
      console.log('reply.activeUser==', activeUser)
      AVUtils.pushByUserList([pushUserId], {
        alert: `${activeUser.nickname}在${shopDetail.shopName}店铺中回复了您的评论,立即查看`,
        sceneName: 'SHOP_COMMENT_LIST',
        sceneParams: {
          shopId: shopId
        }
      })
    }

    return results
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

//deprecated
export function fetchShopCommentReplyList(payload) {
  let replyShopCommentId = payload.replyShopCommentId
  let replyShopComment = AV.Object.createWithoutData('ShopComment', replyShopCommentId)

  let query = new AV.Query('ShopCommentReply')
  query.equalTo('replyShopComment', replyShopComment)

  return query.find().then((results)=>{
    let replyList = []
    // console.log('fetchShopCommentReplyList...results===========', results)
    if(results && results.length) {
      results.forEach((result)=>{
        replyList.push(ShopCommentReply.fromLeancloudObject(result))
      })
    }
    return new List(replyList)
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

//payload: shopCommentId
export function fetchShopCommentReplyListByCloudFunc(payload) {
  let replyShopCommentId = payload.replyShopCommentId
  payload.shopCommentId = replyShopCommentId
  return AV.Cloud.run('hLifeFetchShopCommentReplyList', payload).then((results)=>{
    return results
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function fetchShopTags(payload) {
  let query = new AV.Query('ShopTag')
  return query.find().then((results)=>{
    // console.log('fetchShopTags.results===', results)
    let shopTags = []
    if(results && results.length) {
      results.forEach((result)=>{
        shopTags.push(ShopTag.fromLeancloudObject(result))
      })
    }
    // console.log('fetchShopTags.shopTags===', shopTags)
    return new List(shopTags)
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function fetchUserOwnedShopInfo(payload) {
  let query = new AV.Query('Shop')
  let user = AV.User.current()
  let userId = user.id
  if(payload && payload.userId) {
    userId = payload.userId
    user = AV.Object.createWithoutData('_User', payload.userId)
  }
  query.equalTo('owner', user)
  query.include(['owner', 'targetShopCategory', 'containedTag'])
  return query.first().then((result)=>{
    // console.log('fetchUserOwnedShopInfo.result===', result)
    let shopInfo = {}
    if(result){
      shopInfo = ShopInfo.fromLeancloudObject(result)
    }
    // console.log('shopInfo=====', shopInfo)
    return {
      userId: userId,
      shopInfo: new List([shopInfo])
    }
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function fetchShopFollowers(payload) {
  let shopId = payload.id
  let query = new AV.Query('ShopFollower')
  let shop = AV.Object.createWithoutData('Shop', shopId)
  query.equalTo('shop', shop)
  query.include('follower')
  return query.find().then((results)=> {
    // console.log('fetchShopFollowers.results===', results)
    let shopFollowers = []
    if(results && results.length) {
      results.forEach((result)=>{
        shopFollowers.push(UserInfo.fromShopFollowersLeancloudObject(result))
      })
    }
    // console.log('fetchShopFollowers.shopFollowers===', shopFollowers)
    return new List(shopFollowers)
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function fetchShopFollowersTotalCount(payload) {
  let shopId = payload.id
  let query = new AV.Query('ShopFollower')
  let shop = AV.Object.createWithoutData('Shop', shopId)
  query.equalTo('shop', shop)
  return query.count().then((results)=>{
    // console.log('fetchShopFollowersTotalCount.results===', results)
    return results
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function fetchSimilarShopList(payload) {
  let shopId = payload.id
  let targetShopCategoryId = payload.targetShopCategoryId
  let targetShopCategory = AV.Object.createWithoutData('ShopCategory', targetShopCategoryId)
  let similarQuery = new AV.Query('Shop')
  let notQuery = new AV.Query('Shop')
  similarQuery.equalTo('targetShopCategory', targetShopCategory)
  notQuery.notEqualTo('objectId', shopId)
  let andQuery = AV.Query.and(similarQuery, notQuery)
  andQuery.include(['targetShopCategory', 'owner', 'containedTag'])
  andQuery.addDescending('createdAt')
  andQuery.limit(3)
  return andQuery.find().then(function (results) {
    // console.log('getShopList.results=', results)
    if(__DEV__) {
      let shopList = []
      results.forEach((result) => {
        shopList.push(ShopInfo.fromLeancloudObject(result))
      })
      return new List(shopList)
    }else {
      return AV.GeoPoint.current().then(function(geoPoint){
        let shopList = []
        results.forEach((result) => {
          result.userCurGeo = geoPoint
          shopList.push(ShopInfo.fromLeancloudObject(result))
        })
        return new List(shopList)
      })
    }
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function fetchGuessYouLikeShopList(payload) {
  let id = payload.id
  let query = new AV.Query('Shop')
  query.notEqualTo('objectId', id)
  query.include(['targetShopCategory', 'owner', 'containedTag'])
  let random = Math.random() * 10
  if(random <= 2) {
    query.addDescending('createdAt')
  }else if(random <= 5) {
    query.addAscending('createdAt')
  }else if(random <= 7) {
    query.addDescending('pv')
  }else {
    query.addDescending('score')
  }
  query.limit(3)
  return query.find().then(function (results) {
    // console.log('fetchGuessYouLikeShopList.results=', results)
    if(__DEV__) {
      let shopList = []
      results.forEach((result) => {
        shopList.push(ShopInfo.fromLeancloudObject(result))
      })
      return new List(shopList)
    }else {
      return AV.GeoPoint.current().then(function(geoPoint){
        let shopList = []
        results.forEach((result) => {
          result.userCurGeo = geoPoint
          shopList.push(ShopInfo.fromLeancloudObject(result))
        })
        return new List(shopList)
      })
    }
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function submitShopPromotion(payload) {
  let shopId = payload.shopId
  let typeId = payload.typeId
  let type = payload.type
  let typeDesc = payload.typeDesc
  let coverUrl = payload.coverUrl
  let title = payload.title
  let promotingPrice = payload.promotingPrice
  let originalPrice = payload.originalPrice
  let abstract = payload.abstract
  let promotionDetailInfo = payload.promotionDetailInfo

  if(Object.prototype.toString.call(promotionDetailInfo) === '[object Array]') {
    promotionDetailInfo = JSON.stringify(promotionDetailInfo)
  }

  let shop = AV.Object.createWithoutData('Shop', shopId)

  let ShopPromotion = AV.Object.extend('ShopPromotion')
  let shopPromotion = new ShopPromotion()
  shopPromotion.set('targetShop', shop)
  shopPromotion.set('typeId', typeId)
  shopPromotion.set('type', type)
  shopPromotion.set('typeDesc', typeDesc)
  shopPromotion.set('coverUrl', coverUrl)
  shopPromotion.set('title', title)
  shopPromotion.set('promotingPrice', promotingPrice)
  shopPromotion.set('originalPrice', originalPrice)
  shopPromotion.set('abstract', abstract)
  shopPromotion.set('promotionDetailInfo', promotionDetailInfo)

  return shopPromotion.save().then((results) => {
    // console.log('submitShopPromotion===results=', results)
    return results
  }, function (err) {
    // console.log('submitShopPromotion===err=', err)
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}




