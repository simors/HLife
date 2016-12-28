/**
 * Created by zachary on 2016/12/15.
 */

import {createAction} from 'redux-actions'
import {Actions} from 'react-native-router-flux'
import * as ShopActionTypes from '../constants/shopActionTypes'
import * as lcShop from '../api/leancloud/shop'

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
      if(result && '10002' == result.code) {
        let updateAction = createAction(ShopActionTypes.FOLLOW_SHOP_SUCCESS)
        dispatch(updateAction({}))
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

