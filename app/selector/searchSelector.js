/**
 * Created by wanpeng on 2017/5/12.
 */
export function getUserSearchResult(state) {
  let result = []
  let hasMore = false
  let userMap = state.UI.SEARCH.get('user')
  if(userMap) {
    result = userMap.get('results') || []
    let hits = userMap.get('hits') || 0
    hasMore = hits > result.length
  }
  return {
    result: result,
    hasMore: hasMore,
  }
}

export function getShopSearchResult(state) {
  let result = []
  let hasMore = false

  let shopMap = state.UI.SEARCH.get('shop')
  if(shopMap) {
    result = shopMap.get('results') || []
    let hits = shopMap.get('hits') || 0
    hasMore = hits > result.length
  }
  return {
    result: result,
    hasMore: hasMore,
  }
}

export function getTopicSearchResult(state) {
  let result = []
  let hasMore = false

  let topicMap = state.UI.SEARCH.get('topic')
  if(topicMap) {
    result = topicMap.get('results') || []
    let hits = topicMap.get('hits') || 0
    hasMore = hits > result.length
  }
  return {
    result: result,
    hasMore: hasMore,
  }
}
