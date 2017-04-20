/**
 * Created by zachary on 2016/12/15.
 */
import {Map, List, Record} from 'immutable'
import {createAction} from 'redux-actions'
import {Actions} from 'react-native-router-flux'
import * as ShopActionTypes from '../constants/shopActionTypes'
import * as lcShop from '../api/leancloud/shop'
import * as msgAction from './messageAction'
import {activeUserId, activeUserInfo} from '../selector/authSelector'
import {selectShopTags} from '../selector/shopSelector'
import * as pointAction from '../action/pointActions'
import * as ImageUtil from '../util/ImageUtil'

export function clearShopList(payload) {
  return (dispatch, getState) => {
    let actionType = ShopActionTypes.UPDATE_SHOP_LIST
    let updateShopListAction = createAction(actionType)
    dispatch(updateShopListAction({shopList: []}))
  }
}

export function fetchShopList(payload) {
  return (dispatch ,getState) => {
    lcShop.getShopList(payload).then((shopList) => {
      let actionType = ShopActionTypes.UPDATE_SHOP_LIST
      if(!payload.isRefresh) {
        if(payload.isLocalQuering) {
          actionType = ShopActionTypes.UPDATE_LOCAL_PAGING_SHOP_LIST
        }else {
          actionType = ShopActionTypes.UPDATE_PAGING_SHOP_LIST
        }
        let updateAction = createAction(ShopActionTypes.FETCH_SHOP_LIST_ARRIVED_LAST_PAGE)
        dispatch(updateAction({isLastPage: shopList.size < 5}))
      }else {
        if(payload.isLocalQuering) {
          actionType = ShopActionTypes.UPDATE_LOCAL_SHOP_LIST
        }
      }
      // console.log('fetchShopList.payload.isRefresh===',payload.isRefresh)
      // console.log('fetchShopList.shopList.size===',shopList.size)
      // console.log('fetchShopList.shopList.size < 5===',(shopList.size < 5))

      if(payload.isRefresh || shopList.size) {
        let updateShopListAction = createAction(actionType)
        dispatch(updateShopListAction({shopList: shopList}))
      }

      if(payload.success){
        payload.success(shopList.isEmpty())
      }
    }).catch((error) => {
      if(payload.error){
        payload.error(error)
      }
    })
  }
}

export function clearShopPromotionList(payload) {
  return (dispatch, getState) => {
    let actionType = ShopActionTypes.UPDATE_SHOP_PROMOTION_LIST
    let updateAction = createAction(actionType)
    dispatch(updateAction({shopPromotionList: []}))
  }
}

export function fetchShopPromotionList(payload) {
  return (dispatch ,getState) => {
    lcShop.fetchShopPromotionList(payload).then((shopPromotionList) => {
      let actionType = ShopActionTypes.UPDATE_SHOP_PROMOTION_LIST
      if(!payload.isRefresh) {
        actionType = ShopActionTypes.UPDATE_PAGING_SHOP_PROMOTION_LIST
      }
      // console.log('fetchShopPromotion.payload.isRefresh===',payload.isRefresh)
      // console.log('fetchShopPromotion.shopList.size===',shopList.size)
      // console.log('fetchShopPromotion.shopList.size < 5===',(shopList.size < 5))
      
      if(payload.isRefresh || shopPromotionList.size) {
        let updateAction = createAction(actionType)
        dispatch(updateAction({shopPromotionList: shopPromotionList}))
      }
      
      if(payload.success){
        payload.success(shopPromotionList.isEmpty())
      }
    }).catch((error) => {
      if(payload.error){
        payload.error(error)
      }
    })
  }
}

export function fetchUserFollowShops(payload) {
  return (dispatch, getState) => {
    lcShop.fetchUserFollowShops(payload).then((results) =>{
      let actionType = ShopActionTypes.FETCH_USER_FOLLOWED_SHOP_LIST_SUCCESS
      if(!payload.isRefresh) {
        actionType = ShopActionTypes.FETCH_USER_FOLLOWED_SHOP_PAGING_LIST_SUCCESS
      }
      let updateAction = createAction(actionType)
      dispatch(updateAction(results))
      if(payload.success){
        payload.success(results.userFollowedShops.size <= 0)
      }
    }).catch((error) => {
      if(payload.error){
        payload.error(error)
      }
    })
  }
}

