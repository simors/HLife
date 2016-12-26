/**
 * Created by zachary on 2016/12/14.
 */

export function selectShop(state) {
  return state.SHOP.toJS()
}

export function selectShopList(state) {
  return selectShop(state).shopList
}

export function selectShopDetail(state, id) {
  let shopDetail = {}
  let shopList = selectShop(state).shopList
  if(shopList && shopList.length) {
    shopList.forEach((shopItem)=>{
      if(shopItem.id == id) {
        shopDetail = shopItem
        return
      }
    })
  }
  console.log('shopDetail=', shopDetail)
  return shopDetail
}
