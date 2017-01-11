/**
 * Created by wanpeng on 2016/12/28.
 */
import {createAction} from 'redux-actions'
import * as doctorActionTypes from '../constants/doctorActionTypes'
import * as lcDoctor from '../api/leancloud/doctor'

export function fetchDoctorInfo(payload) {
  return (dispatch, getState) => {
    lcDoctor.getDoctorInfoByUserId(payload).then((doctorInfo) => {
      let updateDoctorInfoAction = createAction(doctorActionTypes.UPDATE_DOCTORINFO)
      dispatch(updateDoctorInfoAction({doctor: doctorInfo}))
    }).catch((error) => {
      if(payload.error) {
        payload.error(error)
      }
    })
  }
}

export function fetchDoctorByUserId(payload) {
  return (dispatch, getState) => {
    lcDoctor.getDoctorInfoByUserId(payload).then((doctor) => {
      let updateDoctorListAction = createAction(doctorActionTypes.UPDATE_DOCTOR_LIST)
      dispatch(updateDoctorListAction({doctor: doctor}))
    }).catch((error) => {
      if(payload.error) {
        payload.error(error)
      }
    })
  }
}

export function fetchDoctorById(payload) {
  return (dispatch, getState) => {
    lcDoctor.getDoctorInfoById(payload).then((doctor) => {
      let updateDoctorListAction = createAction(doctorActionTypes.UPDATE_DOCTOR_LIST)
      dispatch(updateDoctorListAction({doctor: doctor}))
    }).catch((error) => {
      if(payload.error) {
        payload.error(error)
      }
    })
  }
}

export function getDocterList(payload) {
  return (dispatch, getState) => {
    lcDoctor.fetchDocterList(payload).then((doctors) => {
      const queryDoctors = createAction(doctorActionTypes.QUERY_DOCTORS)
      dispatch(queryDoctors({doctors}))
    })
  }
}