export function fetchShopAnnouncements(payload) {
  return (dispatch, getState) => {
    lcShop.getShopAnnouncement(payload).then((shopAnnouncements) =>{
      let actionType = ShopActionTypes.UPDATE_SHOP_ANNOUNCEMENT_LIST
      if(!payload.isRefresh) {
        actionType = ShopActionTypes.UPDATE_PAGING_SHOP_ANNOUNCEMENT_LIST
      }
      let updateAction = createAction(actionType)
      dispatch(updateAction({shopId: payload.id, shopAnnouncements: shopAnnouncements}))
    }).catch((error) => {
      if(payload.error){
        payload.error(error)
      }
    })
  }
}

export function deleteShopAnnouncement(payload) {
  return (dispatch, getState) => {
    lcShop.deleteShopAnnouncement(payload).then((success) =>{
      let updateAction = createAction(ShopActionTypes.DELETE_SHOP_ANNOUNCEMENT_SUCCESS)
      dispatch(updateAction({shopAnnouncementId: payload.shopAnnouncementId}))
      if(payload.success){
        payload.success()
      }
    }).catch((error) => {
      if(payload.error){
        payload.error(error)
      }
    })
  }
}

export function userIsFollowedShop(payload) {
  return (dispatch, getState) => {
    lcShop.isFollowedShop(payload).then((result)=>{
      let updateAction = createAction(ShopActionTypes.UPDATE_USER_FOLLOW_SHOPS_INFO)
      dispatch(updateAction(result))
      return result
    }).catch((error) => {
      if(payload.error){
        payload.error(error)
      }
    })
  }
}

export function followShop(payload) {
  return (dispatch, getState) => {
    lcShop.followShop(payload).then((result) =>{
      let updateAction = createAction(ShopActionTypes.UPDATE_USER_FOLLOW_SHOPS_INFO)
      dispatch(updateAction(result))
      if(result && '10002' == result.code) {
        let params = {
          shopId: payload.id
        }
        // console.log('followShop==params==', params)
        dispatch(msgAction.notifyShopFollow(params))
        if(payload.success){
          payload.success(result)
        }
      }else {
        if(payload.error){
          payload.error(result)
        }
      }
    }).catch((error) => {
      if(payload.error){
        payload.error(error)
      }
    })
  }
}

export function unFollowShop(payload) {
  return (dispatch, getState) => {
    lcShop.unFollowShop(payload).then((result) =>{
      let updateAction = createAction(ShopActionTypes.UPDATE_USER_FOLLOW_SHOPS_INFO)
      dispatch(updateAction(result))
      if(result && '10003' == result.code) {
        if(payload.success){
          payload.success(result)
        }
      }else {
        if(payload.error){
          payload.error(result)
        }
      }
    }).catch((error) => {
      if(payload.error){
        payload.error(error)
      }
    })
  }
}

/**
 * deprecated:已过时
 * @param payload
 * @returns {function()}
 */
export function submitShopComment(payload) {
  return (dispatch, getState) => {
    lcShop.submitShopComment(payload).then((result) => {
      let updateAction = createAction(ShopActionTypes.SUBMIT_SHOP_COMMENT_SUCCESS)
      dispatch(updateAction(result))
      let params = {
        shopId: payload.id,
        replyTo: '',
        commentId: payload.commentId,
        commentContent: payload.content,
      }
      dispatch(msgAction.notifyShopComment(params))
      dispatch(pointAction.calPublishComment({userId: activeUserId(getState())}))   // 计算评论积分
      if(payload.success){
        payload.success(result)
      }
    }).catch((error) => {
      if(payload.error){
        payload.error(error)
      }
    })
  }
}

