/**
 * Created by yangyang on 2017/1/6.
 */

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