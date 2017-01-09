/**
 * Created by wanpeng on 2016/12/28.
 */
import AV from 'leancloud-storage'
import {Map, List, Record} from 'immutable'
import ERROR from '../../constants/errorCode'
import {DoctorInfo} from '../../models/doctorModel'

export function getDoctorInfo(payload) {
  console.log("getDoctorInfo")
  let userInfoId = payload.id
  var userInfo = AV.Object.createWithoutData('_User', userInfoId)
  var doctor =new AV.Query('Doctor')
  doctor.equalTo('user', userInfo)

  return doctor.find().then(function (doctors) {
    let doctorInfo = DoctorInfo.fromLeancloudObject(doctors[0])
    console.log("find success")
    return doctorInfo
    }, function (error) {
    console.log("find failed")
    error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
    throw error
    }
  )
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