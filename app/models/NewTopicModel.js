/**
 * Created by lilu on 2017/7/4.
 */


import {hidePhoneNumberDetail, formatLeancloudTime, getConversationTime} from '../util/numberUtils'
import {Map, Record,List,Set} from 'immutable'

export const TopicCommentsConfig = Record({
  commentId : undefined,
  topicId : undefined,
  content : undefined,
  parentCommentContent : undefined,
  parentCommentUserName : undefined,
  parentCommentNickname : undefined,
  parentCommentId : undefined,
  replyCommentContent : undefined,
  replyCommentUserName : undefined,
  replyCommentNickname : undefined,
  replyCommentId : undefined,
  upCount : undefined,
  authorUsername : undefined,
  authorNickname : undefined,
  commentCount : undefined,
  authorId : undefined,
  authorAvatar : undefined,
  createdAt : undefined,
  address : undefined,
  city : undefined,
  longitude : undefined,
  latitude : undefined,
  streetNumber : undefined,
  street : undefined,
  province : undefined,
  country : undefined,
  district : undefined,
  createdDate : undefined,
  updatedAt : undefined
}, 'TopicCommentsConfig')

export class TopicCommentsItem extends TopicCommentsConfig {
  static fromLeancloudApi(lcObj) {
    let topicCommentsConfig = new TopicCommentsConfig()
//用户昵称解析
    let nickname = lcObj.authorNickname
      if (!nickname) {
        let phoneNumber = lcObj.authorUsername
        nickname = hidePhoneNumberDetail(phoneNumber)
      }

    return topicCommentsConfig.withMutations((record)=> {
      record.set('commentId', lcObj.commentId)
      record.set('topicId', lcObj.topicId)
      record.set('content', lcObj.content)
      record.set('parentCommentContent', lcObj.parentCommentContent)
      record.set('parentCommentUserName', lcObj.parentCommentUserName)
      record.set('parentCommentId', lcObj.parentCommentId)
      record.set('parentCommentNickname', lcObj.parentCommentNickname)
      record.set('replyCommentContent', lcObj.replyCommentContent)
      record.set('replyCommentUserName', lcObj.replyCommentUserName)
      record.set('replyCommentId', lcObj.replyCommentId)
      record.set('replyCommentNickname', lcObj.replyCommentNickname)
      record.set('upCount', lcObj.upCount)
      record.set('authorUsername', lcObj.authorUsername)
      record.set('authorNickname', lcObj.authorNickname)
      record.set('commentCount', lcObj.commentCount)
      record.set('authorId', lcObj.authorId)
      record.set('authorAvatar', lcObj.authorAvatar)
      record.set('address', lcObj.address)
      record.set('city', lcObj.city)
      record.set('longitude', lcObj.longitude)
      record.set('latitude', lcObj.latitude)
      record.set('streetNumber', lcObj.streetNumber)
      record.set('street', lcObj.street)
      record.set('province', lcObj.province)
      record.set('country', lcObj.country)
      record.set('district', lcObj.district)
      record.set('createdDate', lcObj.createdDate)
      if (lcObj.updatedAt) {
        record.set('updatedAt', lcObj.updatedAt.valueOf())
        // record.set('createdDate', formatLeancloudTime(lcObj.createdAt, 'YYYY-MM-DD'))
      }
      // record.set('createdAt', lcObj.createdAt.valueOf())
      if (lcObj.createdAt) {
        record.set('createdAt', lcObj.createdAt.valueOf())
        // record.set('createdDate', formatLeancloudTime(lcObj.createdAt, 'YYYY-MM-DD'))
      }
      //有父评论的情况下设置
    })
  }
}


