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
      let updateShopListAction = createAction(ShopActionTypes.UPDATE_SHOP_LIST)
      dispatch(updateShopListAction({shopList: shopList}))
    }).catch((error) => {
      if(payload.error){
        payload.error(error)
      }
    })
  }
}

