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
