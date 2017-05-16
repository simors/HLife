/**
 * Created by wanpeng on 2017/5/10.
 */
import {createAction} from 'redux-actions'
import * as lcSearch from '../api/leancloud/search'
import * as uiTypes from '../constants/uiActionTypes'


export function searchKeyAction(payload) {
  return (dispatch, getState) => {
    let clearResultAction = createAction(uiTypes.SEARCH_CLEAR)
    dispatch(clearResultAction({}))

    lcSearch.searchUser(payload).then((result) => {
      let updateUserResultAction = createAction(uiTypes.SEARCH_USER)
      dispatch(updateUserResultAction(result))

      return lcSearch.searchShop(payload)
    }).then((result) => {
      let updateShopResultAction = createAction(uiTypes.SEARCH_SHOP)
      dispatch(updateShopResultAction(result))

      return lcSearch.searchTopic(payload)
    }).then((result) => {
      let updateTopicResultAction = createAction(uiTypes.SEARCH_TOPIC)
      dispatch(updateTopicResultAction(result))

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

export function searchUserAction(payload) {
  return (dispatch, getState) => {

    lcSearch.searchUser(payload).then((result) => {
      let updateUserResultAction = createAction(uiTypes.SEARCH_USER)
      dispatch(updateUserResultAction(result))
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}

export function searchShopAction(payload) {
  return (dispatch, getState) => {
    lcSearch.searchShop(payload).then((result) => {
      let updateShopResultAction = createAction(uiTypes.SEARCH_SHOP)
      dispatch(updateShopResultAction(result))
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}

export function searchTopicAction(payload) {
  return (dispatch, getState) => {
    lcSearch.searchTopic(payload).then(() => {
      let updateTopicResultAction = createAction(uiTypes.SEARCH_TOPIC)
      dispatch(updateTopicResultAction(result))
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}