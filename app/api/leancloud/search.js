/**
 * Created by wanpeng on 2017/5/10.
 */

import AV from 'leancloud-storage'
import ERROR from '../../constants/errorCode'
import {List} from 'immutable'

export function searchAllResult(payload) {
  console.log("searchAllResult payload", payload)
  let params = {
    key: payload.key
  }
  return AV.Cloud.run('searchFetchUserResult', params).then((result) => {
    console.log("fetchUserResult:", result)

    return AV.Cloud.run('searchFetchShopResult', params)
  }).then((result) => {
    console.log("fetchShopResult:", result)


    return AV.Cloud.run('searchFetchTopicResult', params)
  }).then((result) => {
    console.log("fetchTopicResult:", result)


  }).catch((error) => {
    console.log(error)
    error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
    throw error
  })
}

export function searchUser(payload) {
  console.log("searchUser payload", payload)
  let params = {
    key: payload.key,
    limit: payload.limit || 10,
    sid: payload.sid || undefined
  }

  return AV.Cloud.run('searchFetchUserResult', params).then((result) => {
    let userResults = {}
    userResults.hits = result.hits || 0
    userResults.users = result.users || []
    if(result.hits > result.users.length) {
      userResults.sid = result.sid
    } else {
      userResults.sid = ''
    }
    return userResults
  }).catch((error) => {
    console.log(error)
    error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
    throw error
  })
}

export function searchShop(payload) {
  console.log("searchShop payload", payload)
  let params = {
    key: payload.key,
    limit: payload.limit || 10,
    sid: payload.sid || undefined

  }

  return AV.Cloud.run('searchFetchShopResult', params).then((result) => {
    let shopResult = {}
    shopResult.hits = result.hits || 0
    shopResult.shops = result.shops || []
    if(result.hits > result.shops.length) {
      shopResult.sid = result.sid
    } else {
      shopResult.sid = ''
    }
    return shopResult
  }).catch((error) => {
    console.log(error)
    error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
    throw error
  })
}

export function searchTopic(payload) {
  console.log("searchTopic payload", payload)
  let params = {
    key: payload.key,
    limit: payload.limit || 10,
    sid: payload.sid || undefined
  }

  return AV.Cloud.run('searchFetchTopicResult', params).then((result) => {
    console.log("searchFetchTopicResult result:", result)
    let topicResult = {}
    topicResult.hits = result.hits || 0
    topicResult.topics = result.topics || []
    if(result.hits > result.topics.length) {
      topicResult.sid = result.sid
    } else {
      topicResult.sid = ''
    }
    return topicResult
  }).catch((error) => {
    console.log(error)
    error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
    throw error
  })
}