export function fetchShopCommentList(payload) {
  return (dispatch, getState) => {
    lcShop.fetchShopCommentListByCloudFunc(payload).then((shopComments)=>{
      let actionType = ShopActionTypes.FETCH_SHOP_COMMENT_LIST_SUCCESS
      if(!payload.isRefresh) {
        actionType = ShopActionTypes.FETCH_PAGING_SHOP_COMMENT_LIST_SUCCESS
      }
      let updateAction = createAction(actionType)
      dispatch(updateAction({shopId: payload.id, shopComments: shopComments}))
      if(payload.success){
        payload.success(shopComments)
      }
    }).catch((error) => {
      if(payload.error){
        payload.error(error)
      }
    })
  }
}

export function fetchShopCommentTotalCount(payload) {
  return (dispatch, getState) => {
    lcShop.fetchShopCommentTotalCount(payload).then((shopCommentTotalCount) => {
      let updateAction = createAction(ShopActionTypes.FETCH_SHOP_COMMENT_TOTAL_COUNT_SUCCESS)
      dispatch(updateAction({shopId: payload.id, shopCommentTotalCount: shopCommentTotalCount}))
      if(payload.success){
        payload.success(shopCommentTotalCount)
      }
    }).catch((error) => {
      if(payload.error){
        payload.error(error)
      }
    })
  }
}

export function fetchUserUpShopInfo(payload) {
  return (dispatch, getState) => {
    lcShop.fetchUserUpShopInfo(payload).then((userUpShopInfo) => {
      let updateAction = createAction(ShopActionTypes.UPDATE_USER_UP_SHOP_INFO)
      dispatch(updateAction(userUpShopInfo))
      if(payload.success){
        payload.success(result)
      }
    }).catch((error) => {
      if(payload.error){
        payload.error(error)
      }
    })
  }
}

export function userUpShop(payload) {
  return (dispatch, getState) => {
    lcShop.userUpShop(payload).then((result) => {
      if(result && '10008' == result.code) {
        let updateAction = createAction(ShopActionTypes.USER_UP_SHOP_SUCCESS)
        dispatch(updateAction(result))
        let params = {
          shopId: payload.id
        }
        dispatch(msgAction.notifyShopLike(params))
        if(payload.success){
          payload.success(result)
        }
      }else {
        if(payload.error){
          payload.error(result)
        }
      }
    }).catch((error) => {
      if(payload.error){
        payload.error(error)
      }
    })
  }
}

export function userUnUpShop(payload) {
  return (dispatch, getState) => {
    lcShop.userUnUpShop(payload).then((result) => {
      if(result && '10010' == result.code) {
        let updateAction = createAction(ShopActionTypes.USER_UNUP_SHOP_SUCCESS)
        dispatch(updateAction(result))
        if(payload.success){
          payload.success(result)
        }
      }else {
        if(payload.error){
          payload.error(result)
        }
      }
    }).catch((error) => {
      if(payload.error){
        payload.error(error)
      }
    })
  }
}

export function fetchShopCommentUpedUserList(payload) {
  return (dispatch, getState) => {
    lcShop.fetchShopCommentUpedUserListByCloudFunc(payload).then((shopCommentUpedUserList) => {
      // console.log('fetchShopCommentUpedUserList.action===', shopCommentUpedUserList)
      let updateAction = createAction(ShopActionTypes.FETCH_SHOP_COMMENT_UPED_USER_LIST_SUCCESS)

      let params = {}
      params.shopId = payload.shopId
      params.shopCommentId = payload.shopCommentId
      params.shopCommentUpedUserList = shopCommentUpedUserList
      dispatch(updateAction(params))
      if(payload.success){
        payload.success(params)
      }
    }).catch((error) => {
      if(payload.error){
        payload.error(error)
      }
    })
  }
}

export function userUpShopComment(payload) {
  return (dispatch, getState) => {
    lcShop.userUpShopComment(payload).then((result) => {
      let updateAction = createAction(ShopActionTypes.USER_UP_SHOP_COMMENT_SUCCESS)
      dispatch(updateAction(result))
      if(payload.success){
        payload.success(result)
      }
    }).catch((error) => {
      if(payload.error){
        payload.error(error)
      }
    })
  }
}

