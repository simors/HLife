/**
 * Created by yangyang on 2016/12/28.
 */
import {DoctorInfo} from '../models/doctorModel'

export function activeDoctorInfo(state) {
  return state.DOCTOR.get('doctor')? state.DOCTOR.get('doctor'): new DoctorInfo()
}

export function getDoctorList(state) {
  let doctors = []
  let docMap = state.DOCTOR
  docMap.forEach((value) => {
    doctors.push(value)
  })
  return doctors
}