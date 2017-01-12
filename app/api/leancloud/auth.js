import AV from 'leancloud-storage'
import {Map, List, Record} from 'immutable'
import {UserInfo, UserDetail} from '../../models/userModels'
import {ShopRecord, ShopInfo} from '../../models/shopModel'
import {DoctorInfo} from '../../models/doctorModel'
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
  console.log("certification", payload)

  let userInfo = AV.Object.createWithoutData('_User', payload.id)
  let query = new AV.Query('Doctor')
  query.equalTo('user', userInfo)
  return query.find().then(function (results) {
    if (results.length == 0) {
      let Doctor = AV.Object.extend('Doctor')
      let doctor = new Doctor()

      doctor.set('name', payload.name)
      doctor.set('ID', payload.ID)
      doctor.set('phone', payload.phone)
      doctor.set('organization', payload.organization)
      doctor.set('department', payload.department)
      doctor.set('certifiedImage', payload.certifiedImage)
      doctor.set('certificate', payload.certificate)
      doctor.set('status', 2) //审核中
      doctor.set('user', userInfo)
      userInfo.addUnique('identity', 'doctor')
      userInfo.save()

      return doctor.save().then((doctorInfo)=>{
        let doctor = DoctorInfo.fromLeancloudObject(doctorInfo)
        doctor.id = payload.id
        return {
          doctorInfo: doctor,
        }
      }, function (err) {
        err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
        throw err
      })
    } else {
      let Doctor = AV.Object.createWithoutData('Doctor', results[0].id)
      Doctor.set('name', payload.name)
      Doctor.set('ID', payload.ID)
      Doctor.set('phone', payload.phone)
      Doctor.set('organization', payload.organization)
      Doctor.set('department', payload.department)
      Doctor.set('certifiedImage', payload.certifiedImage)
      Doctor.set('certificate', payload.certificate)
      Doctor.set('status', 2) //审核中
      Doctor.set('user', userInfo)
      return Doctor.save().then((doctorInfo)=>{
        let doctor = DoctorInfo.fromLeancloudObject(doctorInfo)
        doctor.id = payload.id
        return {
          doctorInfo: doctor,
        }
      }, function (err) {
        err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
        throw err
      })

    }
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })

  // let Doctor = AV.Object.extend('Doctor')
  // let doctor = new Doctor()
  //
  // doctor.set('name', payload.name)
  // doctor.set('ID', payload.ID)
  // doctor.set('phone', payload.phone)
  // doctor.set('organization', payload.organization)
  // doctor.set('department', payload.department)
  // doctor.set('certifiedImage', payload.certifiedImage)
  // doctor.set('certificate', payload.certificate)
  // doctor.set('status', 2) //审核中
  // doctor.set('user', userInfo)
  //
  // userInfo.addUnique('identity', 'doctor')
  // userInfo.save()
  //
  // return doctor.save().then((doctorInfo)=>{
  //   let doctor = DoctorInfo.fromLeancloudObject(doctorInfo)
  //   doctor.id = payload.id
  //   return {
  //     doctorInfo: doctor,
  //   }
  // }, function (err) {
  //   err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
  //   throw err
  // })

}

export function profileSubmit(payload) {

  console.log("profileSubmit:payload=", payload)
  var userInfo = AV.Object.createWithoutData('_User', payload.id);
  userInfo.set('nickname', payload.nickname)
  userInfo.set('avatar', payload.avatar)
  userInfo.set('mobilePhoneNumber', payload.phone)
  userInfo.set('gender', payload.gender)
  userInfo.set('birthday', payload.birthday)
  userInfo.set('identity', [])

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
  let currentUser = AV.User.current()
  shop.set('name', payload.name)
  shop.set('phone', payload.phone)
  shop.set('shopName', payload.shopName)
  shop.set('shopAddress', payload.shopAddress)
  shop.set('invitationCode', payload.invitationCode)
  shop.set('owner', currentUser)

  return shop.save().then(function (result) {
    let shopInfo = ShopInfo.fromLeancloudObject(result)
    return new List([shopInfo])
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })

}

