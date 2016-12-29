/**
 * Created by wuxingyu on 2016/12/24.
 */
import {Record} from 'immutable'
import {hidePhoneNumberDetail} from '../util/numberUtils'

export const TopicsConfig = Record({
  content: undefined, //话题内容
  imgGroup: undefined, //图片
  objectId: undefined,
  categoryId: undefined,  //属于的分类
  nickname: undefined,
  createdAt: undefined,
  avatar: undefined,
  commentNum:undefined,
}, 'TopicsConfig')

export class TopicsItem extends TopicsConfig {
  static fromLeancloudObject(lcObj) {
    let topicsConfig = new TopicsConfig()
    let attrs = lcObj.attributes
    let user = lcObj.get('user')
    let nickname = "吾爱用户"
    let avatar = undefined
    if (user) {
      avatar = user.get('avatar')
      nickname = user.get('nickname')
      if (!nickname) {
        let phoneNumber = user.getMobilePhoneNumber()
        nickname = hidePhoneNumberDetail(phoneNumber)
      }
    }
    return topicsConfig.withMutations((record)=> {
      record.set('content', attrs.content)
      record.set('imgGroup', attrs.imgGroup)
      record.set('createdAt', lcObj.createdAt)
      record.set('categoryId', attrs.category.id)
      record.set('nickname', nickname)
      record.set('avatar', avatar)
      record.set('objectId', lcObj.id)
      record.set('commentNum', attrs.commentNum)
    })
  }
}

export const TopicCommentsConfig = Record({
  content: undefined, //评论内容
  objectId: undefined,
  parentComment: undefined,
  nickname: undefined,
  createdAt: undefined,
  avatar: undefined,
  parentCommentId:undefined,
}, 'TopicCommentsConfig')

export class TopicCommentsItem extends TopicCommentsConfig {
  static fromLeancloudObject(lcObj) {
    let topicCommentsConfig = new TopicCommentsConfig()
    let attrs = lcObj.attributes
    let user = lcObj.get('user')
    let nickname = "吾爱用户"
    let avatar = undefined
    if (user) {
      avatar = user.get('avatar')
      nickname = user.get('nickname')
      if (!nickname) {
        let phoneNumber = user.getMobilePhoneNumber()
        nickname = hidePhoneNumberDetail(phoneNumber)
      }
    }
    return topicCommentsConfig.withMutations((record)=> {
      record.set('content', attrs.content)
      record.set('createdAt', lcObj.createdAt)
      record.set('nickname', nickname)
      record.set('avatar', avatar)
      record.set('objectId', lcObj.id)
      if (attrs.parentCommentId) {
        record.set('parentCommentId', attrs.parentCommentId)
      }
    })
  }
}

