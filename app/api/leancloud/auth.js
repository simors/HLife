import AV from 'leancloud-storage'
import {UserInfo, UserDetail} from '../../models/userModels'
import ERROR from '../../constants/errorCode'
import * as oPrs from './databaseOprs'
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
    return loginedUser.fetch({include: ['detail']}, {}).then((user)=> {
      let detail = user.get('detail')
      let userDetail = {}
      if (detail) {
        userDetail = UserDetail.fromLeancloudObject(detail)
      }
      return {
        userInfo: userInfo,
        userDetail: userDetail,
      }
    })
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : err.message
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
    return {
      userInfo: userInfo,
      token: user.getSessionToken()
    }
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : err.message
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
      console.log(err.message)
      err.message = ERROR[err.code] ? ERROR[err.code] : err.message
      throw err
    })
  }


export function verifySmsCode(payload) {
  let randCode = payload.randCode
  let phone = payload.phone
  return AV.Cloud.verifySmsCode(randCode, phone).then(function (success) {
    // do nothing
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : err.message
    throw err
  })
}


