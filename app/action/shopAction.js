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

