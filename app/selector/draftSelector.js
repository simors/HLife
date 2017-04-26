/**
 * Created by lilu on 2017/4/14.
 */
import {activeUserId} from './authSelector'

export function getMyTopicDrafts(state) {
  return state.DRAFTS.toJS().topics
}
export function getMyShopPromotionDrafts(state) {
  return state.DRAFTS.toJS().shopPromotions
}