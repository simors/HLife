/**
 * Created by zachary on 2016/12/14.
 */

export function selectShop(state) {
  return state.SHOP.toJS()
}

export function selectShopList(state) {
  return selectShop(state).shopList
}
