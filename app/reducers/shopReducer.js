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
