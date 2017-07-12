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
  district : undefined
}, 'TopicCommentsConfig')

export class TopicCommentsItem extends TopicCommentsConfig {
  static fromLeancloudObject(lcObj) {
    let topicCommentsConfig = new TopicCommentsConfig()

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

      // record.set('createdAt', lcObj.createdAt.valueOf())
      if (lcObj.createdAt) {
        record.set('createdAt', lcObj.createdAt.valueOf())
        // record.set('createdDate', formatLeancloudTime(lcObj.createdAt, 'YYYY-MM-DD'))
      }
      //有父评论的情况下设置
    })
  }
}

export const NewTopics = Record({
  allTopics: Map(),
  pickedTopics: List(),
  localTopics: List(),
  cateTopics: Map(),
  allComments : Map(),
  commentsForTopic : Map(),
  commentsForComment : Map(),
  myCommentsUps : Set(),
  myTopicsUps : Set(),
}, 'NewTopic')
