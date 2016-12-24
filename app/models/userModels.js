import {Record, Map, List} from 'immutable'

export const UserInfoRecord = Record({
  id: undefined,
  phone: undefined,
  token: undefined,
  nickname: undefined,
  avatar: undefined
}, 'UserInfoRecord')

export class UserInfo extends UserInfoRecord {
  static fromLeancloudObject(lcObj) {
    let attrs = lcObj.attributes
    let info = new UserInfoRecord(attrs)
    info = info.withMutations((record) => {
      record.set('id', lcObj.id)
      record.set('phone', lcObj.attributes.mobilePhoneNumber)
      record.set('nickname',lcObj.attributes.nickname)
      record.set('avatar',lcObj.attributes.avatar)
    })
    return info
  }
}

