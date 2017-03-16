import {Map, List} from 'immutable'
import {REHYDRATE} from 'redux-persist/constants'
import * as ShopActionTypes from '../constants/shopActionTypes'
import {Shop, ShopInfo, ShopAnnouncement, ShopComment, ShopCommentUp4Cloud, Up, ShopCommentReply, ShopCommentUp, ShopTag} from '../models/shopModel'
import {UserInfo} from '../models/userModels'

const initialState = Shop()

export default function shopReducer(state = initialState, action) {
  switch (action.type) {
    case ShopActionTypes.UPDATE_SHOP_LIST:
      return handleUpdateShopList(state, action)
    case ShopActionTypes.UPDATE_PAGING_SHOP_LIST:
      return handleUpdatePagingShopList(state, action)
    case ShopActionTypes.UPDATE_SHOP_PROMOTION_LIST:
      return handleUpdateShopPromotionList(state, action)
    case ShopActionTypes.UPDATE_PAGING_SHOP_PROMOTION_LIST:
      return handleUpdatePagingShoPromotionpList(state, action)
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
    case ShopActionTypes.FETCH_SHOP_FOLLOWERS_TOTAL_COUNT_SUCCESS:
      return handleFetchShopFollowersTotalCountSuccess(state, action)
    case ShopActionTypes.FETCH_SIMILAR_SHOP_LIST_SUCCESS:
      return handleFetchSimilarShopListSuccess(state, action)
    case ShopActionTypes.FETCH_SHOP_DETAIL_SUCCESS:
      return handleFetchShopDetailSuccess(state, action)
    case ShopActionTypes.FETCH_GUESS_YOU_LIKE_SHOP_LIST_SUCCESS:
      return handleFetchGuessYouLikeShopListSuccess(state, action)
    case ShopActionTypes.FETCH_USER_FOLLOWED_SHOP_LIST_SUCCESS:
      return handleFetchUserFollowedShopListSuccess(state, action)
    case ShopActionTypes.FETCH_USER_FOLLOWED_SHOP_PAGING_LIST_SUCCESS:
      return handleFetchUserFollowedShopPagingListSuccess(state, action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
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
  if(shopInfo && shopInfo.size) {
    state = state.setIn(['userOwnedShopInfo', userId], shopInfo)
  }
  return state
}

function handleFetchShopFollowersSuccess(state, action) {
  let payload = action.payload
  let shopId = payload.id
  let shopFollowers = payload.shopFollowers
  state = state.setIn(['shopFollowers', shopId], shopFollowers)
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

function handleFetchGuessYouLikeShopListSuccess(state, action) {
  let payload = action.payload
  let shopList = payload.shopList
  state = state.set('guessYouLikeShopList', shopList)
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
  }
  return state
}