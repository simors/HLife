/**
 * Created by wanpeng on 2017/5/10.
 */
import {createAction} from 'redux-actions'
import * as lcSearch from '../api/leancloud/search'



export function searchKeyAction(payload) {
  console.log("searchKeyAction payload", payload)
  return (dispatch, getState) => {
    lcSearch.searchAllResult(payload).then(() => {
      if (payload.success) {
        payload.success()
      }
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }

}