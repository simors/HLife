import AV from 'leancloud-storage'
import {Map, List, Record} from 'immutable'
import {UserInfo, UserDetail, HealthProfileRecord, HealthProfile} from '../../models/userModels'
import {ShopRecord, ShopInfo} from '../../models/shopModel'
import {ArticleItem} from '../../models/ArticleModel'
import ERROR from '../../constants/errorCode'
import * as oPrs from './databaseOprs'
import * as numberUtils from '../../util/numberUtils'
import * as ImageUtil from '../../util/ImageUtil'
import * as AVUtils from '../../util/AVUtils'
import * as Utils from '../../util/Utils'
import * as authSelector from '../../selector/authSelector'
import * as configSelector from '../../selector/configSelector'
import * as locSelector from '../../selector/locSelector'
import {store} from '../../store/persistStore'
import {IDENTITY_SHOPKEEPER, IDENTITY_PROMOTER} from '../../constants/appConfig'
import {getCurrentLocation} from '../../action/locAction'

export function become(payload) {
  return AV.User.become(payload.token).then((user) => {
    let userInfo = UserInfo.fromLeancloudObject(user)
    let token = user.getSessionToken()
    userInfo = userInfo.set('token', token)

    if(!userInfo.get('geoProvinceCode')) {
      updateUserLocationInfo({
        userId: userInfo.get('id')
      })
    }

    var params = { token }
    AV.Cloud.run('hLifeLogin', params)//更新updatedAt时间

    return {
      userInfo: userInfo,
    }
  }, (err) => {
    throw err
  })

}

