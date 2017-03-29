/**
 * Created by zachary on 2017/3/3.
 */

import {createAction} from 'redux-actions'
import {Actions} from 'react-native-router-flux'
import * as PushActionTypes from '../constants/pushActionTypes'
import {SystemNotice} from '../models/PushModels'

export function updateLocalDeviceToken(payload) {
  return (dispatch ,getState) => {
    // console.log('updateLocalDeviceToken.payload===', payload)
    let updateAction = createAction(PushActionTypes.UPDATE_LOCAL_DEVICE_TOKEN)
    dispatch(updateAction(payload))
  }
}

export function updateSystemNotice(payload) {
  return (dispatch, getState) => {
    let sysNoticeRecord = SystemNotice.fromPlainObj(payload)
    let updateAction = createAction(PushActionTypes.UPDATE_SYSTEM_NOTICE)
    dispatch(updateAction({
      sysNoticeRecord
    }))
  }
}

export function updateSystemNoticeAsMarkReaded(payload) {
  return (dispatch, getState) => {
    payload.hasReaded = true
    let sysNoticeRecord = SystemNotice.fromPlainObj(payload)
    let updateAction = createAction(PushActionTypes.UPDATE_SYSTEM_NOTICE_AS_MARK_READED)
    dispatch(updateAction({
      sysNoticeRecord
    }))
  }
}

