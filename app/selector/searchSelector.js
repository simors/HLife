/**
 * Created by wanpeng on 2017/5/12.
 */
export function getUserSearchResult(state) {
  let result = []
  let userMap = state.UI.SEARCH.get('user')
  if(userMap) {
    result = userMap.get('results')
  }
  return result
}

export function getShopSearchResult(state) {
  let result = []
  let shopMap = state.UI.SEARCH.get('shop')
  if(shopMap) {
    result = shopMap.get('results')
  }
  return result
}

export function getTopicSearchResult(state) {
  let result = []
  let topicMap = state.UI.SEARCH.get('topic')
  if(topicMap) {
    result = topicMap.get('results')
  }
  return result
}
