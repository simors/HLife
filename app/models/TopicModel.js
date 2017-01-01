/**
 * Created by wuxingyu on 2016/12/24.
 */
import {hidePhoneNumberDetail} from '../util/numberUtils'
import {Map, Record,List} from 'immutable'

export const TopicsConfig = Record({
  content: undefined, //话题内容
  imgGroup: undefined, //图片
  objectId: undefined,  //话题id
  categoryId: undefined,  //属于的分类
  nickname: undefined, //所属用户昵称
  createdAt: undefined,  //创建时间
  avatar: undefined,  //所属用户头像
  commentNum: undefined, //评论数
  likeUserNum: undefined, //点赞数
  likedUsers: undefined  //点赞用户列表
}, 'TopicsConfig')

export class TopicsItem extends TopicsConfig {
  static fromLeancloudObject(lcObj) {
    let topicsConfig = new TopicsConfig()
    let attrs = lcObj.attributes
    let user = lcObj.get('user')
    let nickname = "吾爱用户"
    let avatar = undefined

    //用户昵称解析
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
      record.set('likeUserNum', attrs.likeUserNum)
    })
  }
}

export const TopicCommentsConfig = Record({
  content: undefined,   //评论内容
  objectId: undefined,  //评论对象id
  nickname: undefined,  //评论用户昵称
  createdAt: undefined, //评论创建时间
  avatar: undefined,    //评论用户头像
  parentCommentContent: undefined,  //父评论正文
  parentCommentUser: undefined,     //父评论的作者昵称
}, 'TopicCommentsConfig')

export class TopicCommentsItem extends TopicCommentsConfig {
  static fromLeancloudObject(lcObj) {
    let topicCommentsConfig = new TopicCommentsConfig()
    let attrs = lcObj.attributes
    let user = lcObj.get('user')
    let nickname = "吾爱用户"
    let avatar = undefined

    //用户昵称解析
    if (user) {
      avatar = user.get('avatar')
      nickname = user.get('nickname')
      if (!nickname) {
        let phoneNumber = user.getMobilePhoneNumber()
        nickname = hidePhoneNumberDetail(phoneNumber)
      }
    }

    let parentUserPoint = undefined
    let parentCommentUser = "吾爱用户"

    //有父评论的情况下
    if (attrs.parentComment) {
      parentUserPoint = attrs.parentComment.attributes.user
      //父用户昵称解析
      if (parentUserPoint) {
        parentCommentUser = parentUserPoint.get('nickname')
        if (!parentCommentUser) {
          let phoneNumber = parentUserPoint.getMobilePhoneNumber()
          parentCommentUser = hidePhoneNumberDetail(phoneNumber)
        }
      }
    }
    return topicCommentsConfig.withMutations((record)=> {
      record.set('content', attrs.content)
      record.set('createdAt', lcObj.createdAt)
      record.set('nickname', nickname)
      record.set('avatar', avatar)
      record.set('objectId', lcObj.id)

      //有父评论的情况下设置
      if (attrs.parentComment) {
        record.set('parentCommentContent', attrs.parentComment.attributes.content)
        record.set('parentCommentUser', parentCommentUser)
      }
    })
  }
}

export const Topic = Record({
  topics:List(),
  topicComments:List(),
  TopicLikesNum: Map(),
  IsLikedByCurrentUser: Map(),
}, 'Topic')