export const TopicsConfig = Record({
  content: undefined, //话题内容
  title: undefined,
  abstract:undefined,
  imgGroup: undefined, //图片
  objectId: undefined,  //话题id
  categoryId: undefined,  //属于的分类
  nickname: undefined, //所属用户昵称
  userId:undefined,     // 所属用户的id
  createdAt: undefined,  //创建时间
  updatedAt: undefined,  //更新时间
  avatar: undefined,  //所属用户头像
  commentNum: undefined, //评论数
  likeCount: undefined, //点赞数
  address : undefined,
  city : undefined,
  longitude : undefined,
  latitude : undefined,
  streetNumber : undefined,
  street : undefined,
  province : undefined,
  country : undefined,
  district : undefined,
  likedUsers: undefined,  //点赞用户列表
  createdDate: undefined,
  lastLoginDuration: undefined,
  picked: undefined,

}, 'TopicsConfig')

export class TopicsItem extends TopicsConfig {
  static fromLeancloudApi(lcObj) {
    // console.log('lcObjec+++++++++>',lcObj)
    let topicConfig = new TopicsConfig()
//用户昵称解析
//     let nickname = lcObj.nickname
//     if (!nickname) {
//       let phoneNumber = lcObj.username
//       nickname = hidePhoneNumberDetail(phoneNumber)
//     }
    let userUpdatedAt = lcObj.userUpdatedAt
    return topicConfig.withMutations((record)=>{
      record.set('content', lcObj.content)
      record.set('title', lcObj.title)
      record.set('abstract', lcObj.abstract)
      record.set('imgGroup', lcObj.imgGroup)
      record.set('objectId', lcObj.objectId)
      record.set('categoryId', lcObj.categoryId)
      record.set('nickname', lcObj.nickname)
      record.set('userId', lcObj.userId)
      // record.set('createdAt', lcObj.createdAt)
      record.set('updatedAt', lcObj.updatedAt)
      record.set('avatar', lcObj.avatar)
      record.set('likeCount', lcObj.likeCount)
      record.set('commentNum', lcObj.commentNum)
      record.set('address', lcObj.address)
      record.set('city', lcObj.city)
      record.set('longitude', lcObj.longitude)
      record.set('latitude', lcObj.latitude)
      record.set('streetNumber', lcObj.streetNumber)
      record.set('street', lcObj.street)
      record.set('province', lcObj.province)
      record.set('country', lcObj.country)

      record.set('createdDate', lcObj.createdDate)
      if(userUpdatedAt) {
        record.set('lastLoginDuration', getConversationTime(userUpdatedAt.valueOf()))
      }
      record.set('picked', lcObj.picked)
      if (lcObj.updatedAt) {
        record.set('updatedAt', lcObj.updatedAt.valueOf())
        // record.set('createdDate', formatLeancloudTime(lcObj.createdAt, 'YYYY-MM-DD'))
      }

      // record.set('createdAt', lcObj.createdAt.valueOf())
      if (lcObj.createdAt) {
        record.set('createdAt', lcObj.createdAt.valueOf())
        // record.set('createdDate', formatLeancloudTime(lcObj.createdAt, 'YYYY-MM-DD'))
      }
    })
  }
}

export const TopicUpInfoConfig = Record({
  upId: undefined,
  targetId: undefined,
  nickname: undefined, //所属用户昵称
  userId:undefined,
  createdAt: undefined,  //创建时间
  avatar: undefined,  //用户头像
}, 'TopicUpInfo')

export class TopicUpInfoItem extends TopicUpInfoConfig {
  static fromLeancloudApi(lcObj) {
    let topicUpInfoConfig = new TopicUpInfoConfig()
    return topicUpInfoConfig.withMutations((record)=> {
      record.set('upId',lcObj.id)
      record.set('targetId',lcObj.targetId)
      record.set('createdAt', lcObj.createdAt)
      record.set('nickname', lcObj.user?lcObj.user.nickname:'')
      record.set('avatar', lcObj.user?lcObj.user.avatar:'')
      record.set('userId', lcObj.user?lcObj.user.id:'')
    })
  }
}

export const NewTopics = Record({
  allTopics: Map(),
  pickedTopics: List(),
  localTopics: List(),
  cateTopics: Map(),
  mainPageTopics: List(),
  userTopics: Map(),
  allComments : Map(),
  commentsForTopic : Map(),
  commentsForComment : Map(),
  myCommentsUps : Set(),
  myTopicsUps : Set(),
  allUps: Map(),
  topicUps: Map(),

}, 'NewTopic')
