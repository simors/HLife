/**
 * Created by yangyang on 2016/12/20.
 */
import {Platform} from 'react-native'
import {createAction} from 'redux-actions'
import * as msgActionTypes from '../constants/messageActionTypes'
import {activeUserId} from '../selector/authSelector'

export function initMessageClient(payload) {
  return (dispatch, getState) => {
    const userId = activeUserId(getState())

    if (!userId) {
      if (payload.error) {
        payload.error({message: '用户未登录'})
      }
    }
    let tag = 'web'
    if (Platform.OS == 'ios' || Platform.OS == 'android') {
      tag = 'mobile'
    }
  }
}