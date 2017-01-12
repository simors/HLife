/**
 * Created by wanpeng on 2016/12/28.
 */
import AV from 'leancloud-storage'
import {Map, List, Record} from 'immutable'
import ERROR from '../../constants/errorCode'
import {DoctorInfo, DoctorList} from '../../models/doctorModel'
import {UserInfo} from '../../models/userModels'

export function getDoctorInfoByUserId(payload) {
  let userInfoId = payload.id
  var userInfo = AV.Object.createWithoutData('_User', userInfoId)
  var doctor =new AV.Query('Doctor')
  doctor.equalTo('user', userInfo)

  return doctor.find().then(function (doctors) {
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

export function getDoctorGroup(payload) {
  if (payload.idType == 'doctor') {
    let doctorIds = payload.id
    var query = new AV.Query('Doctor')
    query.include('user');
    query.containedIn('objectId', doctorIds)
    return query.find().then(function (doctors) {
      let doctorList = []
      doctors.forEach((doctor) => {
        let doctorInfo = DoctorInfo.fromLeancloudObject(doctor)
        let userInfo = UserInfo.fromLeancloudObject(doctor.attributes.user)
        let doctors = new DoctorList()
        doctors = doctors.withMutations((record) => {
          record.set('userId', userInfo.id)
          record.set('doctorId', doctor.id)
          record.set('username', doctorInfo.name)
          record.set('department', doctorInfo.department)
          record.set('phone', doctorInfo.phone)
          record.set('organization', doctorInfo.organization)
          record.set('avatar', userInfo.avatar)
        })
        doctorList.push(doctors)
      })
      return doctorList
    }, function (error) {
      error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
      throw error
    })
  } else {
    return AV.Cloud.run('hLifeGetDocterGroup', {id: payload.id}).then((results) => {
      let doctorList = []
      results.forEach((result) => {
        let doctors = new DoctorList()
        doctors = doctors.withMutations((record) => {
          record.set('userId', result.userId)
          record.set('doctorId', result.doctorId)
          record.set('username', result.username)
          record.set('department', result.department)
          record.set('phone', result.phone)
          record.set('organization', result.organization)
          record.set('avatar', result.avatar)
        })
        doctorList.push(doctors)
      })
      return doctorList
    }, (err) => {
      err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
      throw err
    })
  }
}

export function fetchDocterList(payload) {
  return AV.Cloud.run('hLifeGetDocterList').then((results) => {
    let doctorList = []
    results.forEach((result) => {
      let doctors = new DoctorList()
      doctors = doctors.withMutations((record) => {
        record.set('userId', result.userId)
        record.set('doctorId', result.doctorId)
        record.set('username', result.name)
        record.set('department', result.department)
        record.set('phone', result.phone)
        record.set('organization', result.organization)
        record.set('avatar', result.avatar)
      })
      doctorList.push(doctors)
    })
    return doctorList
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}
