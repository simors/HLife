import {Record, Map, List} from 'immutable'

export const UserInfoRecord = Record({
  id: undefined,
  phone: undefined,
  token: undefined,
  avatar: undefined,
  profileFlag: false,
  nickname: undefined,
  gender: undefined,
  birthday: undefined,
}, 'UserInfoRecord')

export class UserInfo extends UserInfoRecord {
  static fromLeancloudObject(lcObj) {
    console.log('lcObj=', lcObj)
    let attrs = lcObj.attributes
    let info = new UserInfoRecord()
    info = info.withMutations((record) => {
      record.set('id', lcObj.id)
      record.set('avatar',lcObj.attributes.avatar)
      record.set('phone', attrs.mobilePhoneNumber)
      record.set('profileFlag', attrs.profileFlag)
      record.set('nickname', attrs.nickname)
      record.set('gender', attrs.gender)
      record.set('birthday', attrs.birthday)
    })
    return info
  }
}

