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
  let docMap = state.DOCTOR.get('doctors')
  return docMap.get(userId)? docMap.get(userId): new DoctorInfo()
}

export function getDoctorInfoByDoctorId(state, doctorId) {
  let doctor
  let docMap = state.DOCTOR.get('doctors')
  if (docMap) {
    docMap.forEach((value) => {
      if (doctorId == value.doctorId) {
        doctor = value
      }
    })
  }
  return doctor
}