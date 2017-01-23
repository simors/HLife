/**
 * Created by yangyang on 2017/1/5.
 */
import {Map, List, Record} from 'immutable'

export const NotifyMsgRecord = Record({
  unReadCount: 0,
  messageMap: Map(),              // 键为消息id，值为消息内容，类型可以是TopicCommentMsg，ShopCommentMsg，TopicLikeMsg，ShopLikeMsg，UserFollowMsg，ShopFollowMsg
  notifyMsgByType: Map(),         // 建为消息类型(TOPIC_TYPE, SHOP_TYPE, SYSTEM_TYPE)，值的类型为TypedNotifyMsgRecord
  lastNoticeAt: undefined,
}, 'NotifyMsgRecord')

export const TypedNotifyMsgRecord = Record({
  type: undefined,
  unReadCount: 0,
  messageList: List(),
}, 'TypedNotifyMsgRecord')

export const TopicCommentMsgRecord = Record({
  convId: undefined,
  msgId: undefined,
  msgType: undefined,
  userId: undefined,
  text: undefined,
  timestamp: undefined,
  status: undefined,          // 消息的状态，可以为unread,read
  nickname: undefined,
  avatar: undefined,
  topicId: undefined,
  title: undefined,
  commentId: undefined,
  commentContent: undefined,
}, 'TopicCommentMsg')

export const ShopCommentMsgRecord = Record({
  convId: undefined,
  msgId: undefined,
  msgType: undefined,
  userId: undefined,
  text: undefined,
  timestamp: undefined,
  status: undefined,          // 消息的状态，可以为unread,read
  nickname: undefined,
  avatar: undefined,
  shopId: undefined,
  commentId: undefined,
  commentContent: undefined,
  replyId: undefined,
  replyContent: undefined
}, 'ShopCommentMsg')

export const TopicLikeMsgRecord = Record({
  convId: undefined,
  msgId: undefined,
  msgType: undefined,
  userId: undefined,
  text: undefined,
  timestamp: undefined,
  status: undefined,          // 消息的状态，可以为unread,read
  nickname: undefined,
  avatar: undefined,
  topicId: undefined,
  title: undefined,
}, 'TopicLikeMsg')

export const ShopLikeMsgRecord = Record({
  convId: undefined,
  msgId: undefined,
  msgType: undefined,
  userId: undefined,
  text: undefined,
  timestamp: undefined,
  status: undefined,          // 消息的状态，可以为unread,read
  nickname: undefined,
  avatar: undefined,
  shopId: undefined,
}, 'ShopLikeMsg')

export const UserFollowMsgRecord = Record({
  convId: undefined,
  msgId: undefined,
  msgType: undefined,
  userId: undefined,
  text: undefined,
  timestamp: undefined,
  status: undefined,          // 消息的状态，可以为unread,read
  nickname: undefined,
  avatar: undefined,
}, 'UserFollowMsg')

export const ShopFollowMsgRecord = Record({
  convId: undefined,
  msgId: undefined,
  msgType: undefined,
  userId: undefined,
  text: undefined,
  timestamp: undefined,
  status: undefined,          // 消息的状态，可以为unread,read
  nickname: undefined,
  avatar: undefined,
  shopId: undefined,
}, 'ShopFollowMsg')

export class TopicCommentMsg extends TopicCommentMsgRecord {
  static fromLeancloudMessage(lcMsg) {
    let msg = new TopicCommentMsg()

    return msg.withMutations((record) => {
      var messageType, text
      if (lcMsg.content) {
        messageType = lcMsg.content._lctype
        text = lcMsg.content._lctext
      } else {
        messageType = lcMsg.type
        text = lcMsg.text
      }
      record.set('convId', lcMsg.cid)
      record.set('msgId', lcMsg.id)
      record.set('userId', lcMsg.from)
      record.set('msgType', messageType)
      record.set('text', text)
      record.set('timestamp', lcMsg.timestamp)
      record.set('status', 'unread')

      let attrs = lcMsg.content? lcMsg.content._lcattrs: lcMsg.attributes
      record.set('nickname', attrs.nickname)
      record.set('avatar', attrs.avatar)
      record.set('topicId', attrs.topicId)
      record.set('title', attrs.title)
      record.set('commentId', attrs.commentId)
      record.set('commentContent', attrs.commentContent)
    })
  }
}

