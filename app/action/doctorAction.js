/**
 * Created by wanpeng on 2016/12/28.
 */
import {createAction} from 'redux-actions'
import * as doctorActionTypes from '../constants/doctorActionTypes'
import * as lcDoctor from '../api/leancloud/doctor'

export function fetchDoctorInfo(payload) {
  return (dispatch, getState) => {
    lcDoctor.getDoctorInfo(payload).then((doctorInfo) => {
      let updateDoctorInfoAction = createAction(doctorActionTypes.UPDATE_DOCTORINFO)
      dispatch(updateDoctorInfoAction({doctor: doctorInfo}))
    }).catch((error) => {
      if(payload.error) {
        payload.error(error)
      }
    })
  }
}