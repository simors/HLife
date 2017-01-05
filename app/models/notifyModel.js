/**
 * Created by yangyang on 2017/1/5.
 */
import {Map, List, Record} from 'immutable'

export const NotifyMsgRecord = Record({
  activeNotify: undefined,
  messageMap: Map(),              // 键为消息id，值为消息内容，类型可以是TopicCommentMsg，ShopCommentMsg，TopicLikeMsg，ShopLikeMsg，UserFollowMsg，ShopFollowMsg
  notifyMsgByType: Map(),         // 建为消息类型，值的类型为TypedNotifyMsgRecord
}, 'NotifyMsgRecord')

export const TypedNotifyMsgRecord = Record({
  type: undefined,
  unReadCount: 0,
  messageList: List(),
}, 'TypedNotifyMsgRecord')

export const TopicCommentMsg = Record({
  id: undefined,
  msgType: undefined,
  userId: undefined,
  nickname: undefined,
  avatar: undefined,
  topicId: undefined,
  title: undefined,
  text: undefined,
}, 'TopicCommentMsg')

export const ShopCommentMsg = Record({
  id: undefined,
  msgType: undefined,
  userId: undefined,
  nickname: undefined,
  avatar: undefined,
  shopId: undefined,
  text: undefined,
}, 'ShopCommentMsg')

export const TopicLikeMsg = Record({
  id: undefined,
  msgType: undefined,
  userId: undefined,
  nickname: undefined,
  avatar: undefined,
  topicId: undefined,
  title: undefined,
  text: undefined,
}, 'TopicLikeMsg')

export const ShopLikeMsg = Record({
  id: undefined,
  msgType: undefined,
  userId: undefined,
  nickname: undefined,
  avatar: undefined,
  shopId: undefined,
  text: undefined,
}, 'ShopLikeMsg')

export const UserFollowMsg = Record({
  id: undefined,
  userId: undefined,
  nickname: undefined,
  avatar: undefined,
  text: undefined,
}, 'UserFollowMsg')

export const ShopFollowMsg = Record({
  id: undefined,
  userId: undefined,
  nickname: undefined,
  avatar: undefined,
  shopId: undefined,
  text: undefined,
}, 'ShopFollowMsg')

export class NotifyMessage extends NotifyMsgRecord {

}