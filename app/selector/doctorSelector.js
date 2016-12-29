/**
 * Created by yangyang on 2016/12/28.
 */
import {DoctorInfo} from '../models/doctorModel'

export function activeDoctorInfo(state) {
  return state.DOCTOR.get('doctorInfo')? state.DOCTOR.get('doctorInfo'): new DoctorInfo()
}

export function getDoctorList(state) {
  let doctors = []
  let docMap = state.DOCTOR.get('doctorList')
  if (docMap) {
    docMap.forEach((value) => {
      doctors.push(value)
    })
  }
  return doctors
}