/**
 * Created by zachary on 2017/3/3.
 */

export function selectDeviceToken(state) {
  return state.PUSH.deviceToken
}

export function selectSystemNoticeList(state) {
  if(state.PUSH.systemNoticeList && state.PUSH.systemNoticeList.size) {
    return state.PUSH.systemNoticeList.toJS()
  }
  return []
}

