import {Map, List} from 'immutable'
import {REHYDRATE} from 'redux-persist/constants'
import * as ShopActionTypes from '../constants/shopActionTypes'
import {Shop} from '../models/shopModel'

const initialState = Shop()

export default function shopReducer(state = initialState, action) {
  switch (action.type) {
    case ShopActionTypes.UPDATE_SHOP_LIST:
      return handleUpdateShopList(state, action)
    case ShopActionTypes.UPDATE_PAGING_SHOP_LIST:
      return handleUpdatePagingShopList(state, action)
    case ShopActionTypes.UPDATE_SHOP_ANNOUNCEMENT_LIST:
      return handleUpdateShopAnnouncementList(state, action)
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
    default:
      return state
  }
}

function handleUpdateShopList(state, action) {
  let payload = action.payload
  state = state.set('shopList',  payload.shopList)
  return state
}

function handleUpdatePagingShopList(state, action) {
  let payload = action.payload
  let shopList = state.get('shopList')
  shopList = shopList.concat(payload.shopList)
  state = state.set('shopList',  shopList)
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

function handleUpdateUserFollowShopsInfo(state, action) {
  let payload = action.payload
  let shopId = payload.shopId
  let code = payload.code
  let userFollowShopsInfo = state.get('userFollowShopsInfo')
  if('10000' == code) {
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