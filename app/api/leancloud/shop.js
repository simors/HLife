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
import * as Utils from '../../util/Utils'
import * as shopSelector from '../../selector/shopSelector'
import * as authSelector from '../../selector/authSelector'
import * as configSelector from '../../selector/configSelector'
import * as locSelector from '../../selector/locSelector'
import {store} from '../../store/persistStore'

export function fetchNearbyShops(payload) {
  let params = {
    shopCategoryId: payload.shopCategoryId,
    shopTagId: payload.shopTagId,
    sortId: payload.sortId,
    distance: payload.distance,
    geo: payload.geo,
    lastDistance: payload.lastDistance,
    limit: 30,
  }
  return AV.Cloud.run('shopFetchNearbyShops', params).then((shopInfo) => {
    return shopInfo
  }, (err) => {
    console.log(err)
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  }).catch((err) => {
    console.log(err)
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function fetchShopPromotion(payload) {
  let params = {
    geo: payload.geo,
    lastDistance: payload.lastDistance,
    limit: 30,
  }
  return AV.Cloud.run('shopFetchNearbyPromotion', params).then((promotionInfo) => {
    return promotionInfo
  }, (err) => {
    console.log(err)
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  }).catch((err) => {
    console.log(err)
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function fetchShopPromotionDetail(payload) {
  let id = payload.id
  let query = new AV.Query('ShopPromotion')
  query.equalTo('objectId', id)
  query.include(['targetShop', 'targetShop.owner'])
  return query.first().then(function (result) {
    // console.log('fetchShopPromotionsDetail.result=', result)
    let shopPromotionInfo = ShopPromotion.fromLeancloudObject(result)
    return new Map(shopPromotionInfo)
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
    let shopInfo = ShopInfo.fromLeancloudObject(result)
    return new Map(shopInfo)
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
  let userId = ''
  let isRefresh = true
  let lastCreatedAt = ''

  let currentUser = AV.User.current()
  userId = currentUser.id

  if(payload) {
    userId = payload.userId || currentUser.id
    if(!payload.isRefresh && payload.lastCreatedAt) {
      isRefresh = false
      lastCreatedAt = payload.lastCreatedAt
    }
  }else {
    userId = currentUser.id
  }

  let user = AV.Object.createWithoutData('_User', userId)
  // let query = new AV.Query('ShopFollowee')
  // query.equalTo('user', user)
  let query = new AV.Query('ShopFollower')
  query.equalTo('follower', user)
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
  // query.include(['followee','followee.targetShopCategory', 'followee.owner', 'followee.containedTag'])
  query.include(['shop','shop.targetShopCategory', 'shop.owner', 'shop.containedTag', 'shop.containedPromotions'])
  let userFollowedShops = []
  return query.find().then(function(results) {
    // console.log('fetchUserFollowShops.results=====', results)
    results.forEach((result)=>{
      userFollowedShops.push(ShopInfo.fromLeancloudObject(result, 'shop'))
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

  return query.first().then((result)=>{
    // console.log('isFollowedShop.result===', result)
    if(result && result.id) {
      return {
        shopFollowerId: result.id,
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

    // let ShopFollowee = AV.Object.extend('ShopFollowee')
    // let shopFollowee = new ShopFollowee()
    // shopFollowee.set('user', currentUser)
    // shopFollowee.set('followee', shop)

    return shopFollower.save().then(function(shopFollowerResult){
      //return shopFollowee.save()
      return shopFollowerResult
    }).then(()=>{
      let shopDetail = shopSelector.selectShopDetail(store.getState(), shopId)
      // console.log('followShop.shopDetail==', shopDetail)
      // console.log('followShop.currentUser==', currentUser)
      if(currentUser.id != shopDetail.owner.id) {
        AVUtils.pushByUserList([shopDetail.owner.id], {
          alert: '有新的用户关注了您的店铺,立即查看',
        })
      }
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

export function unFollowShop(payload) {

  return isFollowedShop(payload).then((result) =>{
    // console.log('isFollowedShop.result===', result)
    if(result && '10000' == result.code) {
      return result
    }

    let shopId = payload.id
    let shopFollowerId = result.shopFollowerId
    let shop = AV.Object.createWithoutData('Shop', shopId)
    let currentUser = AV.User.current()

    let shopFollower = AV.Object.createWithoutData('ShopFollower', shopFollowerId)
    shopFollower.set('follower', currentUser)
    shopFollower.set('shop', shop)

    return shopFollower.destroy().then(function(shopFollowerResult){
      // console.log('shopFollowerResult===', shopFollowerResult)
      return shopFollowerResult
    }).then(()=>{
      let shopDetail = shopSelector.selectShopDetail(store.getState(), shopId)
      // console.log('followShop.shopDetail==', shopDetail)
      // if(currentUser.id != shopDetail.owner.id) {
      //   AVUtils.pushByUserList([shopDetail.owner.id], {
      //     alert: '有用户取消了对您店铺的关注,立即查看',
      //   })
      // }
      return {
        shopId: shopId,
        code: '10003',
        message: '取消关注成功'
      }
    }).catch((err) =>{
      // console.log('fasdfads===>>>>', err)
      err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
      throw err
    })
  }).catch((err) =>{
    // console.log('zzzzzzz=====', err)
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function submitShopComment(payload) {
  let shopId = payload.shopId
  // let score = payload.score
  let content = payload.content
  let blueprints = payload.blueprints
  // let shop = AV.Object.createWithoutData('Shop', shopId)
  let currentUser = AV.User.current()
  let commentId = payload.commentId
  let replyId = payload.replyId
  let params = {
    shopId: shopId,
    userId: currentUser.id,
    content: content,
    blueprints: blueprints,
    replyId: replyId,
    commentId: commentId
  }

  return AV.Cloud.run('pubulishShopComment',{payload: params}).then((results) => {
    // console.log('submitShopComment.results=', results)
    let shopDetail = shopSelector.selectShopDetail(store.getState(), shopId)
    let activeUser = authSelector.activeUserInfo(store.getState())
    // console.log('followShop.shopDetail==', shopDetail)
    if(activeUser.id != shopDetail.owner.id) {
      AVUtils.pushByUserList([shopDetail.owner.id], {
        alert: `${activeUser.nickname}评论了您的店铺,立即查看`,
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
  query.equalTo('status', 1)
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
  console.log('hahahahah==>',payload)
  // let shopCommentUpId = payload.shopCommentUpId
  let shopCommentId = payload.shopCommentId
  let shopId = payload.shopId
  // let currentUser = AV.User.current()
  let params = {
    userId: authSelector.activeUserId(store.getState()),
    shopCommentId: payload.shopCommentId
  }
  return AV.Cloud.run('userUpShopComment',{payload: params}).then((result)=>{
    let shopComment = shopSelector.selectShopCommentInfo(store.getState(), shopId, shopCommentId)
    // console.log('userUpShopComment.shopComment==', shopComment)
    let pushUserId = shopComment && shopComment.user && shopComment.user.id
    if(pushUserId) {
      let activeUser = authSelector.activeUserInfo(store.getState())
      let shopDetail = shopSelector.selectShopDetail(store.getState(), shopId)
      if(activeUser.id != pushUserId) {
        AVUtils.pushByUserList([pushUserId], {
          alert: `${activeUser.nickname}在${shopDetail.shopName}店铺中点赞了您的评论,立即查看`,
          sceneName: 'SHOP_COMMENT_LIST',
          sceneParams: {
            shopId: shopId
          }
        })
      }
    }
    // console.log('successs====>',result)
    return result
  }, (err)=>{
    // console.log('err====>',err)

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
      // console.log('reply.pushUserId==', pushUserId)
      let activeUser = authSelector.activeUserInfo(store.getState())
      // console.log('reply.activeUser==', activeUser)
      if(activeUser.id != pushUserId) {
        AVUtils.pushByUserList([pushUserId], {
          alert: `${activeUser.nickname}在${shopDetail.shopName}店铺中回复了您的评论,立即查看`,
          sceneName: 'SHOP_COMMENT_LIST',
          sceneParams: {
            shopId: shopId
          }
        })
      }
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

export function unregistShop(payload) {
  return AV.Cloud.run('hLifeUnregistShop', payload).then(result=>{
    return result
  }, err=>{
    throw err
  })
}

export function fetchUserOwnedShopInfo(payload) {
  let query = new AV.Query('Shop')
  let user = null
  let userId = ''
  if(payload && payload.userId) {
    userId = payload.userId
  }else {
    userId = authSelector.activeUserId(store.getState())
  }
  user = AV.Object.createWithoutData('_User', userId)

  query.equalTo('owner', user)
  //query.equalTo('status', 1)
  query.include(['owner', 'targetShopCategory', 'containedTag', 'containedPromotions'])
  // console.log('fetchUserOwnedShopInfo.query====', query)
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

export function fetchAllShopFollowerIds(payload) {
  let shopId = payload.id
  let query = new AV.Query('ShopFollower')
  let shop = AV.Object.createWithoutData('Shop', shopId)
  query.equalTo('shop', shop)
  query.limit(500)
  return query.find().then((results)=> {
    // console.log('fetchShopFollowers.results===', results)
    let shopFollowerIds = []
    if(results && results.length) {
      results.forEach((result)=>{
        shopFollowerIds.push(result.attributes.follower.id)
      })
    }
    // console.log('fetchShopFollowers.shopFollowers===', shopFollowers)
    return shopFollowerIds
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function fetchShopFollowers(payload) {
  let shopId = payload.id
  let isRefresh = payload.isRefresh
  let lastCreatedAt = payload.lastCreatedAt
  let params = {
    shopId,
    isRefresh,
    lastCreatedAt
  }
  // console.log('hLifeFetchShopFollowers===params=====', params)
  return AV.Cloud.run('hLifeFetchShopFollowers', params).then((result) => {
    // console.log('hLifeFetchShopFollowers===result===', result)
    if(result.code == 0) {
      return new List(result.shopFollowers)
    }else{
      throw result
    }
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
  similarQuery.equalTo('status', 1)

  similarQuery.notEqualTo('objectId', shopId)
  similarQuery.include(['targetShopCategory', 'owner', 'containedTag', 'containedPromotions'])
  similarQuery.addDescending('createdAt')
  similarQuery.limit(3)
  similarQuery.equalTo('payment', 1)
  similarQuery.exists('coverUrl')
  
  // notQuery.notEqualTo('objectId', shopId)
  // let andQuery = AV.Query.and(similarQuery, notQuery)
  // andQuery.include(['targetShopCategory', 'owner', 'containedTag', 'containedPromotions'])
  // andQuery.addDescending('createdAt')
  // andQuery.limit(3)
  
  return similarQuery.find().then(function (results) {
    console.log('fetchSimilarShopList.results=', results)
    let shopList = []
    results.forEach((result) => {
      shopList.push(ShopInfo.fromLeancloudObject(result))
    })
    return new List(shopList)
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function fetchGuessYouLikeShopList(payload) {
  let id = payload.id
  let query = new AV.Query('Shop')
  query.notEqualTo('objectId', id)
  query.include(['targetShopCategory', 'owner', 'containedTag', 'containedPromotions'])
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
  // query.addDescending('score')
  query.limit(3)
  query.equalTo('status', 1)
  query.equalTo('payment', 1)
  query.exists('coverUrl')
  return query.find().then(function (results) {
    // console.log('fetchGuessYouLikeShopList.results====*******>>>>>>=', results)
    let shopList = []
    results.forEach((result) => {
      shopList.push(ShopInfo.fromLeancloudObject(result))
    })
    return new List(shopList)
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function submitShopPromotion(payload) {
  // console.log('submitShopPromotion.payload===', payload)
  let shopId = payload.shopId
  let shopPromotionId = payload.shopPromotionId
  let status = payload.status
  let typeId = payload.typeId + ""
  let type = payload.type
  let typeDesc = payload.typeDesc
  let coverUrl = payload.coverUrl
  let title = payload.title
  let promotingPrice = payload.promotingPrice
  let originalPrice = payload.originalPrice
  let abstract = payload.abstract
  let promotionDetailInfo = payload.promotionDetailInfo
  let geo = payload.geo

  if(Object.prototype.toString.call(promotionDetailInfo) === '[object Array]') {
    promotionDetailInfo = JSON.stringify(promotionDetailInfo)
  }

  let shop = AV.Object.createWithoutData('Shop', shopId)

  let shopPromotion = null
  if(shopPromotionId) {
    shopPromotion = AV.Object.createWithoutData('ShopPromotion', shopPromotionId)
    shopPromotion.set('status', status)
  }else {
    let ShopPromotion = AV.Object.extend('ShopPromotion')
    shopPromotion = new ShopPromotion()
  }

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
  shopPromotion.set('geo', geo)

  return shopPromotion.save().then((results) => {
    // console.log('submitShopPromotion===results=', results)
    if(!shopPromotionId || (shopPromotionId && '1' == status)) {
      let promotion = AV.Object.createWithoutData('ShopPromotion', results.id)
      shop.addUnique('containedPromotions', [promotion])
      // console.log('shop/////>>>>>>>>>>', shop)
      return shop.save().then((result)=>{
        return true
        // console.log('rep---->>>>', rep)
      }, (error)=>{
        return false
        // console.log('error.........>>>>', error)
      })
    }
  }, function (err) {
    // console.log('submitShopPromotion===err=', err)
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function shopCertification(payload) {
  // console.log('shopCertification.payload====', payload)
  let params = {
    // name: payload.name,
    phone: payload.phone,
    shopName: payload.shopName,
    shopAddress: payload.shopAddress,
    geo: payload.geo,
    geoCity: payload.geoCity,
    geoDistrict: payload.geoDistrict,
    // certification: payload.certification,
  }

  let provincesAndCities = configSelector.selectProvincesAndCities(store.getState())
  // console.log('provincesAndCities====', provincesAndCities)

  let provinceInfo = Utils.getProvinceInfoByCityName(provincesAndCities, payload.geoCity)

  let province = provinceInfo.provinceName
  // console.log('province====', province)
  let provinceCode = provinceInfo.provinceCode
  // console.log('provinceCode====', provinceCode)

  let cityCode = Utils.getCityCode(provincesAndCities, payload.geoCity)
  // console.log('cityCode====', cityCode)

  let districtCode = Utils.getDistrictCode(provincesAndCities, payload.geoDistrict)

  params.geoProvince = province
  params.geoProvinceCode = provinceCode
  params.geoCityCode = cityCode
  params.geoDistrictCode = districtCode

  let userId = authSelector.activeUserId(store.getState())
  params.userId = userId

  // console.log('shopCertification.params====', params)
  return AV.Cloud.run('hLifeShopCertificate', params).then((result) => {
    // console.log('shopCertification.result====', result)
    return result && result.shopInfo
  }, (err) => {
    console.log('hLifeShopCertificate.err=====', err)
    throw err
  })
}

export function fetchShopPromotionMaxNum(payload) {
  return AV.Cloud.run('hLifeGetShopPromotionMaxNum', payload).then(result=>{
    if(result && result.errcode == '0') {
      return result.message
    }
    return 3
  }, reason=>{
    return 3
  })
}

export function fetchShopPromotionDayPay(payload) {
  return AV.Cloud.run('getShopPromotionDayPay', payload).then(result=>{
    if(result && result.errcode == '0') {
      return result.message
    }
    return 3
  }, reason=>{
    return 3
  })
}

export function fetchMyShopExpiredPromotionList(payload) {
  let isRefresh = payload.isRefresh
  let lastUpdatedAt = payload.lastUpdatedAt
  let user = AV.User.current()
  let userId = user.id
  let query = new AV.Query('ShopPromotion')

  query.include(['targetShop', 'targetShop.owner'])
  query.limit(5) // 最多返回 5 条结果

  if(!isRefresh) { //分页查询
    query.lessThan('updatedAt', lastUpdatedAt)
  }

  query.equalTo('status', "0")
  query.addDescending('updatedAt')

  // console.log('fetchMyShopExpiredPromotionList.query==*******===', query)
  return query.find().then(function (results) {
    // console.log('fetchMyShopExpiredPromotionList.results===*******===', results)
    let shopPromotionList = []
    results.forEach((result) => {
      shopPromotionList.push(ShopPromotion.fromLeancloudObject(result))
    })
    // return new List(shopPromotionList)
    return {
      userId: userId,
      shopPromotionList: new List(shopPromotionList)
    }
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })

}

export function updateShopPromotion(payload) {
  // console.log('updateShopPromotion===payload=', payload)
  let updateType = payload.updateType //1-改变状态; 2-删除; 3-更新信息
  let shopPromotionId = payload.shopPromotionId
  let shopPromotion = AV.Object.createWithoutData('ShopPromotion', shopPromotionId)

  if(1 == updateType || 2 == updateType) {
    let status = "2"
    if(1 == updateType) {
      status = payload.status + ""
    }

    let containedPromotions = payload.containedPromotions
    let containedPromotionObjs = []
    containedPromotions.forEach((item)=>{
      let obj = AV.Object.createWithoutData('ShopPromotion', item.id)
      containedPromotionObjs.push(obj)
    })
    let shopId = payload.shopId

    let shop = AV.Object.createWithoutData('Shop', shopId)
    shopPromotion.set('status', status)

    return shopPromotion.save().then((results) => {
      shop.set('containedPromotions', containedPromotionObjs)
      // console.log('shop/////>>>>>>>>>>', shop)
      return shop.save().then((rep)=>{
        // console.log('rep---->>>>', rep)
        return true
      }, (error)=>{
        // console.log('error.........>>>>', error)
        return false
      })
    }, function (err) {
      // console.log('updateShopPromotion===err=', err)
      return false
    })
  }else{
    let typeId = payload.typeId + ""
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
      return true
    }, function (err) {
      return false
    })
  }

}

export function updateShopLocationInfo(payload) {
  // console.log('updateUserLocationInfo.payload====', payload)

  let shopId = payload.shopId

  let provincesAndCities = configSelector.selectProvincesAndCities(store.getState())
  // console.log('provincesAndCities====', provincesAndCities)

  let province = locSelector.getProvince(store.getState())
  // console.log('province====', province)
  let provinceCode = Utils.getProvinceCode(provincesAndCities, province)
  // console.log('provinceCode====', provinceCode)

  let city = locSelector.getCity(store.getState())
  // console.log('city====', city)
  let cityCode = Utils.getCityCode(provincesAndCities, city)
  // console.log('cityCode====', cityCode)

  let district = locSelector.getDistrict(store.getState())
  // console.log('district====', district)
  let districtCode = Utils.getDistrictCode(provincesAndCities, district)
  // console.log('districtCode====', districtCode)

  let latlng = locSelector.getGeopoint(store.getState())

  let params = {
    shopId,
    province,
    provinceCode,
    city,
    cityCode,
    district,
    districtCode,
    ...latlng
  }
  // console.log('hLifeUpdateShopLocationInfo.params=======', params)
  return AV.Cloud.run('hLifeUpdateShopLocationInfo', params).then((result)=>{
    // console.log('hLifeUpdateShopLocationInfo.result=======', result)
    return result
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function updateShopInfoAfterPaySuccess(payload) {
  return AV.Cloud.run('hLifeUpdateShopInfoAfterPaySuccess', payload).then((result)=> {
    return true
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function addNewShopGoods(payload) {
  let params = {
    shopId: payload.shopId,
    goodsName: payload.goodsName,
    price: payload.price,
    originalPrice: payload.originalPrice,
    coverPhoto: payload.coverPhoto,
    album: payload.album,
    detail: payload.detail,
  }
  return AV.Cloud.run('goodsAddShopGoods', params).then((goodsInfo)=> {
    return goodsInfo
  }, (err) => {
    throw err
  })
}

export function modifyShopGoods(payload) {
  let params = {
    goodsId: payload.goodsId,
    goodsName: payload.goodsName,
    price: payload.price,
    originalPrice: payload.originalPrice,
    coverPhoto: payload.coverPhoto,
    album: payload.album,
    detail: payload.detail,
  }
  return AV.Cloud.run('goodsModifyShopGoods', params).then((goodsInfo)=> {
    return goodsInfo
  }, (err) => {
    throw err
  })
}

export function goodsOnline(payload) {
  let params = {
    goodsId: payload.goodsId,
  }
  return AV.Cloud.run('goodsShopGoodsOnline', params).then((goodsInfo)=> {
    return goodsInfo
  }, (err) => {
    throw err
  })
}

export function goodsOffline(payload) {
  let params = {
    goodsId: payload.goodsId,
  }
  return AV.Cloud.run('goodsShopGoodsOffline', params).then((goodsInfo)=> {
    return goodsInfo
  }, (err) => {
    throw err
  })
}

export function goodsDelete(payload) {
  let params = {
    goodsId: payload.goodsId,
  }
  return AV.Cloud.run('goodsShopGoodsDelete', params).then((goodsInfo)=> {
    return goodsInfo
  }, (err) => {
    throw err
  })
}

export function fetchShopGoodsList(payload) {
  let params = {
    shopId: payload.shopId,
    status: payload.status,
    limit: payload.limit,
    lastUpdateTime: payload.lastUpdateTime,
  }
  return AV.Cloud.run('goodsFetchGoodsList', params).then((goodsInfo)=> {
    return goodsInfo
  }, (err) => {
    throw err
  })
}

export function submitShopGoodPromotion(payload) {
  let params = {
   payload:payload
  }
  return AV.Cloud.run('submitShopPromotion', params).then((goodsInfo)=> {
    return goodsInfo
  }, (err) => {
    throw err
  })
}

export function fetchNearbyShopGoodPromotion(payload) {
  let params = {
    geo: payload.geo,
    lastDistance: payload.lastDistance,
    limit: 30,
    nowDate: payload.nowDate
  }
  console.log('params',params)
  return AV.Cloud.run('fetchNearbyShopGoodPromotion', params).then((promotions)=> {

    return promotions
  }, (err) => {
    throw err
  })
}

export function fetchOpenShopGoodPromotions(payload) {
  let params = {
    limit: 10,
    nowDate: payload.nowDate,
    shopId: payload.shopId,
    lastCreatedAt: payload.lastCreatedAt,

  }
  return AV.Cloud.run('fetchOpenPromotionsByShopId', params).then((promotions)=> {
    return promotions
  }, (err) => {
    throw err
  })
}

export function fetchCloseShopGoodPromotions(payload) {
  let params = {
    limit: 30,
    nowDate: payload.nowDate,
    shopId: payload.shopId,
    lastCreatedAt: payload.lastCreatedAt,
  }

  return AV.Cloud.run('fetchCloPromotionsByShopId', params).then((promotions)=> {

    return promotions
  }, (err) => {
    throw err
  })
}

export function closeShopPromotion(payload) {
  let params = {
    promotionId:payload.promotionId
  }

  return AV.Cloud.run('closeShopPromotion', params).then((promotion)=> {

    return promotion
  }, (err) => {
    throw err
  })
}

export function getUserOrders(payload) {
  let params = {
    buyerId: payload.buyerId,
    orderStatus: payload.orderStatus,
    lastTime: payload.lastTime,
    limit: payload.limit,
  }
  return AV.Cloud.run('orderQueryOrders', params).then((result) => {
    return result
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function getShopperOrders(payload) {
  let params = {
    vendorId: payload.vendorId,
    orderStatus: payload.orderStatus,
    lastTime: payload.lastTime,
    limit: payload.limit,
  }
  return AV.Cloud.run('orderQueryOrders', params).then((result) => {
    return result
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function fetchAllMyCommentUps(){
  let payload = {
    userId: authSelector.activeUserId(store.getState())
  }
  return AV.Cloud.run('fetchMyShopCommentsUps',payload).then((ups)=>{
    return ups
  },(err)=>{
    throw(err)
  })
}

export function fetchShopCommentsByCloud(payload){
  return AV.Cloud.run('fetchShopComments',payload).then((result)=>{

    return result
  },(err)=>{

    throw err
  })
}

export function setOrderStatus(payload) {
  let params = {
    orderId: payload.orderId,
    orderStatus: payload.orderStatus,
  }
  return AV.Cloud.run('orderModifyStatus', params).then((result) => {
    return result
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}
