/**
 * Created by yangyang on 2017/1/6.
 */

import {getConversationTime} from '../util/numberUtils'

export function hasNewNotice(state) {
  const unReadCnt = state.NOTICE.get('unReadCount')
  return unReadCnt > 0 ? true : false
}

export function hasNewNoticeByType(state, type) {
  let notifyMsg = state.NOTICE.getIn(['notifyMsgByType', type])
  if (notifyMsg) {
    let unReadCnt = notifyMsg.get('unReadCount')
    if (unReadCnt) {
      return unReadCnt > 0 ? true : false
    }
  }
  return false
}

export function getNewestNoticeByType(state, type) {
  let notifyMsg = state.NOTICE.getIn(['notifyMsgByType', type])
  if (notifyMsg) {
    let messageList = notifyMsg.get('messageList')
    if (!messageList) {
      return {
        lastMessageAt: "",
        lastMessage: "还没有收到过通知消息，要多多参与互动哦^_^"
      }
    }
    let lastMsgId = messageList.first()
    if (lastMsgId) {
      let lastMessageObj = state.NOTICE.getIn(['messageMap', lastMsgId])
      if (lastMessageObj) {
        let msgTime = new Date(lastMessageObj.get('timestamp'))
        let lastMessageAt = getConversationTime(msgTime.getTime())
        return {
          lastMessageAt: lastMessageAt,
          lastMessage: lastMessageObj.get('text')
        }
      }
    }
  }
  return {
    lastMessageAt: "",
    lastMessage: "还没有收到过通知消息，要多多参与互动哦^_^"
  }
}

export function getNoticeListByType(state, type) {
  let notifyList = []
  let notifyMsg = state.NOTICE.getIn(['notifyMsgByType', type])
  if (notifyMsg) {
    let messageList = notifyMsg.get('messageList')
    if (!messageList) {
      return notifyList
    }
    messageList.map((msgId) => {
      let messageRecord = state.NOTICE.getIn(['messageMap', msgId])
      let message = messageRecord.toJS()
      let msgTime = new Date(message.timestamp)
      message.timestamp = getConversationTime(msgTime.getTime())
      notifyList.push(message)
    })
  }
  return notifyList
}