export function userUnUpShopComment(payload) {
  return (dispatch, getState) => {
    lcShop.userUnUpShopComment(payload).then((result) => {
      let updateAction = createAction(ShopActionTypes.USER_UNUP_SHOP_COMMENT_SUCCESS)
      dispatch(updateAction(result))
      if(payload.success){
        payload.success(result)
      }
    }).catch((error) => {
      if(payload.error){
        payload.error(error)
      }
    })
  }
}

export function reply(payload) {
  return (dispatch, getState) => {
    lcShop.reply(payload).then((result) => {
      let updateAction = createAction(ShopActionTypes.REPLY_SHOP_COMMENT_SUCCESS)
      dispatch(updateAction(result))

      let replyTo = payload.replyShopCommentUserId
      if(payload.replyId) {
        replyTo = payload.replyUserId
      }

      let replyId = payload.replyId
      if('SHOP_NOTIFY' == payload.from) {
        replyId = result.id
      }
      let params = {
        shopId: payload.shopId,
        replyTo: replyTo,
        commentId: payload.replyShopCommentId,
        content: payload.replyContent,
        replyId: replyId,
        replyContent: payload.replyContent
      }
      // console.log('shop.reply===params=', params)
      dispatch(msgAction.notifyShopComment(params))
      dispatch(pointAction.calPublishComment({userId: activeUserId(getState())}))   // 计算评论积分

      if(payload.success){
        payload.success(result)
      }
    }).catch((error) => {
      if(payload.error){
        payload.error(error)
      }
    })
  }
}

export function fetchShopCommentReplyList(payload) {
  return (dispatch, getState) => {
    lcShop.fetchShopCommentReplyListByCloudFunc(payload).then((shopCommentReplyList) => {
      let updateAction = createAction(ShopActionTypes.FETCH_SHOP_COMMENT_REPLY_LIST_SUCCESS)
      let params = {
        shopId: payload.shopId,
        replyShopCommentId: payload.replyShopCommentId,
        shopCommentReplyList: shopCommentReplyList
      }
      dispatch(updateAction(params))
      if(payload && payload.success){
        payload.success(params)
      }
    }).catch((error) => {
      if(payload.error){
        payload.error(error)
      }
    })
  }
}

export function fetchShopTags(payload) {
  return (dispatch, getState) => {
    lcShop.fetchShopTags(payload).then((shopTags) => {
      let updateAction = createAction(ShopActionTypes.FETCH_SHOP_TAGS_SUCCESS)
      dispatch(updateAction({shopTags: shopTags}))
      if(payload && payload.success){
        payload.success(shopTags)
      }
    }).catch((error)=> {
      if(payload && payload.error){
        payload.error(error)
      }
    })
  }
}

export function fetchUserOwnedShopInfo(payload) {
  return (dispatch, getState) => {
    lcShop.fetchUserOwnedShopInfo(payload).then((result) => {
      let updateAction = createAction(ShopActionTypes.FETCH_USER_OWNED_SHOP_INFO_SUCCESS)
      dispatch(updateAction(result))
      if(payload && payload.success){
        payload.success(result)
      }
    }).catch((error)=> {
      if(payload && payload.error){
        payload.error(error)
      }
    })
  }
}

export function fetchShopFollowers(payload) {
  return (dispatch, getState) => {
    lcShop.fetchShopFollowers(payload).then((shopFollowers) => {
      let actionType = ShopActionTypes.FETCH_SHOP_FOLLOWERS_SUCCESS
      if(!payload.isRefresh) {
        actionType = ShopActionTypes.FETCH_SHOP_FOLLOWERS_PAGING_SUCCESS
      }
      let updateAction = createAction(actionType)
      dispatch(updateAction({id: payload.id, shopFollowers: shopFollowers}))
      if(payload && payload.success){
        payload.success(shopFollowers)
      }
    }).catch((error)=> {
      if(payload.error){
        payload.error(error)
      }
    })
  }
}

