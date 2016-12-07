import {Record, Map, List} from 'immutable'

export const UserInfoRecord = Record({
  id: undefined,
  nickname: undefined,
  realName: undefined,
  phone: undefined,
  avatar: undefined,
  token: undefined,
  gender: undefined,
  detailId: undefined,
  identity: List(),
  type: undefined,
}, 'UserInfoRecord')

export const UserDetailRecord = Record({
  id: undefined,
  groups: List(),
  corpus: List(),
  articles: List(),
  articleCount: 0,
  reviewCount: 0,
  likeCount: 0,
  wordCount: 0,
  school: undefined,
  classNo: undefined,
  desc: undefined,
  personalSign: undefined,
  backgroundImg: undefined,
  drafts: List(),
}, 'UserDetailRecord')

export const UserProfileRecord = Record({
  userInfo: UserInfoRecord(),
  userDetail: UserDetailRecord(),
}, 'UserProfileRecord')

export const UserStateRecord = Record({
  isLoading: true,
  fakeToken: false,
  activeUser: undefined,
  profiles: Map(),
  token: undefined,
  recommendUsers: List(),
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
  static  assignUserDetail(detailObj) {
    let detail = new UserDetail(detailObj)
    return detail.withMutations((record)=> {
      record.set('likeCount', attrs.likeCnt ? attrs.likeCnt : 0)
      record.set('reviewCount', attrs.reviewCnt ? attrs.reviewCnt : 0)
      record.set('articleCount', attrs.articleCnt ? attrs.articleCnt : 0)
      record.set('wordCount', attrs.wordCnt ? attrs.wordCnt : 0)
    })
  }

  static fromLeancloudObject(lcObj) {
    let detail = new UserDetail()
    let attrs = lcObj.attributes
    return detail.withMutations((record)=> {
      
    })
  }

  static fromCloudFuncResult(result) {
    let detail = new UserDetail(result)
    return detail.withMutations((record)=> {
      record.set('id', result.objectId)
      record.set('likeCount', result.likeCnt)
      record.set('reviewCount', result.reviewCnt)
      record.set('articleCount', result.articleCnt)
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

