/**
 * Created by zachary on 2017/3/3.
 */

import {createAction} from 'redux-actions'
import {Actions} from 'react-native-router-flux'
import * as PushActionTypes from '../constants/pushActionTypes'

export function updateLocalDeviceToken(payload) {
  return (dispatch ,getState) => {
    // console.log('updateLocalDeviceToken.payload===', payload)
    let updateAction = createAction(PushActionTypes.UPDATE_LOCAL_DEVICE_TOKEN)
    dispatch(updateAction(payload))
  }
}

