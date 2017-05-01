/**
 * Created by lilu on 2017/4/14.
 */
import {activeUserId} from './authSelector'

export function getMyTopicDrafts(state) {
  const userId = activeUserId(state)
  console.log('userId',userId)
  let topics = state.DRAFTS.toJS().topics
  for (let key in topics) {
    if(topics[key].userId!=userId){
      delete topics[key]
    }
  }
  return topics
}
export function getMyShopPromotionDrafts(state) {
  const userId = activeUserId(state)
  let shopPromotions = state.DRAFTS.toJS().shopPromotions
  for (let key in shopPromotions) {
    if(shopPromotions[key].userId!=userId){
      delete shopPromotions[key]
    }
  }
  return shopPromotions
}