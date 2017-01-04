/**
 * Created by zachary on 2016/12/15.
 */

import {createAction} from 'redux-actions'
import {Actions} from 'react-native-router-flux'
import * as ShopActionTypes from '../constants/shopActionTypes'
import * as lcShop from '../api/leancloud/shop'
import * as msgAction from './messageAction'

export function fetchShopList(payload) {
  return (dispatch ,getState) => {
    lcShop.getShopList(payload).then((shopList) => {
      let actionType = ShopActionTypes.UPDATE_SHOP_LIST
      if(!payload.isRefresh) {
        actionType = ShopActionTypes.UPDATE_PAGING_SHOP_LIST
      }
      let updateShopListAction = createAction(actionType)
      dispatch(updateShopListAction({shopList: shopList}))
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

export function fetchShopAnnouncements(payload) {
  return (dispatch, getState) => {
    lcShop.getShopAnnouncement(payload).then((shopAnnouncements) =>{
      let updateAction = createAction(ShopActionTypes.UPDATE_SHOP_ANNOUNCEMENT_LIST)
      dispatch(updateAction({shopId: payload.id, shopAnnouncements: shopAnnouncements}))
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

export function submitShopComment(payload) {
  return (dispatch, getState) => {
    lcShop.submitShopComment(payload).then((result) => {
      let updateAction = createAction(ShopActionTypes.SUBMIT_SHOP_COMMENT_SUCCESS)
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

export function fetchShopCommentList(payload) {
  return (dispatch, getState) => {
    lcShop.fetchShopCommentList(payload).then((shopComments)=>{
      let updateAction = createAction(ShopActionTypes.FETCH_SHOP_COMMENT_LIST_SUCCESS)
      dispatch(updateAction({shopId: payload.id, shopComments: shopComments}))
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
        msgAction.notifyShopLike(params)
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

export function reply(payload) {
  return (dispatch, getState) => {
    lcShop.reply(payload).then((result) => {
      let updateAction = createAction(ShopActionTypes.REPLY_SHOP_COMMENT_SUCCESS)
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

