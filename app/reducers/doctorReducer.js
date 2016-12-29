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
    default:
      return state
  }
}

function handleDoctorUpdate(state, action) {
  payload = action.payload
  state = state.set('doctorInfo', payload.doctor)
  return state
}

function handleQueryDoctors(state, action) {
  let doctors = action.payload.doctors
  doctors.forEach((doctor) => {
    state = state.setIn(['doctors', doctor.id], doctor)
  })
  return state
}