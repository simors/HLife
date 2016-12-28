/**
 * Created by wanpeng on 2016/12/28.
 */
import * as Types from '../constants/doctorActionTypes'
import {REHYDRATE} from 'redux-persist/constants'
import {Map} from 'immutable'

const initialState = new Map()

export default function doctorReducer(state = initialState, action) {
  switch (action.type) {
    case Types.UPDATE_DOCTORINFO:
      return handleDoctorUpdate(state, action)
    default:
      return state
  }
}

function handleDoctorUpdate(state, action) {
  payload = action.payload
  state = state.set('doctor', payload.doctor)
  return state
}