export function fetchShopFollowersTotalCount(payload) {
  return (dispatch, getState) => {
    lcShop.fetchShopFollowersTotalCount(payload).then((shopFollowerTotalCount) => {
      let updateAction = createAction(ShopActionTypes.FETCH_SHOP_FOLLOWERS_TOTAL_COUNT_SUCCESS)
      dispatch(updateAction({id: payload.id, shopFollowerTotalCount: shopFollowerTotalCount}))
      if(payload.success){
        payload.success(shopFollowerTotalCount)
      }
    }).catch((error) => {
      if(payload.error){
        payload.error(error)
      }
    })
  }
}

export function fetchSimilarShopList(payload) {
  return (dispatch, getState) => {
    lcShop.fetchSimilarShopList(payload).then((similarShopList) => {
      let updateAction = createAction(ShopActionTypes.FETCH_SIMILAR_SHOP_LIST_SUCCESS)
      dispatch(updateAction({id: payload.id, similarShopList: similarShopList}))
      if(payload && payload.success){
        payload.success(similarShopList)
      }
    }).catch((error)=> {
      if(payload.error){
        payload.error(error)
      }
    })
  }
}

export function fetchShopDetail(payload) {
  return (dispatch, getState) => {
    lcShop.fetchShopDetail(payload).then((shopInfo) => {
      let updateAction = createAction(ShopActionTypes.FETCH_SHOP_DETAIL_SUCCESS)
      dispatch(updateAction({id: payload.id, shopInfo: shopInfo}))
      if(payload && payload.success){
        payload.success(shopInfo)
      }
    }).catch((error)=> {
      if(payload.error){
        payload.error(error)
      }
    })
  }
}

export function fetchShopPromotionDetail(payload) {
  return (dispatch, getState) => {
    lcShop.fetchShopPromotionDetail(payload).then((shopPromotionInfo) => {
      let updateAction = createAction(ShopActionTypes.FETCH_SHOP_PROMOTION_DETAIL_SUCCESS)
      dispatch(updateAction({id: payload.id, shopPromotionInfo: shopPromotionInfo}))
      if(payload && payload.success){
        payload.success(shopPromotionInfo)
      }
    }).catch((error)=> {
      if(payload.error){
        payload.error(error)
      }
    })
  }
}

export function fetchGuessYouLikeShopList(payload) {
  return (dispatch, getState) => {
    lcShop.fetchGuessYouLikeShopList(payload).then((shopList) => {
      let updateAction = createAction(ShopActionTypes.FETCH_GUESS_YOU_LIKE_SHOP_LIST_SUCCESS)
      dispatch(updateAction({shopList: shopList}))
      if(payload && payload.success){
        payload.success(shopList)
      }
    }).catch((error)=> {
      if(payload.error){
        payload.error(error)
      }
    })
  }
}

