/**
 * Created by wanpeng on 2017/5/10.
 */

import AV from 'leancloud-storage'
import ERROR from '../../constants/errorCode'
import {List} from 'immutable'

export function searchKey(payload) {
  return AV.Cloud.run('searchFetchSearchResult', payload).then(() => {

  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}