export function logOut(payload) {
  return AV.User.logOut().then(() => {
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

    if(!userInfo.get('geoProvinceCode')) {
      updateUserLocationInfo({
        userId: userInfo.get('id')
      })
    }

    AV.Cloud.run('hLifeLogin', payload)//更新updatedAt时间

    // console.log("loginWithPwd", userInfo)
    return {
      userInfo: userInfo,
    }
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

/**
 * 用户名和密码登录&绑定微信信息
 * @param payload
 * @returns {IPromise<U>|*|AV.Promise}
 */
export function loginWithWXInfo(payload) {
  let phone = payload.phone
  let password = payload.password

  let authData = {
    "openid": payload.wxUserInfo.unionid,
    "access_token": payload.wxUserInfo.accessToken,
    "expires_at": Date.parse(payload.wxUserInfo.expiration),
  }
  let platform = 'weixin'

  return AV.User.logInWithMobilePhone(phone, password).then((user) => {
    return AV.User.associateWithAuthData(user, platform, authData)
  }).then((loginedUser) => {
    let userInfo = UserInfo.fromLeancloudObject(loginedUser)
    userInfo = userInfo.set('token', loginedUser.getSessionToken())

    if(!userInfo.get('geoProvinceCode')) {
      updateUserLocationInfo({
        userId: userInfo.get('id')
      })
    }

    AV.Cloud.run('hLifeLogin', payload)//更新updatedAt时间

    // console.log("loginWithPwd", userInfo)
    return {
      userInfo: userInfo,
    }
  }).catch((err) => {
    console.log("loginWithWXInfo err", err)
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function isWXBindByPhone(payload) {
  let phone = payload.phone

  return AV.Cloud.run('isWXBindByPhone', {phone: phone}).then((result) => {
    return result.wxAuthed
  }).catch((err) => {
    console.log("isWXBindByPhone", err)
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

/**
 * 微信第三方登录
 * @param payload
 * @returns {IPromise<U>|*|AV.Promise}
 */
export function loginWithWX(payload) {
  let authData = {
    "openid": payload.unionid,
    "access_token": payload.accessToken,
    "expires_at": Date.parse(payload.expiration),
  }
  let platform = 'weixin'
  return AV.User.signUpOrlogInWithAuthData(authData, platform).then((loginedUser) => {
    let userInfo = UserInfo.fromLeancloudObject(loginedUser)
    userInfo = userInfo.set('token', loginedUser.getSessionToken())

    if(!userInfo.get('geoProvinceCode')) {
      updateUserLocationInfo({
        userId: userInfo.get('id')
      })
    }
    AV.Cloud.run('hLifeLogin', payload)//更新updatedAt时间
    return {
      userInfo: userInfo,
    }

  }).catch((err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

/**
 * 判断微信用户是否已注册
 * @param payload
 * @returns {IPromise<U>|*|AV.Promise}
 */
export function isWXSignIn(payload) {
  let params = {
    unionid: payload.unionid,
  }

  return AV.Cloud.run("isWXUnionIdSignIn", params).then((result) => {
    return result.isSignIn
  }).catch((err) => {
    console.log("isWXUnionIdSignIn", err)
    console.log("isWXUnionIdSignIn err.code", err.code)
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
  let authData = {
    "openid": payload.wxUserInfo.unionid,
    "access_token": payload.wxUserInfo.accessToken,
    "expires_at": Date.parse(payload.wxUserInfo.expiration),
  }
  let platform = 'weixin'
  let wxName = payload.wxUserInfo.name
  let wxAvatar = payload.wxUserInfo.avatar

  let user = new AV.User()
  user.set('type', 'normal')
  user.setUsername(wxName)
  user.setPassword(payload.password)
  user.setMobilePhoneNumber(payload.phone)
  user.set('avatar', wxAvatar)
  user.set('nickname', wxName)
  return user.signUp().then((signedUser) => {
    return AV.User.associateWithAuthData(signedUser, platform, authData)
  }).then((loginedUser) => {
    updateUserLocationInfo({
      userId: loginedUser.id
    })
    let userInfo = UserInfo.fromLeancloudObject(loginedUser)
    let token = user.getSessionToken()
    userInfo = userInfo.set('token', token)
    modifyMobilePhoneVerified({id: loginedUser.id})
    return {
      userInfo: userInfo,
      token: token,
    }
  }).catch((err) => {
    console.log("register err", err)
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

/**
 * 微信第三方登录注册
 * @param payload
 * @returns {IPromise<U>|*|AV.Promise}
 */
export function registerWithWX(payload) {
  let phone = payload.phone
  let smsCode = payload.smsCode
  let wx_name = payload.name
  let avatar = payload.avatar

  let authData = {
    "openid": payload.unionid,
    "access_token": payload.accessToken,
    "expires_at": Date.parse(payload.expiration),
  }
  let platform = 'weixin'

  return AV.User.signUpOrlogInWithMobilePhone(phone, smsCode).then((user) => {

    return AV.User.associateWithAuthData(user, platform, authData)
  }).then((authUser) => {
    if(authUser && !authUser.attributes.nickname)
      authUser.set('nickname', wx_name)
    if(authUser && !authUser.attributes.avatar)
      authUser.set('avatar', avatar)
    return authUser.save()
  }).then((loginedUser) => {
    updateUserLocationInfo({
      userId: loginedUser.id
    })

    let userInfo = UserInfo.fromLeancloudObject(loginedUser)

    let token = loginedUser.getSessionToken()
    userInfo = userInfo.set('token', token)
    modifyMobilePhoneVerified({id: loginedUser.id})
    return {
      userInfo: userInfo,
      token: token,
    }
  }).catch((err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

/**
 * 现有账户绑定微信账户
 * @param payload
 * @returns {IPromise<U>|*|AV.Promise}
 */
export function bindWithWX(payload) {
  console.log('bindWithWX:', payload)

  return AV.Cloud.run('bindWithWeixin', payload).then((user) => {
    return user
  }).catch((err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function updateUserLocationInfo(payload) {
  // console.log('updateUserLocationInfo.payload====', payload)

  let userId = payload.userId

  let provincesAndCities = configSelector.selectProvincesAndCities(store.getState())
  // console.log('provincesAndCities====', provincesAndCities)

  if(!provincesAndCities || !provincesAndCities.length) {
    return new Promise((resolve, reject) => {
      reject()
    })
  }

  let province = locSelector.getProvince(store.getState())
  // console.log('province====', province)
  let provinceCode = Utils.getProvinceCode(provincesAndCities, province)
  // console.log('provinceCode====', provinceCode)

  let city = locSelector.getCity(store.getState())
  // console.log('city====', city)
  let cityCode = Utils.getCityCode(provincesAndCities, city)
  // console.log('cityCode====', cityCode)

  let district = locSelector.getDistrict(store.getState())
  // console.log('district====', district)
  let districtCode = Utils.getDistrictCode(provincesAndCities, district)
  // console.log('districtCode====', districtCode)

  let latlng = locSelector.getGeopoint(store.getState())

  if(!provinceCode) {
    store.dispatch(getCurrentLocation({
      success: (result) => {
        let position = result.position
        province = position.province
        provinceCode = Utils.getProvinceCode(provincesAndCities, province)
        city = position.city
        cityCode = Utils.getCityCode(provincesAndCities, city)
        district = position.district
        districtCode = Utils.getDistrictCode(provincesAndCities, district)
        latlng = {
          latitude: position.latitude,
          longitude: position.longitude
        }

        let params = {
          userId,
          province,
          provinceCode,
          city,
          cityCode,
          district,
          districtCode,
          ...latlng
        }
        // console.log('hLifeUpdateUserLocationInfo.params=======', params)
        return AV.Cloud.run('hLifeUpdateUserLocationInfo', params).then((result)=>{
          return result
        }, (err) => {
          err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
          throw err
        })
      },
      error: (error) => {
        return new Promise((resolve, reject) => {
          reject(error)
        })
      }
    }))
  }else {
    let params = {
      userId,
      province,
      provinceCode,
      city,
      cityCode,
      district,
      districtCode,
      ...latlng
    }
    // console.log('hLifeUpdateUserLocationInfo.params=======', params)
    return AV.Cloud.run('hLifeUpdateUserLocationInfo', params).then((result)=>{
      return result
    }, (err) => {
      err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
      throw err
    })
  }

}

export function profileSubmit(payload) {
  var userInfo = AV.Object.createWithoutData('_User', payload.id);
  userInfo.set('nickname', payload.nickname)
  userInfo.set('avatar', payload.avatar)
  //userInfo.set('mobilePhoneNumber', payload.phone)
  userInfo.set('gender', payload.gender)
  userInfo.set('birthday', payload.birthday)
  // userInfo.set('identity', [])

  return userInfo.save().then((loginedUser)=>{
    return getUserById({userId: payload.id}).then((result) => {
      if(result.error == 0) {
        let user = result.userInfo
        let userInfo = UserInfo.fromLeancloudApi(user)
        // console.log('profileSubmit.userInfo====', userInfo)
        return {
          userInfo: userInfo,
        }
      }
    }, (error) => {
      let userInfo = UserInfo.fromLeancloudObject(loginedUser)
      return {
        userInfo: userInfo,
      }
    })
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })

}

export function shopCertification(payload) {
  // console.log('shopCertification==payload=', payload)
  let Shop = AV.Object.extend('Shop')
  let shop = new Shop()
  let currentUser = AV.User.current()
  shop.set('name', payload.name)
  shop.set('phone', payload.phone)
  shop.set('shopName', payload.shopName)
  shop.set('shopAddress', payload.shopAddress)
  if(payload.geo) {
    let point = new AV.GeoPoint(payload.geo)
    shop.set('geo', point)
  }
  shop.set('geoCity', payload.geoCity)
  shop.set('geoDistrict', payload.geoDistrict)
  shop.set('invitationCode', payload.invitationCode)
  shop.set('owner', currentUser)

  currentUser.addUnique('identity', IDENTITY_SHOPKEEPER)

  return currentUser.save().then(() => {
    return shop.save()
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  }). then((result) => {
    let shopInfo = ShopInfo.fromLeancloudObject(result)
    return new List([shopInfo])
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function updateShopCover(payload) {
  let id = payload.id
  let coverUrl = payload.coverUrl
  let shop = AV.Object.createWithoutData('Shop', id)
  shop.set('coverUrl', coverUrl)
  return shop.save().then(function (result) {
    return true
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function handleShopAlbum(payload) {
  let id = payload.id
  let album = payload.album
  let shop = AV.Object.createWithoutData('Shop', id)
  shop.set('album', album)
  return shop.save().then(function (result) {
    return true
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}


export function submitCompleteShopInfo(payload) {

  return AV.Cloud.run('submitCompleteShopInfo',{payload:payload}).then(function (result) {
    return true
  }, function (err) {
    // console.log('_submitCompleteShopInfo.err====', err)
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}


export function submitEditShopInfo(payload) {
    let provincesAndCities = configSelector.selectProvincesAndCities(store.getState())
    let provinceInfo = Utils.getProvinceInfoByCityName(provincesAndCities, payload.geoCity)
    let province = provinceInfo.provinceName
    let provinceCode = provinceInfo.provinceCode
    let cityCode = Utils.getCityCode(provincesAndCities, payload.geoCity)
    let districtCode = Utils.getDistrictCode(provincesAndCities, payload.geoDistrict)
    let geoProvince = province
    let geoProvinceCode = provinceCode
    let geoCityCode = cityCode
    let geoDistrictCode = districtCode
    let params = {
      shop:{shopId:payload.shopId,album:payload.album,coverUrl:payload.coverUrl,geoProvince:geoProvince,geoProvinceCode:geoProvinceCode,geoCityCode:geoCityCode.toString(),geoDistrictCode:geoDistrictCode.toString()},
      payload:payload
    }
    // console.log('submitEditShopInfo.payload===', payload)
  return AV.Cloud.run('submitEditShopInfo',params).then((shopInfo)=>{
    // console.log('new ShopInfo:', shopInfo)
    return '更新店铺成功'
  }, (err)=>{
    // console.log(err)
    return '更新店铺失败'
  })

}

export function publishAnnouncement(payload) {
  let shopId = payload.id
  let announcementContent = payload.announcementContent
  let announcementCover = payload.announcementCover

  let shopAnnouncement = new AV.Object('ShopAnnouncement')
  shopAnnouncement.set('coverUrl', announcementCover)
  shopAnnouncement.set('content', announcementContent)
  return shopAnnouncement.save().then((result)=> {
    let shop = AV.Object.createWithoutData('Shop', shopId)
    let relation = shop.relation('containedAnnouncements')
    relation.add(shopAnnouncement)
    return shop.save()
  }).catch((err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function updateAnnouncement(payload) {
  let shopAnnouncementId = payload.shopAnnouncementId
  let announcementContent = payload.announcementContent
  let announcementCover = payload.announcementCover

  let shopAnnouncement = AV.Object.createWithoutData('ShopAnnouncement', shopAnnouncementId)
  shopAnnouncement.set('coverUrl', announcementCover)
  shopAnnouncement.set('content', announcementContent)
  return shopAnnouncement.save().then((result)=> {
    return true
  }).catch((err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function requestSmsAuthCode(payload) {
    let phone = payload.phone
    return AV.Cloud.requestSmsCode({
      mobilePhoneNumber:phone,
      name: '汇邻优店',
      op: '注册',
      ttl: 10}).then(function () {
      // do nothing
    }, function (err) {
      err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
      throw err
    })
}

export function requestLoginSmsCode(payload) {
  let phone = payload.phone
  return AV.Cloud.requestSmsCode(phone).then(function (success) {
    // do nothing
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}


export function verifySmsCode(payload) {
  let smsAuthCode = payload.smsAuthCode
  let phone = payload.phone
  if (__DEV__) {
    return new Promise((resolve) => {
      resolve()
    })
  }
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
  return AV.Cloud.run('utilVerifyInvitationCode', params).then((result)=>{
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
  // console.log('getUserById==params==', params)
  return AV.Cloud.run('hLifeGetUserinfoById', params).then((result) => {
    // console.log('getUserById==result==', result)
    return result
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function getUsers(payload) {
  let params = {}
  params.userIds = payload.userIds    // 传入一个数组
  return AV.Cloud.run('hLifeGetUsers', params).then((result) => {
    return result
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

/**
 * 查询指定用户的粉丝列表
 * @param payload
 * @returns {*|AV.Promise|IPromise<U>}
 */
export function fetchOtherUserFollowers(payload) {
  let userId = payload.userId
  let user = AV.Object.createWithoutData('_User', userId)
  let query = new AV.Query('_Follower')
  query.equalTo('user', user)
  query.include('follower')
  return query.find().then((results)=>{
    // console.log('fetchOtherUserFollowers==results=', results)
    let followers = []
    results.forEach((result)=>{
      followers.push(UserInfo.fromLeancloudObject(result, 'follower'))
    })
    return {
      userId: userId,
      followers: new List(followers)
    }
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

/**
 * 查询指定用户的粉丝总数
 * @param payload
 * @returns {*|AV.Promise|IPromise<U>}
 */
export function fetchOtherUserFollowersTotalCount(payload) {
  let userId = payload.userId
  let user = AV.Object.createWithoutData('_User', userId)
  let query = new AV.Query('_Follower')
  query.equalTo('user', user)
  return query.count().then((totalCount)=>{
    // console.log('fetchOtherUserFollowersTotalCount==totalCount=', totalCount)
    return {
      userId: userId,
      followersTotalCount: totalCount
    }
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

/**
 * 查询自己的粉丝总数
 * @returns {*}
 */
export function fetchUserFollowersTotalCount() {
  let query = AV.User.current().followerQuery()
  return query.count().then(function(totalCount) {
    // console.log('fetchUserFollowersTotalCount==totalCount=', totalCount)
    return {
      userId: AV.User.current().id,
      followersTotalCount: totalCount
    }
  }).catch((err) =>{
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

/**
 * 查询自己的粉丝
 * @returns {*}
 */
export function fetchUserFollowers(payload) {
  var params = {}
  if(!payload) {
    params = {
      isRefresh: true
    }
  }else {
    params = {
      isRefresh: payload.isRefresh,
      lastCreatedAt: payload.lastCreatedAt
    }
  }
  // console.log('hLifeFetchUserFollowers===params=====', params)
  return AV.Cloud.run('hLifeFetchUserFollowers', params).then((result) => {
    // console.log('hLifeFetchUserFollowers===result===', result)
    return {
      userId: AV.User.current().id,
      followers: new List(result.userFollowers)
    }
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })

}

// export function fetchUserFollowers(payload) {
//   let query = AV.User.current().followerQuery()
//   query.include('follower')
//   return query.find().then(function(results) {
//     let followers = []
//     results.forEach((result)=>{
//       followers.push(UserInfo.fromLeancloudObject(result))
//     })
//     return {
//       userId: AV.User.current().id,
//       followers: new List(followers)
//     }
//   }).catch((err) =>{
//     err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
//     throw err
//   })
// }

/**
 * 查询自己关注的用户列表
 * @returns {*}
 */
export function fetchUserFollowees(payload) {
  var params = {}
  if(!payload) {
    params = {
      isRefresh: true
    }
  }else {
    params = {
      isRefresh: payload.isRefresh,
      lastCreatedAt: payload.lastCreatedAt
    }
  }
  // console.log('hLifeFetchUserFollowees===params=====', params)
  return AV.Cloud.run('hLifeFetchUserFollowees', params).then((result) => {
    // console.log('hLifeFetchUserFollowees===result===', result)
    return {
      currentUserId: AV.User.current().id,
      followees: new List(result.userFollowees)
    }
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })

}

// export function fetchUserFollowees() {
//   let query = AV.User.current().followeeQuery()
//   query.include('followee')
//   return query.find().then(function(results) {
//     let followees = []
//     results.forEach((result)=>{
//       followees.push(UserInfo.fromLeancloudObject(result))
//     })
//     return {
//       currentUserId: AV.User.current().id,
//       followees: new List(followees)
//     }
//   }).catch((err) =>{
//     err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
//     throw err
//   })
// }

export function userIsFollowedTheUser(payload) {
  let userId = payload.userId
  let followee = AV.Object.createWithoutData('_User', userId)
  let query = AV.User.current().followeeQuery()
  query.equalTo('followee', followee)
  return query.count().then(function(totalCount) {
    if(totalCount) {
      return true
    }
    return false
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
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

      let activeUser = authSelector.activeUserInfo(store.getState())
      // console.log('followShop.shopDetail==', shopDetail)
      AVUtils.pushByUserList([userId], {
        alert: `${activeUser.nickname}关注了您,立即查看`,
        sceneName: 'MYATTENTION',
      })

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

export function healthProfileSubmit(payload) {
  var userInfo = AV.Object.createWithoutData('_User', payload.userId)
  let Healthprofile = AV.Object.extend('HealthProfile')
  let healthProfile = new Healthprofile()
  healthProfile.set('user', userInfo)
  healthProfile.set('nickname', payload.nickname)
  healthProfile.set('gender', payload.gender)
  healthProfile.set('birthday', payload.birthday)

  return healthProfile.save().then((result) => {
    let healthRecord = HealthProfile.fromLeancloudObject(result)
    return {
      healthProfile: healthRecord
    }
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })

}

export function getFavoriteArticles(payload) {
  let currentUser = AV.User.current()
  let query = new AV.Query('ArticleFavorite')
  query.equalTo('user',currentUser)
  query.equalTo('status',true)
  query.include('article')
  query.include('article.user')
  return query.find().then((results) => {

    let article = []
    results.forEach((result) => {
      let articleInfo= result.get('article')
     // console.log('articleInfo-====>=======',articleInfo)

      article.push(ArticleItem.fromLeancloudObject(articleInfo))
    })
    return {
      currentUserId: AV.User.current().id,
      favoriteArticles: List(article)
    }
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function setUserNickname(payload) {
  let params = {
    userId: payload.userId,
    nickname: payload.nickname,
    avatarUri:payload.avatarUri
  }
  // let avatarUri=payload.avatarUri
  // console.log('submitCompleteShopInfo.leanCoverImgUrl===', avatarUri)
    return AV.Cloud.run('hLifeSetUserNickname', params).then((result) => {
      return result
    }, (err) => {
      err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
      throw err
    })


}