export function submitShopPromotion(payload) {
  return (dispatch, getState) => {
    let localImgs = []
    // console.log('submitShopPromotion.payload===', payload)
    if(payload.localCoverImgUri){
      // console.log('submitShopPromotion.payload.localCoverImgUri===', payload.localCoverImgUri)
      localImgs.push(payload.localCoverImgUri)
    }
    if(payload.localRichTextImagesUrls) {
      // console.log('submitShopPromotion.payload.localImgs===', localImgs)
      // console.log('submitShopPromotion.payload.localRichTextImagesUrls===', payload.localRichTextImagesUrls)
      localImgs = localImgs.concat(payload.localRichTextImagesUrls)
      // console.log('submitShopPromotion.payload.localImgs===', localImgs)
    }

    ImageUtil.batchUploadImgs2(localImgs).then((leanUris) => {
      let coverUrl = ''
      let leanRichTextImagesUrls = []
      
      if(leanUris && leanUris.length) {
        if(payload.localCoverImgUri) {
          coverUrl = leanUris.shift()
          leanRichTextImagesUrls = leanUris
        } else {
          leanRichTextImagesUrls = leanUris
        }
      }
      
      return {
        coverUrl: coverUrl,
        leanRichTextImagesUrls: leanRichTextImagesUrls,
      }
    }).then((results) => {
      if(payload.promotionDetailInfo && payload.promotionDetailInfo.length && 
          results.leanRichTextImagesUrls && results.leanRichTextImagesUrls.length) {
        let leanRichTextImagesUrls = results.leanRichTextImagesUrls.reverse()
        payload.promotionDetailInfo.forEach((value) => {
          if(value.type == 'COMP_IMG' && value.url)
            value.url = leanRichTextImagesUrls.pop()
        })
      }

      // console.log('results.coverUrl,======', results.coverUrl,)
      let shopPromotionPayload = {
        shopId: payload.shopId,
        shopPromotionId: payload.shopPromotionId,
        status: payload.status,
        abstract: payload.abstract,
        coverUrl: results.coverUrl,
        originalPrice: payload.originalPrice,
        promotingPrice: payload.promotingPrice,
        title: payload.title,
        type: payload.type,
        typeDesc: payload.typeDesc,
        typeId: payload.typeId,
        promotionDetailInfo: payload.promotionDetailInfo,
      }
      lcShop.submitShopPromotion(shopPromotionPayload).then((result) => {
        let updateAction = createAction(ShopActionTypes.SUBMIT_SHOP_PROMOTION)
        dispatch(updateAction(result))
        dispatch(pointAction.calPublishActivity({userId: activeUserId(getState())}))    // 计算发布活动的积分
        if(payload.success){
          payload.success(result)
        }
        let params = {
          shopId: payload.shopId,
          shopPromotionId: payload.shopPromotionId,
          shopPromotionCoverUrl: results.coverUrl,
          shopPromotionTitle: payload.title,
          shopPromotionType: payload.type,
          shopPromotionTypeDesc: payload.typeDesc,
        }
        dispatch(msgAction.notifyPublishShopPromotion(params))
      }).catch((error) => {
        // console.log('submitShopPromotion==error==>>>', error)
        if(payload.error){
          payload.error(error)
        }
      })
    }).catch((error) => {
      // console.log('batchUploadImgs==error==>>>', error)
      if(payload.error){
        payload.error(error)
      }
    })
  }
}

export function fetchShopPromotionMaxNum(payload) {
  return (dispatch, getState)=>{
    lcShop.fetchShopPromotionMaxNum(payload).then((maxNum)=>{
      let updateAction = createAction(ShopActionTypes.FETCH_SHOP_PROMOTION_MAX_NUM_SUCCESS)
      dispatch(updateAction({
        shopPromotionMaxNum: maxNum
      }))
    }, (maxNum)=>{
      let updateAction = createAction(ShopActionTypes.FETCH_SHOP_PROMOTION_MAX_NUM_SUCCESS)
      dispatch(updateAction({
        shopPromotionMaxNum: maxNum
      }))
    })
  }
}

export function fetchMyShopExpiredPromotionList(payload) {
  return (dispatch ,getState) => {
    lcShop.fetchMyShopExpiredPromotionList(payload).then((result) => {
      let actionType = ShopActionTypes.UPDATE_MY_SHOP_EXPIRED_PROMOTION_LIST
      if(!payload.isRefresh) {
        actionType = ShopActionTypes.UPDATE_MY_SHOP_EXPIRED_PROMOTION_LIST_PAGING
      }
      const shopPromotionList = result.shopPromotionList
      const userId = result.userId
      if(payload.isRefresh || shopPromotionList.size) {
        let updateAction = createAction(actionType)
        dispatch(updateAction({userId: userId, shopPromotionList: shopPromotionList}))
      }
      
      if(payload.success){
        payload.success(shopPromotionList.isEmpty())
      }
    }).catch((error) => {
      if(payload.error){
        payload.error(error)
      }
    })
  }
}

export function updateShopPromotion(payload) {
  return (dispatch, getState) => {
    lcShop.updateShopPromotion(payload).then((result)=>{
      if(payload.success){
        payload.success(result)
      }
    }, (result)=>{
      if(payload.error){
        payload.error(result)
      }
    })
  }
}

export function unregistShop(payload) {
  return (dispatch, getState) => {
    lcShop.unregistShop(payload).then((result)=>{
      if(payload.success){
        payload.success(result)
      }
    }).catch(error=>{
      if(payload.error){
        payload.error(error)
      }
    })
  }
}

