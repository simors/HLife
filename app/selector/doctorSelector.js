/**
 * Created by yangyang on 2016/12/28.
 */
import {DoctorInfo} from '../models/doctorModel'

export function activeDoctorInfo(state) {
  return state.DOCTOR.get('doctorInfo')? state.DOCTOR.get('doctorInfo'): new DoctorInfo()
}

export function getDoctorList(state) {
  let doctors = []
  let docMap = state.DOCTOR.get('doctors')
  if (docMap) {
    docMap.forEach((value) => {
      doctors.push(value)
    })
  }
  return doctors
}

export function getDoctorInfoByUserId(state, userId) {
  let doctorRecord = state.DOCTOR.getIn(['doctors', userId])
  if (doctorRecord) {
    return doctorRecord.toJS()
  }
  return (new DoctorInfo()).toJS()
}

export function getDoctorByGroupUserId(state, userIds) {
  let doctors = []
  userIds.forEach((userId) => {
    doctors.push(getDoctorInfoByUserId(state, userId))
  })
  return doctors
}

export function getDoctorByGroupDoctorId(state, doctorIds) {
  let doctors = []
  doctorIds.forEach((doctorId) => {
    doctors.push(getDoctorInfoByDoctorId(state, doctorId))
  })
  return doctors
}

export function getDoctorInfoByDoctorId(state, doctorId) {
  let docMap = state.DOCTOR.get('doctors')
  if (docMap) {
    let doctorRecord = docMap.find((doc) => {
      if (doctorId === doc.doctorId) {
        return true
      }
      return false
    })
    if (doctorRecord) {
      return doctorRecord.toJS()
    }
  }
  return (new DoctorInfo()).toJS()
}