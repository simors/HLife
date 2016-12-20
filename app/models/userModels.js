import {Record, Map, List} from 'immutable'

export const UserInfoRecord = Record({
  id: undefined,
  nickname: undefined,
  realName: undefined,
  phone: undefined,
  avatar: undefined,
  token: undefined,
  gender: undefined,
  detailId: undefined,        // 指向UserProfileRecord
  attr: List(),               // 用户属性，如医生、推广员、店铺老板
}, 'UserInfoRecord')

export const UserDetailRecord = Record({
  id: undefined,
  articles: List(),
  articleCount: 0,
}, 'UserDetailRecord')

export const UserProfileRecord = Record({
  userInfo: UserInfoRecord(),
  userDetail: UserDetailRecord(),
}, 'UserProfileRecord')

export const UserStateRecord = Record({
  activeUser: undefined,
  profiles: Map(),
}, 'UserStateRecord')


export class UserInfo extends UserInfoRecord {
  static  assignUserInfo(infoObj) {
    let info = new UserInfo(infoObj)
    info = info.withMutations((record) => {
      record.set('id', infoObj.objectId)
      record.set('detailId', infoObj.detail ? infoObj.detail.id : undefined)
      record.set('phone', infoObj.mobilePhoneNumber)
    })
    return info
  }

  static fromLeancloudObject(lcObj) {
    let attrs = lcObj.attributes
    let info = new UserInfo(attrs)
    info = info.withMutations((record) => {
      record.set('id', lcObj.id)
      if (lcObj.get('detail') != undefined) {
        record.set('detailId', lcObj.get('detail').id)
      }
      record.set('phone', lcObj.attributes.mobilePhoneNumber)
    })
    info = info.update('gender', val => {
      return val ? parseInt(val) : 1
    })
    return info
  }
}

export class UserDetail extends UserDetailRecord {
  static fromLeancloudObject(lcObj) {
    let detail = new UserDetail()
    let attrs = lcObj.attributes
    return detail.withMutations((record)=> {
      record.set('id', lcObj.id)
    })
  }
}

export class UserProfile extends UserProfileRecord {

}

export class UserState extends UserStateRecord {
  getUserInfoById(userId) {
    const profile = this.profiles.get(userId)
    return profile ? (profile.get('userInfo') ? profile.get('userInfo') : new UserInfo()) : new UserInfo()
  }

  getUserDetailById(userId) {
    const profile = this.profiles.get(userId)
    return profile ? (profile.get('userDetail') ? profile.get('userDetail') : new UserDetail()) : new UserDetail()
  }
}

