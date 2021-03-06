/**
 * Created by zachary on 2016/12/14.
 */
import {Record} from 'immutable'
import {activeUserId, userInfoById} from './authSelector'

export function selectShop(state) {
  return state.SHOP.toJS()
}

export function selectShopList(state) {
  return selectShop(state).shopList
}

export function selectLocalShopList(state) {
  return selectShop(state).localShopList || []
}

export function selectShopPromotionList(state) {
  return selectShop(state).shopPromotionList || []
}

export function selectMyShopExpiredPromotionList(state, userId) {
  let expriredPromotionList = state.SHOP.getIn(['myShopExpriredPromotionList', userId])
  if (expriredPromotionList && expriredPromotionList.size) {
    return expriredPromotionList.toJS()
  }
  return []
}

export function selectShopPromotionMaxNum(state) {
  return selectShop(state).shopPromotionMaxNum
}

export function selectShopPromotionDayPay(state) {
  return selectShop(state).dayPay
}

export function selectUserFollowedShopList(state, userId) {
  let userFollowedShopList = state.SHOP.getIn(['userFollowedShops', userId])
  if (userFollowedShopList && userFollowedShopList.size) {
    return userFollowedShopList.toJS()
  }
  return []
}

export function selectFetchShopListIsArrivedLastPage(state) {
  return state.SHOP.get('fetchShopListArrivedLastPage')
}

export function selectShopDetail(state, id) {
  let shopDetail = {owner: {}}
  let shopList = selectShop(state).shopList
  if (shopList && shopList.length) {
    for (let i = 0; i < shopList.length; i++) {
      if (shopList[i].id == id) {
        shopDetail = shopList[i]
        break
      }
    }
  }

  if (!shopDetail.id) {
    if (state.SHOP.getIn(['shopDetails', id])) {
      return state.SHOP.getIn(['shopDetails', id]).toJS()
    }
  }

  // console.log('shopDetail=', shopDetail)
  if (shopDetail instanceof Record) {
    return shopDetail.toJS()
  } else {
    return shopDetail
  }
}

export function selectShopDetailDirect(state, id) {
  let shopDetail = state.SHOP.getIn(['shopDetails', id])
  if (shopDetail) {
    return shopDetail.toJS()
  }
  return undefined
}

export function selectShopPromotionDetail(state, id) {
  let shopPromotionDetail = {targetShop: {}}
  let shopPromotionList = selectShopPromotionList(state)
  if (shopPromotionList && shopPromotionList.length) {
    for (let i = 0; i < shopPromotionList.length; i++) {
      if (shopPromotionList[i].id == id) {
        shopPromotionDetail = shopPromotionList[i]
        break
      }
    }
  }

  if (!shopPromotionDetail.id) {
    if (state.SHOP.getIn(['shopPromotionDetails', id])) {
      shopPromotionDetail = state.SHOP.getIn(['shopPromotionDetails', id]).toJS()
    }
  }

  // console.log('shopPromotionDetail=', shopPromotionDetail)
  return shopPromotionDetail
}

export function selectShopAnnouncements(state, shopId) {
  return selectShop(state).shopAnnouncements[shopId] || []
}

export function selectLatestShopAnnouncemment(state, shopId) {
  let shopAnnouncements = selectShopAnnouncements(state, shopId)
  if (shopAnnouncements && shopAnnouncements.length) {
    return shopAnnouncements[0]
  }
  return {}
}

export function selectUserFollowShopsInfo(state) {
  return state.SHOP.get('userFollowShopsInfo')
}

export function selectUserIsFollowShop(state, shopId) {
  let userFollowShopsInfo = selectUserFollowShopsInfo(state)
  if (userFollowShopsInfo && userFollowShopsInfo.size) {
    return userFollowShopsInfo.get(shopId)
  }
  return false
}

export function selectShopComments(state, shopId) {
  return selectShop(state).shopComments[shopId] || []
}

export function selectShopCommentInfo(state, shopId, shopCommentId) {
  let shopComments = selectShopComments(state, shopId)
  if (shopComments && shopComments.length) {
    for (let i = 0; i < shopComments.length; i++) {
      let shopComment = shopComments[i]
      if (shopComment.id == shopCommentId) {
        return shopComment
      }
    }
  }
  return {}
}

export function selectShopCommentReplyInfo(state, shopId, shopCommentId, replyId) {
  let shopComment = selectShopCommentInfo(state, shopId, shopCommentId)
  let shopCommentReplys = shopComment.containedReply
  if (shopCommentReplys && shopCommentReplys.length) {
    for (let i = 0; i < shopCommentReplys.length; i++) {
      let shopCommentReply = shopCommentReplys[i]
      if (shopCommentReply.id == replyId) {
        return shopCommentReply
      }
    }
  }
  return {}
}

