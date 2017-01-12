/**
 * Created by wanpeng on 2016/12/28.
 */
import * as Types from '../constants/doctorActionTypes'
import {REHYDRATE} from 'redux-persist/constants'
import {Doctor} from '../models/doctorModel'

const initialState = new Doctor()

export default function doctorReducer(state = initialState, action) {
  switch (action.type) {
    case Types.UPDATE_DOCTORINFO:
      return handleDoctorUpdate(state, action)
    case Types.QUERY_DOCTORS:
      return handleQueryDoctors(state, action)
    case Types.UPDATE_DOCTOR_LIST:
      return handleUpdateDoctorList(state, action)
    case Types.UPDATE_DOCTOR_GROUP:
      return handleUpdateDoctorGroup(state, action)
    default:
      return state
  }
}

function handleDoctorUpdate(state, action) {
  let payload = action.payload
  state = state.set('doctorInfo', payload.doctor.doctorInfo)
  return state
}

function handleQueryDoctors(state, action) {
  let doctorList = action.payload.doctorList
  doctorList.forEach((doctor) => {
    state = state.setIn(['doctors', doctor.userId], doctor)
  })
  return state
}

function handleUpdateDoctorList(state, action) {
  let payload = action.payload
  state = state.setIn(['doctors', payload.doctor.userId], payload.doctor.doctorInfo)
  return state
}

function handleUpdateDoctorGroup(state, action) {
  let doctorGroup = action.payload.doctorGroup
  doctorGroup.forEach((doctorList) => {
    state = state.setIn(['doctors', doctorList.userId], doctorList)
  })

  return state
}