export class ShopCommentMsg extends ShopCommentMsgRecord {
  static fromLeancloudMessage(lcMsg) {
    let msg = new ShopCommentMsg()

    return msg.withMutations((record) => {
      var messageType, text
      if (lcMsg.content) {
        messageType = lcMsg.content._lctype
        text = lcMsg.content._lctext
      } else {
        messageType = lcMsg.type
        text = lcMsg.text
      }
      record.set('convId', lcMsg.cid)
      record.set('msgId', lcMsg.id)
      record.set('userId', lcMsg.from)
      record.set('msgType', messageType)
      record.set('text', text)
      record.set('timestamp', lcMsg.timestamp)
      record.set('status', 'unread')

      let attrs = lcMsg.content? lcMsg.content._lcattrs: lcMsg.attributes
      record.set('nickname', attrs.nickname)
      record.set('avatar', attrs.avatar)
      record.set('shopId', attrs.shopId)
      record.set('commentId', attrs.commentId)
      record.set('commentContent', attrs.commentContent)
      record.set('replyId', attrs.replyId)
      record.set('replyContent', attrs.replyContent)
    })
  }
}

export class TopicLikeMsg extends TopicLikeMsgRecord {
  static fromLeancloudMessage(lcMsg) {
    let msg = new TopicLikeMsg()

    return msg.withMutations((record) => {
      var messageType, text
      if (lcMsg.content) {
        messageType = lcMsg.content._lctype
        text = lcMsg.content._lctext
      } else {
        messageType = lcMsg.type
        text = lcMsg.text
      }
      record.set('convId', lcMsg.cid)
      record.set('msgId', lcMsg.id)
      record.set('userId', lcMsg.from)
      record.set('msgType', messageType)
      record.set('text', text)
      record.set('timestamp', lcMsg.timestamp)
      record.set('status', 'unread')

      let attrs = lcMsg.content? lcMsg.content._lcattrs: lcMsg.attributes
      record.set('nickname', attrs.nickname)
      record.set('avatar', attrs.avatar)
      record.set('topicId', attrs.topicId)
      record.set('title', attrs.title)
    })
  }
}

export class ShopLikeMsg extends ShopLikeMsgRecord {
  static fromLeancloudMessage(lcMsg) {
    let msg = new ShopLikeMsg()

    return msg.withMutations((record) => {
      var messageType, text
      if (lcMsg.content) {
        messageType = lcMsg.content._lctype
        text = lcMsg.content._lctext
      } else {
        messageType = lcMsg.type
        text = lcMsg.text
      }
      record.set('convId', lcMsg.cid)
      record.set('msgId', lcMsg.id)
      record.set('userId', lcMsg.from)
      record.set('msgType', messageType)
      record.set('text', text)
      record.set('timestamp', lcMsg.timestamp)
      record.set('status', 'unread')

      let attrs = lcMsg.content? lcMsg.content._lcattrs: lcMsg.attributes
      record.set('nickname', attrs.nickname)
      record.set('avatar', attrs.avatar)
      record.set('shopId', attrs.shopId)
    })
  }
}

export class UserFollowMsg extends UserFollowMsgRecord {
  static fromLeancloudMessage(lcMsg) {
    let msg = new UserFollowMsg()

    return msg.withMutations((record) => {
      var messageType, text
      if (lcMsg.content) {
        messageType = lcMsg.content._lctype
        text = lcMsg.content._lctext
      } else {
        messageType = lcMsg.type
        text = lcMsg.text
      }
      record.set('convId', lcMsg.cid)
      record.set('msgId', lcMsg.id)
      record.set('userId', lcMsg.from)
      record.set('msgType', messageType)
      record.set('text', text)
      record.set('timestamp', lcMsg.timestamp)
      record.set('status', 'unread')

      let attrs = lcMsg.content? lcMsg.content._lcattrs: lcMsg.attributes
      record.set('nickname', attrs.nickname)
      record.set('avatar', attrs.avatar)
    })
  }
}

export class ShopFollowMsg extends ShopFollowMsgRecord {
  static fromLeancloudMessage(lcMsg) {
    let msg = new ShopLikeMsg()

    return msg.withMutations((record) => {
      var messageType, text
      if (lcMsg.content) {
        messageType = lcMsg.content._lctype
        text = lcMsg.content._lctext
      } else {
        messageType = lcMsg.type
        text = lcMsg.text
      }
      record.set('convId', lcMsg.cid)
      record.set('msgId', lcMsg.id)
      record.set('userId', lcMsg.from)
      record.set('msgType', messageType)
      record.set('text', text)
      record.set('timestamp', lcMsg.timestamp)
      record.set('status', 'unread')

      let attrs = lcMsg.content? lcMsg.content._lcattrs: lcMsg.attributes
      record.set('nickname', attrs.nickname)
      record.set('avatar', attrs.avatar)
      record.set('shopId', attrs.shopId)
    })
  }
}

export class NotifyMessage extends NotifyMsgRecord {

}