export function selectShopCommentsTotalCount(state, shopId) {
  return selectShop(state).shopCommentsTotalCounts[shopId]
}

export function selectUserIsUpedShop(state, shopId) {
  let userUpShopsInfo = state.SHOP.get('userUpShopsInfo')
  if (userUpShopsInfo && userUpShopsInfo.size) {
    return userUpShopsInfo.get(shopId)
  }
  return false
}

export function selectShopCommentUps(state, shopId, shopCommentId) {
  let shopComments = selectShop(state).shopComments[shopId]
  let containedUps = []
  if (shopComments && shopComments.length) {
    for (let i = 0; i < shopComments.length; i++) {
      if (shopComments[i].id == shopCommentId) {
        containedUps = shopComments[i].containedUps
      }
    }
  }
  return containedUps
}

export function selectActiveUserIsUpedShopComment(state, shopId, shopCommentId, activeUserId) {
  let shopCommentUps = selectShopCommentUps(state, shopId, shopCommentId)
  if (shopCommentUps && shopCommentUps.length) {
    for (let i = 0; i < shopCommentUps.length; i++) {
      if (shopCommentUps[i].user.id == activeUserId) {
        if (shopCommentUps[i].status) {
          return true
        }
        return false
      }
    }
  }
  return false
}

export function selectShopCommentUpId(state, shopId, shopCommentId, activeUserId) {
  let shopCommentUps = selectShopCommentUps(state, shopId, shopCommentId)
  if (shopCommentUps && shopCommentUps.length) {
    for (let i = 0; i < shopCommentUps.length; i++) {
      if (shopCommentUps[i].user.id == activeUserId) {
        return shopCommentUps[i].id
      }
    }
  }
  return false
}

export function selectShopTags(state) {
  return state.SHOP.get('shopTagList').toJS()
}

export function selectUserOwnedShopInfo(state, userId) {
  let _userId = activeUserId(state)
  if (userId) {
    _userId = userId
  }
  if (state.SHOP.getIn(['userOwnedShopInfo', _userId]) && state.SHOP.getIn(['userOwnedShopInfo', _userId]).size) {
    // console.log('state.SHOP.get(userOwnedShopInfo).toJS()[0]===', state.SHOP.get('userOwnedShopInfo').toJS()[0])
    return state.SHOP.getIn(['userOwnedShopInfo', _userId]).toJS()[0]
  }
  return {}
}

export function selectShopFollowers(state, shopId) {
  if (state.SHOP.getIn(['shopFollowers', shopId])) {
    return state.SHOP.getIn(['shopFollowers', shopId]).toJS()
  }
  return []
}

export function selectShopFollowersTotalCount(state, shopId) {
  if (state.SHOP.getIn(['shopFollowersTotalCount', shopId])) {
    return state.SHOP.getIn(['shopFollowersTotalCount', shopId])
  }
  return 0
}

export function selectSimilarShopList(state, shopId) {
  if (state.SHOP.getIn(['similarShops', shopId])) {
    return state.SHOP.getIn(['similarShops', shopId]).toJS()
  }
  return []
}

export function selectGuessYouLikeShopList(state) {
  if (state.SHOP.get('guessYouLikeShopList')) {
    return state.SHOP.get('guessYouLikeShopList').toJS()
  }
  return []
}

export function selectGoodsById(state, shopId, goodsId) {
  let goodsList = state.SHOP.getIn(['shopGoods', shopId])
  if (goodsList) {
    let goods = goodsList.find((goodsInfo) => {
      return goodsInfo.id == goodsId
    })
    if (goods) {
      return goods.toJS()
    } else {
      return undefined
    }
  }
  return undefined
}

export function selectGoodsList(state, shopId, status) {
  let goodsList = state.SHOP.getIn(['shopGoods', shopId])
  let retList = []
  if (goodsList) {
    goodsList.forEach((goods) => {
      if (goods.status == status) {
        retList.push(goods.toJS())
      }
    })
  }
  return retList
}

export function selectLocalGoodPromotion(state) {
  let localPromotions = state.SHOP.get('localGoodPromotionList') || []
  let promotions = []
  if (localPromotions && localPromotions.size) {
    localPromotions.forEach((promotionId)=> {
      let promotion = state.SHOP.getIn(['allGoodPromotions', promotionId])
      promotions.push(promotion.toJS())
    })
  }
  return promotions
}

