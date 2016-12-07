import AV from 'leancloud-storage'
import {UserInfo, UserDetail} from '../../models/userModels'

/**
*
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
    throw err
  })
}

export function register(payload) {
  let user = new AV.User()
  user.set('type', 'normal')
  user.setUsername(payload.phone)
  user.setPassword(payload.password)
  user.setMobilePhoneNumber(payload.phone)
  console.log('user=', user)
  return user.signUp().then((loginedUser) => {
  	//console.log('loginedUser=', loginedUser)
    let userInfo = UserInfo.fromLeancloudObject(loginedUser)
  	//console.log('userInfo=', userInfo)
    return {
      userInfo: userInfo,
      token: user.getSessionToken()
    }
  }, (err) => {
    throw err
  })
}