export function submitCompleteShopInfo(payload) {
  let shopId = payload.shopId
  let shopCategoryObjectId = payload.shopCategoryObjectId
  let openTime = payload.openTime
  let contactNumber = payload.contactNumber
  let ourSpecial = payload.ourSpecial
  let album = payload.album
  let coverUrlArr = payload.coverUrlArr
  let tagIds = payload.tagIds
  let shop = AV.Object.createWithoutData('Shop', shopId)
  let targetShopCategory = AV.Object.createWithoutData('ShopCategory', shopCategoryObjectId)
  let containedTag = []
  if(tagIds && tagIds.length) {
    tagIds.forEach((tagId) =>{
      containedTag.push(AV.Object.createWithoutData('ShopTag', tagId))
    })
  }
  if(containedTag.length) {
    shop.set('containedTag', containedTag)
  }
  let coverUrl = ''
  if(coverUrlArr && coverUrlArr.length) {
    coverUrl = coverUrlArr[0]
    shop.set('coverUrl', coverUrl)
  }
  shop.set('targetShopCategory', targetShopCategory)
  shop.set('openTime', openTime)
  shop.set('contactNumber', contactNumber)
  shop.set('ourSpecial', ourSpecial)
  shop.set('album', album)
  console.log('submitCompleteShopInfo.shop====', shop)
  return shop.save().then(function (result) {
    return ShopInfo.fromLeancloudObject(result)
  }, function (err) {
    console.log('submitCompleteShopInfo.err====', err)
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
  
}

export function requestSmsAuthCode(payload) {
    let phone = payload.phone
    return AV.Cloud.requestSmsCode({
      mobilePhoneNumber:phone,
      name: '吾爱',
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

export function getUserById(payload) {
  let params = {}
  let userId = payload.userId
  if (!userId) {
    return false
  }
  params.userId = userId
  return AV.Cloud.run('hLifeGetUserinfoById', params).then((result) => {
    return result
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })

}

export function fetchUserFollowees() {
  let query = AV.User.current().followeeQuery()
  query.include('followee')
  return query.find().then(function(results) {
    let followees = []
    results.forEach((result)=>{
      followees.push(UserInfo.fromLeancloudObject(result))
    })
    return {
      currentUserId: AV.User.current().id,
      followees: List(followees)
    }
  }).catch((err) =>{
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function userIsFollowedTheUser(payload) {
  let userId = payload.userId

  let query = AV.User.current().followeeQuery()
  query.include('followee')
  return query.find().then(function(results) {
    let followees = []
    results.forEach((result)=>{
      followees.push(UserInfo.fromLeancloudObject(result))
    })
    for(let i = 0; i < results.length; i++) {
      if(userId == followees[i].id) {
        return true
      }
    }
    return false
  })
}

export function followUser(payload) {
  let userId = payload.userId
  return userIsFollowedTheUser(payload).then((result) =>{
    if(result) {
      return {
        code: '10004',
        message: '您之前已经关注了该用户'
      }
    }

    return AV.User.current().follow(userId).then(()=>{
      return {
        code: '10003',
        message: '关注成功'
      }
    }).catch((err) =>{
      if(err.code == '1') {
        err.code = '9998'
      }
      throw err
    })
  }).catch((err) =>{
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function unFollowUser(payload) {
  let userId = payload.userId
  return userIsFollowedTheUser(payload).then((result) =>{
    if(!result) {
      return {
        code: '10006',
        message: '您还没有关注该用户'
      }
    }
    return AV.User.current().unfollow(userId).then(()=>{
      return {
        code: '10005',
        message: '取消关注成功'
      }
    }).catch((err) =>{
      throw err
    })
  }).catch((err) =>{
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function inquirySubmit(payload) {
  console.log("inquirySubmit:", payload)
  var userInfo = AV.Object.createWithoutData('_User', payload.id);

  let Question = AV.Object.extend('Question')
  let question = new Question()

  question.set('connnet', payload.question)
  question.set('diseaseImages', payload.diseaseImages)
  question.set('quizzer', userInfo)
  question.set('name', payload.name)
  question.set('gender', payload.gender)
  question.set('birthday', payload.birthday)
  question.set('status', 2) //待分配

  return question.save().then((questionInfo) => {

    },
  function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })

}