export function selectOpenGoodPromotion(state) {
  let localPromotions = state.SHOP.get('openGoodPromotionList') || []
  let promotions = []
  if (localPromotions && localPromotions.size) {
    localPromotions.forEach((promotionId)=> {
      let promotion = state.SHOP.getIn(['allGoodPromotions', promotionId])
      promotions.push(promotion.toJS())
    })
  }
  return promotions
}

export function selectCloseGoodPromotion(state) {
  let localPromotions = state.SHOP.get('closeGoodPromotionList') || []
  let promotions = []
  if (localPromotions && localPromotions.size) {
    localPromotions.forEach((promotionId)=> {
      let promotion = state.SHOP.getIn(['allGoodPromotions', promotionId])
      promotions.push(promotion.toJS())
    })
  }
  return promotions
}

export function selectShopGoodsDetail(state, goodsId) {
  let goodsDetail = state.SHOP.getIn(['shopGoodsDetail', goodsId])
  if (goodsDetail) {
    return goodsDetail.toJS()
  }
  return undefined
}

function constructOrderList(state, orderIds) {
  let userOrders = []
  orderIds.forEach((orderId) => {
    let orderRec = state.SHOP.getIn(['orderDetail', orderId])
    if (orderRec) {
      let order = orderRec.toJS()
      let vendorId = order.vendorId
      let vendor = selectShopDetailDirect(state, vendorId)
      let buyerId = order.buyerId
      let buyer = userInfoById(state, buyerId).toJS()
      let goodsId = order.goodsId
      let goods = selectShopGoodsDetail(state, goodsId)
      userOrders.push({
        ...order,
        buyer,
        vendor,
        goods,
      })
    }
  })
  return userOrders
}

export function selectCommentsForComment(state, commentId) {
  let shops = state.SHOP.getIn(['shopCommentsForComment', commentId]) || []
  let commentList = []
  let commentIdList = []
  if (shops && shops.size) {
    shops.forEach((commentInfo)=> {
      let comment = state.SHOP.getIn(['allShopComments', commentInfo])
      if (comment) {
        commentIdList.push(commentInfo)
        commentList.push(comment.toJS())
      }
    })
  }
  return {commentList: commentList, commentIdList: commentIdList}
}

export function selectCommentsForShop(state, shopId) {
  let shops = state.SHOP.getIn(['shopCommentsForShop', shopId]) || []
  let commentList = []
  let commentIdList = []

  if (shops && shops.size) {
    shops.forEach((commentId)=> {
      let comment = state.SHOP.getIn(['allShopComments', commentId])
      if (comment) {
        commentList.push(comment.toJS())
        commentIdList.push(commentId)

      }
    })
  }
  return {commentList: commentList, commentIdList: commentIdList}
}


export function isCommentLiked(state, commentId) {
  let commentUps = state.SHOP.get('myCommentsUps') || []
  let isLiked = false
  commentUps.forEach((item)=> {
    if (item == commentId) {
      isLiked = true
    }
  })
  return isLiked
}

export function selectUserOrders(state, buyerId, type) {
  let orderIds = []
  if ('all' == type) {
    orderIds = state.SHOP.getIn(['userAllOrders', buyerId]) || []
  } else if ('waiting' == type) {
    orderIds = state.SHOP.getIn(['userWaitOrders', buyerId]) || []
  } else if ('finished' == type) {
    orderIds = state.SHOP.getIn(['userFinishOrders', buyerId]) || []
  }
  let userOrders = constructOrderList(state, orderIds)
  return userOrders
}

export function selectVendorOrders(state, vendorId, type) {
  let orderIds = []
  if ('all' == type) {
    orderIds = state.SHOP.getIn(['shopAllOrders', vendorId]) || []
  } else if ('new' == type) {
    orderIds = state.SHOP.getIn(['shopNewOrders', vendorId]) || []
  } else if ('deliver' == type) {
    orderIds = state.SHOP.getIn(['shopDeliveredOrders', vendorId]) || []
  } else if ('finished' == type) {
    orderIds = state.SHOP.getIn(['shopFinishOrders', vendorId]) || []
  }
  let userOrders = constructOrderList(state, orderIds)
  return userOrders
}

export function selectOrderDetail(state, orderId) {
  let orderRec = state.SHOP.getIn(['orderDetail', orderId])
  if (!orderRec) {
    return undefined
  }
  let order = orderRec.toJS()
  let vendorId = order.vendorId
  let vendor = selectShopDetailDirect(state, vendorId)
  let buyerId = order.buyerId
  let buyer = userInfoById(state, buyerId).toJS()
  let goodsId = order.goodsId
  let goods = selectShopGoodsDetail(state, goodsId)
  return {
    ...order,
    buyer,
    vendor,
    goods,
  }
}