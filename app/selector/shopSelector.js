/**
 * Created by zachary on 2016/12/14.
 */
import {activeUserId} from './authSelector'

export function selectShop(state) {
  return state.SHOP.toJS()
}

export function selectShopList(state) {
  return selectShop(state).shopList
}

export function selectFetchShopListIsArrivedLastPage(state) {
  return state.SHOP.get('fetchShopListArrivedLastPage')
}

export function selectShopDetail(state, id) {
  let shopDetail = {owner: {}}
  let shopList = selectShop(state).shopList
  if(shopList && shopList.length) {
    shopList.forEach((shopItem)=>{
      if(shopItem.id == id) {
        shopDetail = shopItem
        return
      }
    })
  }

  if(!shopDetail.id) {
    if(state.SHOP.getIn(['shopDetails', id])) {
      return state.SHOP.getIn(['shopDetails', id]).toJS()
    }
  }

  // console.log('shopDetail=', shopDetail)
  return shopDetail
}

export function selectShopAnnouncements(state, shopId) {
  return selectShop(state).shopAnnouncements[shopId] || []
}

export function selectLatestShopAnnouncemment(state, shopId) {
  let shopAnnouncements = selectShopAnnouncements(state, shopId)
  if(shopAnnouncements && shopAnnouncements.length) {
    return shopAnnouncements[0]
  }
  return {}
}

export function selectUserFollowShopsInfo(state) {
  return state.SHOP.get('userFollowShopsInfo')
}

export function selectUserIsFollowShop(state, shopId) {
  let userFollowShopsInfo = selectUserFollowShopsInfo(state)
  if(userFollowShopsInfo && userFollowShopsInfo.size) {
    return userFollowShopsInfo.get(shopId)
  }
  return false
}

export function selectShopComments(state, shopId) {
  return selectShop(state).shopComments[shopId] || []
}

export function selectShopCommentsTotalCount(state, shopId) {
  return selectShop(state).shopCommentsTotalCounts[shopId]
}

export function selectUserIsUpedShop(state, shopId) {
  let userUpShopsInfo = state.SHOP.get('userUpShopsInfo')
  if(userUpShopsInfo && userUpShopsInfo.size) {
    return userUpShopsInfo.get(shopId)
  }
  return false
}

export function selectShopCommentUps(state, shopId, shopCommentId) {
  let shopComments = selectShop(state).shopComments[shopId]
  let containedUps = []
  if(shopComments && shopComments.length) {
    for(let i = 0; i < shopComments.length; i++) {
      if(shopComments[i].id == shopCommentId) {
        containedUps = shopComments[i].containedUps
      }
    }
  }
  return containedUps
}

export function selectActiveUserIsUpedShopComment(state, shopId, shopCommentId, activeUserId) {
  let shopCommentUps = selectShopCommentUps(state, shopId, shopCommentId)
  if(shopCommentUps && shopCommentUps.length) {
    for(let i = 0; i < shopCommentUps.length; i++) {
      if(shopCommentUps[i].user.id == activeUserId) {
        if(shopCommentUps[i].status) {
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
  if(shopCommentUps && shopCommentUps.length) {
    for(let i = 0; i < shopCommentUps.length; i++) {
      if(shopCommentUps[i].user.id == activeUserId) {
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
  if(userId) {
    _userId = userId
  }
  if(state.SHOP.getIn(['userOwnedShopInfo', _userId]) && state.SHOP.getIn(['userOwnedShopInfo', _userId]).size) {
    // console.log('state.SHOP.get(userOwnedShopInfo).toJS()[0]===', state.SHOP.get('userOwnedShopInfo').toJS()[0])
    return state.SHOP.getIn(['userOwnedShopInfo', _userId]).toJS()[0]
  }
  return {}
}

export function selectShopFollowers(state, shopId) {
  if(state.SHOP.getIn(['shopFollowers', shopId])) {
    return state.SHOP.getIn(['shopFollowers', shopId]).toJS()
  }
  return []
}

export function selectShopFollowersTotalCount(state, shopId) {
  if(state.SHOP.getIn(['shopFollowersTotalCount', shopId])) {
    return state.SHOP.getIn(['shopFollowersTotalCount', shopId])
  }
  return 0
}

export function selectSimilarShopList(state, shopId) {
  if(state.SHOP.getIn(['similarShops', shopId])) {
    return state.SHOP.getIn(['similarShops', shopId]).toJS()
  }
  return []
}

export function selectGuessYouLikeShopList(state) {
  if(state.SHOP.get('guessYouLikeShopList')) {
    return state.SHOP.get('guessYouLikeShopList').toJS()
  }
  return []
}