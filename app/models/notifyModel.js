/**
 * Created by yangyang on 2017/1/5.
 */
import {Map, List, Record} from 'immutable'

export const NotifyMsgRecord = Record({
  messageMap: Map(),              // 键为消息id，值为消息内容，类型可以是TopicCommentMsg，ShopCommentMsg，TopicLikeMsg，ShopLikeMsg，UserFollowMsg，ShopFollowMsg
  notifyMsgByType: Map(),         // 建为消息类型，值的类型为TypedNotifyMsgRecord
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
  nickname: undefined,
  avatar: undefined,
  topicId: undefined,
  title: undefined,
  text: undefined,
  timestamp: undefined,
}, 'TopicCommentMsg')

export const ShopCommentMsgRecord = Record({
  convId: undefined,
  msgId: undefined,
  msgType: undefined,
  userId: undefined,
  nickname: undefined,
  avatar: undefined,
  shopId: undefined,
  text: undefined,
  timestamp: undefined,
}, 'ShopCommentMsg')

export const TopicLikeMsgRecord = Record({
  convId: undefined,
  msgId: undefined,
  msgType: undefined,
  userId: undefined,
  nickname: undefined,
  avatar: undefined,
  topicId: undefined,
  title: undefined,
  text: undefined,
  timestamp: undefined,
}, 'TopicLikeMsg')

export const ShopLikeMsgRecord = Record({
  convId: undefined,
  msgId: undefined,
  msgType: undefined,
  userId: undefined,
  nickname: undefined,
  avatar: undefined,
  shopId: undefined,
  text: undefined,
  timestamp: undefined,
}, 'ShopLikeMsg')

export const UserFollowMsgRecord = Record({
  convId: undefined,
  msgId: undefined,
  msgType: undefined,
  userId: undefined,
  nickname: undefined,
  avatar: undefined,
  text: undefined,
  timestamp: undefined,
}, 'UserFollowMsg')

export const ShopFollowMsgRecord = Record({
  convId: undefined,
  msgId: undefined,
  msgType: undefined,
  userId: undefined,
  nickname: undefined,
  avatar: undefined,
  shopId: undefined,
  text: undefined,
  timestamp: undefined,
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

      let attrs = lcMsg.content? lcMsg.content._lcattrs: lcMsg.attributes
      record.set('nickname', attrs.nickname)
      record.set('avatar', attrs.avatar)
      record.set('topicId', attrs.topicId)
      record.set('title', attrs.title)
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

      let attrs = lcMsg.content? lcMsg.content._lcattrs: lcMsg.attributes
      record.set('nickname', attrs.nickname)
      record.set('avatar', attrs.avatar)
      record.set('shopId', attrs.shopId)
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

      let attrs = lcMsg.content? lcMsg.content._lcattrs: lcMsg.attributes
      record.set('nickname', attrs.nickname)
      record.set('avatar', attrs.avatar)
      record.set('shopId', attrs.shopId)
    })
  }
}

export class NotifyMessage extends NotifyMsgRecord {

}