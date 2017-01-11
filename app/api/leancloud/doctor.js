/**
 * Created by wanpeng on 2016/12/28.
 */
import AV from 'leancloud-storage'
import {Map, List, Record} from 'immutable'
import ERROR from '../../constants/errorCode'
import {DoctorInfo} from '../../models/doctorModel'

export function getDoctorInfoByUserId(payload) {
  console.log("getDoctorInfo payload", payload)
  let userInfoId = payload.id
  var userInfo = AV.Object.createWithoutData('_User', userInfoId)
  var doctor =new AV.Query('Doctor')
  doctor.equalTo('user', userInfo)

  return doctor.find().then(function (doctors) {
    console.log("getDoctorInfo get ", doctors)
    let doctorInfo = DoctorInfo.fromLeancloudObject(doctors[0])
    return {
      userId: payload.id,
      doctorInfo: doctorInfo
    }
    }, function (error) {
    error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
    throw error
    }
  )
}

export function getDoctorInfoById(payload) {
  console.log("getDoctorInfoById", payload)
  let doctorId = payload.id
  var query = new AV.Query('Doctor')
  return query.get(doctorId).then(function (doctor) {
    let doctorInfo = DoctorInfo.fromLeancloudObject(doctor)
    return {
      userId: payload.id,
      doctorInfo: doctorInfo
    }
  }, function (error) {
    error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
    throw error
  })
}

export function fetchDocterList(payload) {
  return AV.Cloud.run('hLifeGetDocterList').then((results) => {
    return results
  }, (err) => {
    console.log(err)
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}
