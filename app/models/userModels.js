import {Record, Map, List} from 'immutable'

export const UserInfoRecord = Record({
  id: undefined,
  phone: undefined,
  token: undefined,
  avatar: undefined,
  nickname: undefined,
  gender: undefined,
  birthday: undefined,
  identity: undefined,
}, 'UserInfoRecord')

export const UserStateRecord = Record({
  activeUser: undefined,      // 已登录用户ID
  profiles: Map(),            // 用户个人信息列表，已用户id作为健值
  token: undefined,
  followees: Map(),
  favoriteArticles: Map(),
  shop: List()
}, 'UserStateRecord')

export class UserInfo extends UserInfoRecord {
  static fromLeancloudObject(lcObj) {
    let attrs = lcObj.attributes
    let info = new UserInfoRecord()
    info = info.withMutations((record) => {
      record.set('id', lcObj.id)
      record.set('avatar',lcObj.attributes.avatar)
      record.set('phone', attrs.mobilePhoneNumber)
      record.set('nickname', attrs.nickname)
      record.set('gender', attrs.gender)
      record.set('birthday', attrs.birthday)
      record.set('identity', attrs.identity)
    })
    return info
  }

  static fromLeancloudApi(lcObj) {
    let info = new UserInfoRecord()
    info = info.withMutations((record) => {
      record.set('id', lcObj.id)
      record.set('avatar',lcObj.avatar)
      record.set('phone', lcObj.phone)
      record.set('nickname', lcObj.nickname)
      record.set('gender', lcObj.gender)
      record.set('birthday', lcObj.birthday)
      record.set('identity', new List(lcObj.identity))
    })
    return info
  }

  static fromShopFollowersLeancloudObject(lcObj) {
    let attrs = lcObj.attributes
    let info = new UserInfoRecord()
    info = info.withMutations((record) => {
      let fAttrs = lcObj.attributes.follower.attributes
      record.set('id', lcObj.attributes.follower.id)
      record.set('avatar',fAttrs.avatar)
      record.set('phone', fAttrs.mobilePhoneNumber)
      record.set('nickname', fAttrs.nickname)
      record.set('gender', fAttrs.gender)
      record.set('birthday', fAttrs.birthday)
      record.set('identity', fAttrs.identity)
    })
    return info
  }

}

export class UserState extends UserStateRecord {
  getUserInfoById(userId) {
    const userInfo = this.profiles.get(userId)
    return userInfo ? userInfo : new UserInfo()
  }
}