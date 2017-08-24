import {Map, List,Set} from 'immutable'
import {REHYDRATE} from 'redux-persist/constants'
import * as ShopActionTypes from '../constants/shopActionTypes'
import {
  Shop,
  ShopInfo,
  ShopAnnouncement,
  ShopComment,
  ShopGoods,
  ShopPromotion,
} from '../models/shopModel'
import {UserInfo} from '../models/userModels'

const initialState = Shop()

export default function shopReducer(state = initialState, action) {
  switch (action.type) {
    case ShopActionTypes.UPDATE_SHOP_LIST:
      return handleUpdateShopList(state, action)
    case ShopActionTypes.UPDATE_PAGING_SHOP_LIST:
      return handleUpdatePagingShopList(state, action)
    case ShopActionTypes.UPDATE_LOCAL_SHOP_LIST:
      return handleUpdateLocalShopList(state, action)
    case ShopActionTypes.UPDATE_LOCAL_PAGING_SHOP_LIST:
      return handleUpdateLocalPagingShopList(state, action)
    case ShopActionTypes.UPDATE_SHOP_PROMOTION_LIST:
      return handleUpdateShopPromotionList(state, action)
    case ShopActionTypes.UPDATE_PAGING_SHOP_PROMOTION_LIST:
      return handleUpdatePagingShoPromotionpList(state, action)
    case ShopActionTypes.UPDATE_MY_SHOP_EXPIRED_PROMOTION_LIST:
      return handleUpdateMyShopExpriredPromotionList(state, action)
    case ShopActionTypes.UPDATE_MY_SHOP_EXPIRED_PROMOTION_LIST_PAGING:
      return handleUpdateMyShopExpriredPromotionListPaging(state, action)
    case ShopActionTypes.FETCH_SHOP_LIST_ARRIVED_LAST_PAGE:
      return handleFetchShopListArrivedLastPage(state, action)
    case ShopActionTypes.UPDATE_SHOP_ANNOUNCEMENT_LIST:
      return handleUpdateShopAnnouncementList(state, action)
    case ShopActionTypes.UPDATE_PAGING_SHOP_ANNOUNCEMENT_LIST:
      return handleUpdatePagingShopAnnouncementList(state, action)
    case ShopActionTypes.UPDATE_USER_FOLLOW_SHOPS_INFO:
      return handleUpdateUserFollowShopsInfo(state, action)
    case ShopActionTypes.FETCH_SHOP_COMMENT_LIST_SUCCESS:
      return handleUpdateShopCommentList(state, action)
    case ShopActionTypes.FETCH_PAGING_SHOP_COMMENT_LIST_SUCCESS:
      return handleUpdatePagingShopCommentList(state, action)
    case ShopActionTypes.FETCH_SHOP_COMMENT_TOTAL_COUNT_SUCCESS:
      return handleUpdateShopCommentTotalCount(state, action)
    case ShopActionTypes.USER_UP_SHOP_SUCCESS:
      return handleUpdateUserUpShopSuccess(state, action)
    case ShopActionTypes.USER_UNUP_SHOP_SUCCESS:
      return handleUpdateUserUnUpShopSuccess(state, action)
    case ShopActionTypes.UPDATE_USER_UP_SHOP_INFO:
      return handleUpdateUserUpShopInfo(state, action)
    case ShopActionTypes.FETCH_SHOP_COMMENT_UPED_USER_LIST_SUCCESS:
      return handleFetchShopCommentUpedUserList(state, action)
    case ShopActionTypes.FETCH_SHOP_COMMENT_REPLY_LIST_SUCCESS:
      return handleFetchShopCommentReplyList(state, action)
    case ShopActionTypes.FETCH_SHOP_TAGS_SUCCESS:
      return handleFetchShopTagsSuccess(state, action)
    case ShopActionTypes.FETCH_USER_OWNED_SHOP_INFO_SUCCESS:
      return handleFetchUserOwnedShopInfoSuccess(state, action)
    case ShopActionTypes.FETCH_SHOP_FOLLOWERS_SUCCESS:
      return handleFetchShopFollowersSuccess(state, action)
    case ShopActionTypes.FETCH_SHOP_FOLLOWERS_PAGING_SUCCESS:
      return handleFetchShopFollowersPagingSuccess(state, action)  
    case ShopActionTypes.FETCH_SHOP_FOLLOWERS_TOTAL_COUNT_SUCCESS:
      return handleFetchShopFollowersTotalCountSuccess(state, action)
    case ShopActionTypes.FETCH_SIMILAR_SHOP_LIST_SUCCESS:
      return handleFetchSimilarShopListSuccess(state, action)
    case ShopActionTypes.FETCH_SHOP_DETAIL_SUCCESS:
      return handleFetchShopDetailSuccess(state, action)
    case ShopActionTypes.FETCH_BATCH_SHOP_DETAIL:
      return handleFetchBatchShopDetail(state, action)
    case ShopActionTypes.FETCH_SHOP_PROMOTION_DETAIL_SUCCESS:
      return handleFetchShopPromotionDetailSuccess(state, action)
    case ShopActionTypes.FETCH_GUESS_YOU_LIKE_SHOP_LIST_SUCCESS:
      return handleFetchGuessYouLikeShopListSuccess(state, action)
    case ShopActionTypes.FETCH_USER_FOLLOWED_SHOP_LIST_SUCCESS:
      return handleFetchUserFollowedShopListSuccess(state, action)
    case ShopActionTypes.FETCH_USER_FOLLOWED_SHOP_PAGING_LIST_SUCCESS:
      return handleFetchUserFollowedShopPagingListSuccess(state, action)
    case ShopActionTypes.FETCH_SHOP_PROMOTION_MAX_NUM_SUCCESS:
      return handleFetchShopPromotionMaxNumSuccess(state, action)
    case ShopActionTypes.FETCH_SHOP_PROMOTION_DAY_PAY_SUCCESS:
      return handleFetchShopPromotionDayPaySuccess(state, action)
    case ShopActionTypes.ADD_NEW_SHOP_GOODS:
      return handleAddShopGoods(state, action)
    case ShopActionTypes.UPDATE_SHOP_GOODS:
      return handleUpdateShopGoods(state, action)
    case ShopActionTypes.UPDATE_SHOP_GOODS_STATUS:
      return handleUpdateShopGoodsStatus(state, action)
    case ShopActionTypes.SET_SHOP_GOODS_LIST:
      return handleSetShopGoodsList(state, action)
    case ShopActionTypes.ADD_SHOP_GOODS_LIST:
      return handleAddShopGoodsList(state, action)
    case ShopActionTypes.ADD_SHOP_LOCAL_PROMOTIONLIST:
      return handleAddLocalGoodPromotions(state, action)
    case ShopActionTypes.SET_SHOP_LOCAL_PROMOTIONLIST:
      return handleSetLocalGoodPromotions(state, action)
    case ShopActionTypes.ADD_SHOP_OPEN_PROMOTIONLIST:
      return handleAddOpenGoodPromotions(state, action)
    case ShopActionTypes.SET_SHOP_OPEN_PROMOTIONLIST:
      return handleSetOpenGoodPromotions(state, action)
    case ShopActionTypes.ADD_SHOP_CLOSE_PROMOTIONLIST:
      return handleAddCloseGoodPromotions(state, action)
    case ShopActionTypes.SET_SHOP_CLOSE_PROMOTIONLIST:
      return handleSetCloseGoodPromotions(state, action)
    case ShopActionTypes.SET_USER_ORDERS_LIST:
      return handleSetUserShopOrders(state, action)
    case ShopActionTypes.ADD_USER_ORDERS_LIST:
      return handleAddUserShopOrders(state, action)
    case ShopActionTypes.BATCH_ADD_ORDER_DETAIL:
      return handleBatchAddOrdersDetail(state, action)
    case ShopActionTypes.BATCH_ADD_SHOP_GOODS_DETAIL:
      return handleBatchAddShopGoodsDetail(state, action)
    case ShopActionTypes.SET_SHOP_COMMENTS_FOR_COMMENT:
      return handleSetCommentsForComment(state, action)
    case ShopActionTypes.ADD_SHOP_COMMENTS_FOR_COMMENT:
      return handleAddCommentsForComment(state, action)
    case ShopActionTypes.SET_SHOP_COMMENTS_FOR_SHOP:
      return handleSetCommentsForShop(state, action)
    case ShopActionTypes.ADD_SHOP_COMMENTS_FOR_SHOP:
      return handleAddCommentsForShop(state, action)
    case ShopActionTypes.PUBLISH_SHOP_COMMENT_SUCCESS:
      return handlePublishCommentSuccess(state, action)
    case ShopActionTypes.FETCH_MY_COMMENT_UPS:
      return handleFetchMyCommentsUps(state, action)
    case ShopActionTypes.USER_UP_SHOP_COMMENT_SUCCESS:
      return handleupShopCommentSuccess(state, action)
    case ShopActionTypes.UPDATE_SHOP_ORDER_STATUS:
      return handleUpdateShopOrderStatus(state, action)
    case ShopActionTypes.MOVE_USER_ORDER_TO_FINISH:
      return handleMoveUserOrderToFinish(state, action)
    case ShopActionTypes.SET_VENDOR_ORDERS_LIST:
      return handleSetShopperOrders(state, action)
    case ShopActionTypes.ADD_VENDOR_ORDERS_LIST:
      return handleAddShopperOrders(state, action)
    case ShopActionTypes.MOVE_VENDOR_ORDER_TO_DELIVER:
      return handleMoveVendorOrderToDelivered(state, action)
    case ShopActionTypes.DELETE_USER_ORDER:
      return handleDeleteUserOrder(state, action)
    case ShopActionTypes.DELETE_VENDOR_ORDER:
      return handleDeleteVendorOrder(state, action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function handleUpdateMyShopExpriredPromotionList(state, action) {
  let payload = action.payload
  let userId = payload.userId
  let shopPromotionList = payload.shopPromotionList
  state = state.setIn(['myShopExpriredPromotionList', userId], shopPromotionList)
  return state
}

function handleUpdateMyShopExpriredPromotionListPaging(state, action) {
  let payload = action.payload
  let userId = payload.userId
  let shopPromotionList = payload.shopPromotionList
  let _shopPromotionList = state.get('myShopExpriredPromotionList')
  let newShopPromotionList = _shopPromotionList.concat(shopPromotionList)
  state = state.setIn(['myShopExpriredPromotionList', userId], newShopPromotionList)
  return state
}

function handleFetchShopPromotionMaxNumSuccess(state, action){
  let payload = action.payload
  let shopPromotionMaxNum = payload.shopPromotionMaxNum
  state = state.set('shopPromotionMaxNum', shopPromotionMaxNum || 3)
  return state
}

function handleFetchShopPromotionDayPaySuccess(state, action){
  let payload = action.payload
  let dayPay = payload.dayPay
  state = state.set('dayPay', dayPay || 3)
  return state
}

function handleFetchUserFollowedShopListSuccess(state, action) {
  let payload = action.payload
  let userId = payload.userId
  let userFollowedShops = payload.userFollowedShops
  state = state.setIn(['userFollowedShops', userId], userFollowedShops)
  return state
}

function handleFetchUserFollowedShopPagingListSuccess(state, action) {
  let payload = action.payload
  let userId = payload.userId
  let userFollowedShops = payload.userFollowedShops
  let _userFollowedShops = state.getIn(['userFollowedShops', userId])
  if(_userFollowedShops && userFollowedShops && userFollowedShops.size) {
    _userFollowedShops = _userFollowedShops.concat(userFollowedShops)
    state = state.setIn(['userFollowedShops', userId], _userFollowedShops)
  }
  return state
}

function handleUpdateShopList(state, action) {
  let payload = action.payload
  state = state.set('shopList',  new List(payload.shopList))
  return state
}

function handleUpdatePagingShopList(state, action) {
  let payload = action.payload
  let shopList = state.get('shopList')
  shopList = shopList.concat(payload.shopList)
  state = state.set('shopList',  shopList)
  return state
}

function handleUpdateLocalShopList(state, action) {
  let payload = action.payload
  state = state.set('localShopList',  new List(payload.shopList))
  return state
}

function handleUpdateLocalPagingShopList(state, action) {
  let payload = action.payload
  let shopList = state.get('localShopList')
  shopList = shopList.concat(new List(payload.shopList))
  state = state.set('localShopList',  shopList)
  return state
}

function handleUpdateShopPromotionList(state, action) {
  let payload = action.payload
  state = state.set('shopPromotionList',  payload.shopPromotionList)
  return state
}

function handleUpdatePagingShoPromotionpList(state, action) {
  let payload = action.payload
  let shopPromotionList = state.get('shopPromotionList')
  shopPromotionList = shopPromotionList.concat(payload.shopPromotionList)
  state = state.set('shopPromotionList',  shopPromotionList)
  return state
}

function handleFetchShopListArrivedLastPage(state, action) {
  let payload = action.payload
  let isLastPage = payload.isLastPage
  state = state.set('fetchShopListArrivedLastPage', isLastPage)
  return state
}

function handleUpdateShopAnnouncementList(state, action) {
  let payload = action.payload
  let shopId = payload.shopId
  let shopAnnouncements = payload.shopAnnouncements
  let _map = state.get('shopAnnouncements')
  _map = _map.set(shopId, shopAnnouncements)
  state = state.set('shopAnnouncements',  _map)
  return state
}

function handleUpdatePagingShopAnnouncementList(state, action) {
  let payload = action.payload
  let shopId = payload.shopId
  let shopComments = payload.shopAnnouncements
  let _map = state.get('shopAnnouncements')
  let _list = _map.get(shopId) || new List()
  let newShopComments = _list.concat(shopComments)
  let _newMap = _map.set(shopId, newShopComments)
  state = state.set('shopAnnouncements', _newMap)
  return state
}

function handleUpdateUserFollowShopsInfo(state, action) {
  let payload = action.payload
  let shopId = payload.shopId
  let code = payload.code
  let userFollowShopsInfo = state.get('userFollowShopsInfo')
  if('10000' == code || '10003' == code) {
    userFollowShopsInfo = userFollowShopsInfo.set(shopId, false)
  }else {
    userFollowShopsInfo = userFollowShopsInfo.set(shopId, true)
  }
  state = state.set('userFollowShopsInfo', userFollowShopsInfo)
  return state
}

function handleUpdateShopCommentList(state, action) {
  let payload = action.payload
  let shopId = payload.shopId
  let shopComments = payload.shopComments
  let _map = state.get('shopComments')
  _map = _map.set(shopId, shopComments)
  state = state.set('shopComments',  _map)
  return state
}

function handleUpdatePagingShopCommentList(state, action) {
  let payload = action.payload
  let shopId = payload.shopId
  let shopComments = payload.shopComments
  let _map = state.get('shopComments')
  let _list = _map.get(shopId) || new List()
  let newShopComments = _list.concat(shopComments)
  let _newMap = _map.set(shopId, newShopComments)
  state = state.set('shopComments', _newMap)
  return state
}

function handleUpdateShopCommentTotalCount(state, action) {
  let payload = action.payload
  let shopId = payload.shopId
  let shopCommentTotalCount = payload.shopCommentTotalCount
  let _map = state.get('shopCommentsTotalCounts')
  _map = _map.set(shopId, shopCommentTotalCount)
  state = state.set('shopCommentsTotalCounts',  _map)
  return state
}

function handleUpdateUserUpShopSuccess(state, action) {
  let payload = action.payload
  let shopId = payload.shopId
  let userUpShopsInfo = state.get('userUpShopsInfo')
  userUpShopsInfo = userUpShopsInfo.set(shopId, true)
  state = state.set('userUpShopsInfo', userUpShopsInfo)
  return state
}

function handleUpdateUserUnUpShopSuccess(state, action) {
  let payload = action.payload
  let shopId = payload.shopId
  let userUpShopsInfo = state.get('userUpShopsInfo')
  userUpShopsInfo = userUpShopsInfo.set(shopId, false)
  state = state.set('userUpShopsInfo', userUpShopsInfo)
  return state
}

function handleUpdateUserUpShopInfo(state, action) {
  let payload = action.payload
  let shopId = payload.targetId
  let status = payload.status
  if(shopId) {
    let userUpShopsInfo = state.get('userUpShopsInfo')
    userUpShopsInfo = userUpShopsInfo.set(shopId, status)
    state = state.set('userUpShopsInfo', userUpShopsInfo)
  }
  return state
}

function handleFetchShopCommentUpedUserList(state, action) {
  let payload = action.payload
  let shopId = payload.shopId
  let shopCommentId = payload.shopCommentId
  let shopCommentUpedUserList = payload.shopCommentUpedUserList

  let shopCommentsMap = state.get('shopComments')
  let shopCommentList = shopCommentsMap.get(shopId)
  let shopCommentIndex = -1
  if(shopCommentList && shopCommentList.size > 0) {
    shopCommentIndex = shopCommentList.findIndex((_shopComment)=>{
      let _shopCommentId = _shopComment.get('id')
      return _shopCommentId == shopCommentId
    })
  }
  if(shopCommentIndex != -1) {
    let shopComment = shopCommentList.get(shopCommentIndex)
    shopComment = shopComment.set('containedUps', shopCommentUpedUserList)
    shopCommentList = shopCommentList.set(shopCommentIndex, shopComment)
    shopCommentsMap = shopCommentsMap.set(shopId, shopCommentList)
    state = state.set('shopComments', shopCommentsMap)
  }
  return state
}

function handleFetchShopCommentReplyList(state, action) {
  let payload = action.payload
  let shopId = payload.shopId
  let replyShopCommentId = payload.replyShopCommentId
  let shopCommentReplyList = payload.shopCommentReplyList

  let shopCommentsMap = state.get('shopComments')
  let shopCommentList = shopCommentsMap.get(shopId)
  let shopCommentIndex = -1
  if(shopCommentList && shopCommentList.size > 0) {
    shopCommentIndex = shopCommentList.findIndex((_shopComment)=>{
      let _shopCommentId = _shopComment.get('id')
      return _shopCommentId == replyShopCommentId
    })
  }
  if(shopCommentIndex != -1) {
    let shopComment = shopCommentList.get(shopCommentIndex)
    shopComment = shopComment.set('containedReply', shopCommentReplyList)
    shopCommentList = shopCommentList.set(shopCommentIndex, shopComment)
    shopCommentsMap = shopCommentsMap.set(shopId, shopCommentList)
    state = state.set('shopComments', shopCommentsMap)
  }

  return state
}

function handleFetchShopTagsSuccess(state, action) {
  let payload = action.payload
  let shopTags = payload.shopTags
  if(shopTags && shopTags.size) {
    state = state.set('shopTagList', shopTags)
  }
  return state
}

function handleFetchUserOwnedShopInfoSuccess(state, action) {
  let payload = action.payload
  let userId = payload.userId
  let shopInfo = payload.shopInfo
  // console.log('handleFetchUserOwnedShopInfoSuccess.shopInfo===', shopInfo)
  state = state.setIn(['userOwnedShopInfo', userId], shopInfo)
  return state
}

function handleFetchShopFollowersSuccess(state, action) {
  let payload = action.payload
  let shopId = payload.id
  let shopFollowers = payload.shopFollowers
  state = state.setIn(['shopFollowers', shopId], shopFollowers)
  return state
}

function handleFetchShopFollowersPagingSuccess(state, action) {
  let payload = action.payload
  let shopId = payload.id
  let shopFollowers = payload.shopFollowers
  let _shopFollowers = state.getIn(['shopFollowers', shopId])
  let newShopFollowers = _shopFollowers.concat(shopFollowers)
  state = state.setIn(['shopFollowers', shopId], newShopFollowers)
  return state
}

function handleFetchShopFollowersTotalCountSuccess(state, action) {
  let payload = action.payload
  let shopId = payload.id
  let shopFollowerTotalCount = payload.shopFollowerTotalCount
  state = state.setIn(['shopFollowersTotalCount', shopId], shopFollowerTotalCount)
  return state
}

function handleFetchSimilarShopListSuccess(state, action) {
  let payload = action.payload
  let shopId = payload.id
  let similarShopList = payload.similarShopList
  state = state.setIn(['similarShops', shopId], similarShopList)
  return state
}

function handleFetchShopDetailSuccess(state, action) {
  let payload = action.payload
  let shopId = payload.id
  let shopInfo = payload.shopInfo
  state = state.setIn(['shopDetails', shopId], shopInfo)
  return state
}

function handleFetchBatchShopDetail(state, action) {
  let payload = action.payload
  let shopInfos = payload.shopInfos
  shopInfos.forEach((shopInfo) => {
    state = state.setIn(['shopDetails', shopInfo.id], shopInfo)
  })
  return state
}

function handleFetchShopPromotionDetailSuccess(state, action) {
  let payload = action.payload
  let shopPromotionId = payload.id
  let shopPromotionInfo = payload.shopPromotionInfo
  state = state.setIn(['shopPromotionDetails', shopPromotionId], shopPromotionInfo)
  return state
}

function handleFetchGuessYouLikeShopListSuccess(state, action) {
  let payload = action.payload
  let shopList = payload.shopList
  state = state.set('guessYouLikeShopList', shopList)
  return state
}

function handleAddShopGoods(state, action) {
  let goods = action.payload.goods
  let shopId = action.payload.shopId
  let goodsList = state.getIn(['shopGoods', shopId])
  if (goodsList) {
    goodsList.splice(0, 0, goods)
  } else {
    goodsList = new List([goods])
  }
  state = state.setIn(['shopGoods', shopId], goodsList)
  return state
}

function handleUpdateShopGoods(state, action) {
  let payload = action.payload
  let shopId = payload.shopId
  let goodsId = payload.goodsId
  let goods = payload.goods
  let goodsList = state.getIn(['shopGoods', shopId])
  if (goodsList) {
    let index = goodsList.findIndex((goodsItem) => {
      return goodsItem.id == goodsId
    })
    goodsList = goodsList.update(index, val => goods)
    state = state.setIn(['shopGoods', shopId], goodsList)
  }
  return state
}

function handleUpdateShopGoodsStatus(state, action) {
  let payload = action.payload
  let shopId = payload.shopId
  let goodsId = payload.goodsId
  let status = payload.status
  let goodsList = state.getIn(['shopGoods', shopId])
  if (goodsList) {
    let index = goodsList.findIndex((goodsItem) => {
      return goodsItem.id == goodsId
    })
    goodsList = goodsList.updateIn([index, 'status'], val => status)
    state = state.setIn(['shopGoods', shopId], goodsList)
  }
  return state
}

function handleSetShopGoodsList(state, action) {
  let goodsList = action.payload.goodsList
  console.log('setGoodList======>',goodsList)
  let shopId = action.payload.shopId
  state = state.setIn(['shopGoods', shopId], new List(goodsList))
  return state
}

function handleAddShopGoodsList(state, action) {
  let goodsList = action.payload.goodsList
  let shopId = action.payload.shopId
  let oldGoodsList = state.getIn(['shopGoods', shopId])
  state = state.setIn(['shopGoods', shopId], oldGoodsList.concat(new List(goodsList)))
  return state
}

function handleSetAllGoodPromotions(state, promotions) {
  promotions.forEach((item)=> {
    state = state.setIn(['allGoodPromotions', item.id], item)
  })
  return state
}

function handleSetLocalGoodPromotions(state, action) {
  let payload = action.payload
  let promotionList = payload.promotionList
  state = state.set('localGoodPromotionList', new List(promotionList))
  state = handleSetAllGoodPromotions(state,payload.promotions)
  return state
}

function handleAddLocalGoodPromotions(state, action) {
  let payload = action.payload
  let promotionList = payload.promotionList
  let _promotions = state.get('localGoodPromotionList')|| new List()
  if(_promotions&&_promotions.size>0){
    state = state.set('localGoodPromotionList', _promotions.concat(new List(promotionList)))
  }
  else{
    state = state.set('localGoodPromotionList', promotionList)
  }
  state = handleSetAllGoodPromotions(state,payload.promotions)
  return state
}

function handleSetOpenGoodPromotions(state, action) {
  let payload = action.payload
  let promotionList = payload.promotionList
  state = state.set('openGoodPromotionList', new List(promotionList))
  state = handleSetAllGoodPromotions(state,payload.promotions)
  return state
}

function handleAddOpenGoodPromotions(state, action) {
  let payload = action.payload
  let promotionList = payload.promotionList
  let _promotions = state.get('openGoodPromotionList')|| new List()
  if(_promotions&&_promotions.size>0){
    state = state.set('openGoodPromotionList', _promotions.concat(new List(promotionList)))
  }
  else{
    state = state.set('openGoodPromotionList', promotionList)
  }
  state = handleSetAllGoodPromotions(state,payload.promotions)
  return state
}

function handleSetCloseGoodPromotions(state, action) {
  let payload = action.payload
  let promotionList = payload.promotionList
  state = state.set('closeGoodPromotionList', new List(promotionList))
  state = handleSetAllGoodPromotions(state,payload.promotions)
  return state
}

function handleAddCloseGoodPromotions(state, action) {
  let payload = action.payload
  let promotionList = payload.promotionList
  let _promotions = state.get('closeGoodPromotionList')|| new List()
  if(_promotions&&_promotions.size>0){
    state = state.set('closeGoodPromotionList', _promotions.concat(new List(promotionList)))
  }
  else{
    state = state.set('closeGoodPromotionList', promotionList)
  }
  state = handleSetAllGoodPromotions(state,payload.promotions)
  return state
}

function handleSetUserShopOrders(state, action) {
  let payload = action.payload
  let buyerId = payload.buyerId
  let type = payload.type
  let shopOrdersList = payload.shopOrdersList
  if ('all' == type) {
    state = state.setIn(['userAllOrders', buyerId], new List(shopOrdersList))
  } else if ('waiting' == type) {
    state = state.setIn(['userWaitOrders', buyerId], new List(shopOrdersList))
  } else if ('finished' == type) {
    state = state.setIn(['userFinishOrders', buyerId], new List(shopOrdersList))
  }
  return state
}

function handleAddUserShopOrders(state, action) {
  let payload = action.payload
  let buyerId = payload.buyerId
  let type = payload.type
  let shopOrdersList = payload.shopOrdersList
  let oldOrderList = new List()
  if ('all' == type) {
    oldOrderList = state.getIn(['userAllOrders', buyerId])
    if (!oldOrderList) {
      oldOrderList = new List()
    }
    state = state.setIn(['userAllOrders', buyerId], oldOrderList.concat(new List(shopOrdersList)))
  } else if ('waiting' == type) {
    oldOrderList = state.getIn(['userWaitOrders', buyerId])
    if (!oldOrderList) {
      oldOrderList = new List()
    }
    state = state.setIn(['userWaitOrders', buyerId], oldOrderList.concat(new List(shopOrdersList)))
  } else if ('finished' == type) {
    oldOrderList = state.getIn(['userFinishOrders', buyerId])
    if (!oldOrderList) {
      oldOrderList = new List()
    }
    state = state.setIn(['userFinishOrders', buyerId], oldOrderList.concat(new List(shopOrdersList)))
  }
  return state
}

function handleBatchAddOrdersDetail(state, action) {
  let orders = action.payload.shopOrders
  orders.forEach((order) => {
    state = state.setIn(['orderDetail', order.id], order)
  })
  return state
}

function handleBatchAddShopGoodsDetail(state, action) {
  let goodsList = action.payload.goodsList
  goodsList.forEach((goods) => {
    state = state.setIn(['shopGoodsDetail', goods.id], goods)
  })
  return state
}

function handleSetAllShopComments(state, comments) {
  comments.forEach((item)=> {
    // console.log('item======>',item)
    state = state.setIn(['allShopComments', item.id], item)
  })
  return state
}

function handleAddCommentsForComment(state, action) {
  let payload = action.payload
  let commentList = payload.commentList
  let team = state.getIn(['shopCommentsForComment', payload.commentId])|| new List()
  // if(team&&team.length>0)
  state = state.setIn(['shopCommentsForComment', payload.commentId], team.concat(new List(commentList)))
  state = handleSetAllShopComments(state,payload.comments)
  return state
}

function handleSetCommentsForComment(state, action) {
  let payload = action.payload
  let commentList = payload.commentList
  // if(team&&team.length>0)
  state = state.setIn(['shopCommentsForComment', payload.commentId], new List(commentList))
  state = handleSetAllShopComments(state,payload.comments)
  return state
}

function handleAddCommentsForShop(state, action) {
  let payload = action.payload
  let commentList = payload.commentList
  let team = state.getIn(['shopCommentsForShop', payload.shopId])|| new List()
  // if(team&&team.length>0)
  console.log('team====>',team)

  state = state.setIn(['shopCommentsForShop', payload.shopId], team.concat(new List(commentList)))
  state = handleSetAllShopComments(state,payload.comments)
  return state
}


function handleSetCommentsForShop(state, action) {
  let payload = action.payload
  let commentList = payload.commentList
  // if(team&&team.length>0)
  state = state.setIn(['shopCommentsForShop', payload.shopId], new List(commentList))
  state = handleSetAllShopComments(state,payload.comments)
  return state
}


function handlePublishCommentSuccess(state, action) {
  let payload = action.payload
  let comment = payload.comment
  let commentList = state.getIn(['shopCommentsForShop', comment.shopId])
  if (commentList && commentList.size) {
    commentList = commentList.insert(0, comment.id)
    state = state.setIn(['shopCommentsForShop', comment.shopId], commentList)
  } else {
    let topicCommentList = [comment.commentId]
    state = state.setIn(['shopCommentsForShop', comment.shopId], new List(topicCommentList))
  }

  if (comment.parentCommentId) {
    let ParentCommentList = state.getIn(['shopCommentsForComment', comment.parentCommentId])
    if (ParentCommentList && ParentCommentList.size) {
      ParentCommentList = ParentCommentList.insert(0, comment.commentId)
      state = state.setIn(['shopCommentsForComment', comment.parentCommentId], ParentCommentList)
    } else {
      let commentCommentList = [comment.commentId]
      state = state.setIn(['shopCommentsForComment', comment.parentCommentId], new List(commentCommentList))
    }
  }
  let comments = []
  comments.push(comment)
  state = handleSetAllShopComments(state,comments)
  return state
}

function handleFetchMyCommentsUps(state, action) {
  let payload = action.payload
  let commentsUps = []
  payload.commentsUps.forEach((item)=> {
    commentsUps.push(item)
  })
  state = state.set('myCommentsUps', Set(commentsUps))
  return state
}

function handleupShopCommentSuccess(state, action) {
  let payload = action.payload
  let team = state.get('myCommentsUps') || new Set()
  console.log('team==>',team)
  team.add(payload.up)
  console.log('team==>',team)
  state = state.set('myCommentsUps', team)
  return state
}

function handleUpdateShopOrderStatus(state, action) {
  let status = action.payload.status
  let orderId = action.payload.orderId
  let order = state.getIn(['orderDetail', orderId])
  if (!order) {
    return state
  }
  order = order.set('orderStatus', status)
  state = state.setIn(['orderDetail', orderId], order)
  return state
}

function handleMoveUserOrderToFinish(state, action) {
  let payload = action.payload
  let orderId = payload.orderId
  let buyerId = payload.buyerId
  let waitList = state.getIn(['userWaitOrders', buyerId])
  if (!waitList) {
    return state
  }
  waitList = waitList.filter((item) => (item != orderId))
  state = state.setIn(['userWaitOrders', buyerId], waitList)
  let finishList = state.getIn(['userFinishOrders', buyerId])
  if (!finishList) {
    finishList = new List()
  }
  finishList = finishList.insert(0, orderId)
  state = state.setIn(['userFinishOrders', buyerId], finishList)
  return state
}

function handleMoveVendorOrderToDelivered(state, action) {
  let payload = action.payload
  let orderId = payload.orderId
  let vendorId = payload.vendorId
  let newOrderList = state.getIn(['shopNewOrders', vendorId])
  if (!newOrderList) {
    return state
  }
  newOrderList = newOrderList.filter((item) => (item != orderId))
  state = state.setIn(['shopNewOrders', vendorId], newOrderList)
  let deliverList = state.getIn(['shopDeliveredOrders', vendorId])
  if (!deliverList) {
    deliverList = new List()
  }
  deliverList = deliverList.insert(0, orderId)
  state = state.setIn(['shopDeliveredOrders', vendorId], deliverList)
  return state
}

function handleDeleteUserOrder(state, action) {
  let payload = action.payload
  let orderId = payload.orderId
  let buyerId = payload.buyerId
  let finishOrderList = state.getIn(['userFinishOrders', buyerId])
  if (!finishOrderList) {
    return state
  }
  finishOrderList = finishOrderList.filter((item) => (item != orderId))
  state = state.setIn(['userFinishOrders', buyerId], finishOrderList)

  let allOrderList = state.getIn(['userAllOrders', buyerId])
  if (!allOrderList) {
    return state
  }
  allOrderList = allOrderList.filter((item) => (item != orderId))
  state = state.setIn(['userAllOrders', buyerId], allOrderList)
  return state
}

function handleDeleteVendorOrder(state, action) {
  let payload = action.payload
  let orderId = payload.orderId
  let vendorId = payload.vendorId
  let finishOrderList = state.getIn(['shopFinishOrders', vendorId])
  if (!finishOrderList) {
    return state
  }
  finishOrderList = finishOrderList.filter((item) => (item != orderId))
  state = state.setIn(['shopFinishOrders', vendorId], finishOrderList)

  let allOrderList = state.getIn(['shopAllOrders', vendorId])
  if (!allOrderList) {
    return state
  }
  allOrderList = allOrderList.filter((item) => (item != orderId))
  state = state.setIn(['shopAllOrders', vendorId], allOrderList)
  return state
}

function handleSetShopperOrders(state, action) {
  let payload = action.payload
  let vendorId = payload.vendorId
  let type = payload.type
  let shopOrdersList = payload.shopOrdersList
  if ('all' == type) {
    state = state.setIn(['shopAllOrders', vendorId], new List(shopOrdersList))
  } else if ('new' == type) {
    state = state.setIn(['shopNewOrders', vendorId], new List(shopOrdersList))
  } else if ('deliver' == type) {
    state = state.setIn(['shopDeliveredOrders', vendorId], new List(shopOrdersList))
  } else if ('finished' == type) {
    state = state.setIn(['shopFinishOrders', vendorId], new List(shopOrdersList))
  }
  return state
}

function handleAddShopperOrders(state, action) {
  let payload = action.payload
  let vendorId = payload.vendorId
  let type = payload.type
  let shopOrdersList = payload.shopOrdersList
  let oldOrderList = new List()
  if ('all' == type) {
    oldOrderList = state.getIn(['shopAllOrders', vendorId])
    if (!oldOrderList) {
      oldOrderList = new List()
    }
    state = state.setIn(['shopAllOrders', vendorId], oldOrderList.concat(new List(shopOrdersList)))
  } else if ('new' == type) {
    oldOrderList = state.getIn(['shopNewOrders', vendorId])
    if (!oldOrderList) {
      oldOrderList = new List()
    }
    state = state.setIn(['shopNewOrders', vendorId], oldOrderList.concat(new List(shopOrdersList)))
  } else if ('deliver' == type) {
    oldOrderList = state.getIn(['shopDeliveredOrders', vendorId])
    if (!oldOrderList) {
      oldOrderList = new List()
    }
    state = state.setIn(['shopDeliveredOrders', vendorId], oldOrderList.concat(new List(shopOrdersList)))
  } else if ('finished' == type) {
    oldOrderList = state.getIn(['shopFinishOrders', vendorId])
    if (!oldOrderList) {
      oldOrderList = new List()
    }
    state = state.setIn(['shopFinishOrders', vendorId], oldOrderList.concat(new List(shopOrdersList)))
  }
  return state
}

function onRehydrate(state, action) {
  let incoming = action.payload.SHOP
  // console.log('shopReducer.onRehydrate=incoming==', incoming)
  if (incoming) {
    const shopAnnouncementsMap = Map(incoming.shopAnnouncements)
    shopAnnouncementsMap.map((value, key)=> {
      if (value && key) {
        let shopAnnouncements = []
        for (let shopAnnouncement of value) {
          if (shopAnnouncement) {
            const record = new ShopAnnouncement({...shopAnnouncement})
            shopAnnouncements.push(record)
          }
        }
        state = state.setIn(['shopAnnouncements', key], List(shopAnnouncements))
      }
    })

    const userFollowShopsInfoMap = Map(incoming.userFollowShopsInfo)
    userFollowShopsInfoMap.map((value, key)=> {
      if (value && key) {
        state = state.setIn(['userFollowShopsInfo', key], value)
      }
    })

    const shopCommentsMap = Map(incoming.shopComments)
    shopCommentsMap.map((value, key)=> {
      if (value && key) {
        let shopComments = []
        for (let shopComment of value) {
          if (shopComment) {
            const record = new ShopComment({...shopComment})
            shopComments.push(record)
          }
        }
        state = state.setIn(['shopComments', key], List(shopComments))
      }
    })

    const shopCommentsTotalCountsMap = Map(incoming.shopCommentsTotalCounts)
    shopCommentsTotalCountsMap.map((value, key)=> {
      if (value && key) {
        state = state.setIn(['shopCommentsTotalCounts', key], value)
      }
    })

    const userUpShopsInfoMap = Map(incoming.userUpShopsInfo)
    userUpShopsInfoMap.map((value, key)=> {
      if (value && key) {
        state = state.setIn(['userUpShopsInfo', key], value)
      }
    })

    const userOwnedShopInfoMap = Map(incoming.userOwnedShopInfo)
    userOwnedShopInfoMap.map((value, key)=> {
      if (value && key) {
        let shopInfoist = []
        for (let shopInfo of value) {
          if (shopInfo) {
            const record = new ShopInfo({...shopInfo})
            shopInfoist.push(record)
          }
        }
        state = state.setIn(['userOwnedShopInfo', key], List(shopInfoist))
      }
    })

    const shopFollowersMap = Map(incoming.shopFollowers)
    shopFollowersMap.map((value, key)=> {
      if (value && key) {
        let shopFollowers = []
        for (let shopFollower of value) {
          if (shopFollower) {
            const record = new UserInfo({...shopFollower})
            shopFollowers.push(record)
          }
        }
        state = state.setIn(['shopFollowers', key], List(shopFollowers))
      }
    })

    const shopFollowersTotalCountMap = Map(incoming.shopFollowersTotalCount)
    shopFollowersTotalCountMap.map((value, key)=> {
      if (value && key) {
        state = state.setIn(['shopFollowersTotalCount', key], value)
      }
    })

    const similarShopsMap = Map(incoming.similarShops)
    similarShopsMap.map((value, key)=> {
      if (value && key) {
        let similarShops = []
        for (let similarShop of value) {
          if (similarShop) {
            const record = new ShopInfo({...similarShop})
            similarShops.push(record)
          }
        }
        state = state.setIn(['similarShops', key], List(similarShops))
      }
    })

    const shopDetailsMap = Map(incoming.shopDetails)
    shopDetailsMap.map((value, key)=> {
      if (value && key) {
        state = state.setIn(['shopDetails', key], Map(value))
      }
    })

    state = state.set('shopList', List(incoming.shopList))
    state = state.set('shopTagList', List(incoming.shopTagList))
    state = state.set('guessYouLikeShopList', List(incoming.guessYouLikeShopList))
    state = state.set('fetchShopListArrivedLastPage', incoming.fetchShopListArrivedLastPage)

    // let localShopList = incoming.localShopList
    // if (localShopList) {
    //   let localShopListRec = []
    //   localShopList.forEach((shop) => {
    //     let shopRec = new ShopInfo({...shop})
    //     localShopListRec.push(shopRec)
    //   })
    //   state = state.set('localShopList', List(localShopListRec))
    // }
    //
    // let shopPromotionList = incoming.shopPromotionList
    // if (shopPromotionList) {
    //   let shopPromotionListRec = []
    //   shopPromotionList.forEach((promotion) => {
    //     let promotionRec = new ShopPromotion({...promotion})
    //     shopPromotionListRec.push(promotionRec)
    //   })
    //   state = state.set('shopPromotionList', List(shopPromotionListRec))
    // }

    let shopGoodsMap = Map(incoming.shopGoods)
    shopGoodsMap.map((goodsList, key) => {
      let goodsListRec = []
      goodsList.forEach((goods) => {
        let shopGoods = new ShopGoods({...goods, album: new List(goods.album)})
        goodsListRec.push(shopGoods)
      })

      state = state.setIn(['shopGoods', key], new List(goodsListRec))
    })
  }
  return state
}