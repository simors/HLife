/**
 * Created by yangyang on 2017/3/21.
 */
import {createAction} from 'redux-actions'
import * as lcPoints from '../api/leancloud/pointsMall'
import {activeUserId} from '../selector/authSelector'
import {UPDATE_USER_POINT} from '../constants/authActionTypes'

let updateUserPoint = createAction(UPDATE_USER_POINT)

export function fetchUserPoint(payload) {
  return (dispatch, getState) => {
    let userId = activeUserId(getState())
    lcPoints.getUserPoints({userId}).then((point) => {
      dispatch(updateUserPoint({userId, point}))
    })
  }
}