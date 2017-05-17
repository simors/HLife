/**
 * Created by wanpeng on 2017/5/12.
 */
export function getUserSearchResult(state) {
  let result = []
  let hasMore = false
  let sid = ''
  let userMap = state.UI.SEARCH.get('user')
  if(userMap) {
    result = userMap.get('results') || []
    let hits = userMap.get('hits') || 0
    hasMore = hits > result.length
    sid = userMap.get('sid') || ''
  }
  return {
    result: result,
    hasMore: hasMore,
    sid: sid,
  }
}

export function getShopSearchResult(state) {
  let result = []
  let hasMore = false
  let sid = ''

  let shopMap = state.UI.SEARCH.get('shop')
  if(shopMap) {
    result = shopMap.get('results') || []
    let hits = shopMap.get('hits') || 0
    hasMore = hits > result.length
    sid = shopMap.get('sid') || ''
  }
  return {
    result: result,
    hasMore: hasMore,
    sid: sid,
  }
}

export function getTopicSearchResult(state) {
  let result = []
  let hasMore = false
  let sid = ''


  let topicMap = state.UI.SEARCH.get('topic')
  if(topicMap) {
    result = topicMap.get('results') || []
    let hits = topicMap.get('hits') || 0
    hasMore = hits > result.length
    sid = topicMap.get('sid') || ''

  }
  return {
    result: result,
    hasMore: hasMore,
    sid: sid
  }
}
