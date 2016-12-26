import AV from 'leancloud-storage'
import {Map, List, Record} from 'immutable'
import {UserInfo, UserDetail} from '../../models/userModels'
import {ShopRecord, ShopInfo} from '../../models/shopModel'
import ERROR from '../../constants/errorCode'
import * as oPrs from './databaseOprs'

export function become(payload) {
  return AV.User.become(payload.token).then(() => {
    // do nothing
  }, (err) => {
    throw err
  })
}

/**
 * 用户名和密码登录
 * @param payload
 * @returns {IPromise<U>|*|AV.Promise}
 */
export function loginWithPwd(payload) {
  let phone = payload.phone
  let password = payload.password
  return AV.User.logInWithMobilePhone(phone, password).then((loginedUser) => {
    let userInfo = UserInfo.fromLeancloudObject(loginedUser)
    userInfo = userInfo.set('token', loginedUser.getSessionToken())
    console.log("loginWithPwd", userInfo)
    return {
      userInfo: userInfo,
    }
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

/**
 * 用户名和密码注册
 * @param payload
 * @returns {IPromise<U>|*|AV.Promise}
 */
export function register(payload) {
  let user = new AV.User()
  user.set('type', 'normal')
  user.setUsername(payload.phone)
  user.setPassword(payload.password)
  user.setMobilePhoneNumber(payload.phone)
  return user.signUp().then((loginedUser) => {
    let detail = {
      objName: 'UserDetail',
      args: {}
    }
    oPrs.createObj(detail).then((detail)=> {
      const updatePayload = {
        name: '_User',
        objectId: loginedUser.id,
        setArgs: {
          mobilePhoneVerified: true,
          detail: detail
        },
        increArgs: {}
      }
      oPrs.updateObj(updatePayload)
    })
    let userInfo = UserInfo.fromLeancloudObject(loginedUser)
    modifyMobilePhoneVerified({id: loginedUser.id})
    return {
      userInfo: userInfo,
      token: user.getSessionToken()
    }
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function certification(payload) {
  let Doctor = AV.Object.extend('Doctor')
  let doctor = new Doctor()

  doctor.set('name', payload.name)
  doctor.set('idCardNo', payload.idCardNo)
  doctor.set('phone', payload.phone)
  doctor.set('organization', payload.organization)
  doctor.set('department', payload.department)
  doctor.set('certifiedImage', payload.certifiedImage)
  doctor.set('certificate', payload.certificate)
  doctor.set('status', 0)
  
  return doctor.save().then(function (doctor) {
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
  
}

export function profileSubmit(payload) {

  console.log("profileSubmit:payload=", payload)
  var userInfo = AV.Object.createWithoutData('_User', payload.id);
  userInfo.set('nickname', payload.nickname)
  userInfo.set('avatar', payload.avatar)
  userInfo.set('mobilePhoneNumber', payload.phone)
  userInfo.set('gender', payload.gender)
  userInfo.set('birthday', payload.birthday)

  return userInfo.save().then((loginedUser)=>{
    let userInfo = UserInfo.fromLeancloudObject(loginedUser)
    // userInfo = userInfo.set('token', loginedUser.getSessionToken())
    // console.log("loginWithPwd", userInfo)
    return {
      userInfo: userInfo,
    }
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })

}

export function shopCertification(payload) {
  let Shop = AV.Object.extend('Shop')
  let shop = new Shop()

  shop.set('name', payload.name)
  shop.set('phone', payload.phone)
  shop.set('shopName', payload.shopName)
  shop.set('shopAddress', payload.shopAddress)
  shop.set('invitationCode', payload.invitationCode)

  return shop.save().then(function (result) {
    return ShopInfo.fromLeancloudObject(result)
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })

}

export function requestSmsAuthCode(payload) {
    let phone = payload.phone
    return AV.Cloud.requestSmsCode({
      mobilePhoneNumber:phone,
      name: '近来',
      op: '注册',
      ttl: 10}).then(function () {
      // do nothing
    }, function (err) {
      err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
      throw err
    })
  }


export function verifySmsCode(payload) {
  let smsAuthCode = payload.smsAuthCode
  let phone = payload.phone
  return AV.Cloud.verifySmsCode(smsAuthCode, phone).then(function (success) {
    //
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function requestResetPwdSmsCode(payload) {
  let phone = payload.phone
  return AV.User.requestPasswordResetBySmsCode(phone).then((success) => {
    // do nothing
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function resetPwdBySmsCode(payload) {
  let smsAuthCode = payload.smsAuthCode
  let password = payload.password
  return AV.User.resetPasswordBySmsCode(smsAuthCode, password).then((success) => {
    return success
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function modifyMobilePhoneVerified(payload) {
  return AV.Cloud.run('hLifeModifyMobilePhoneVerified', payload).then((result)=>{
    return result
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function verifyInvitationCode(payload) {
  let params = {}
  let invitationsCode = payload.invitationsCode
  if(!invitationsCode) {
    return false
  }
  params.invitationsCode = invitationsCode
  return AV.Cloud.run('hLifeVerifyInvitationCode', params).then((result)=>{
    return true
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}
