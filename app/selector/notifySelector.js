/**
 * Created by yangyang on 2017/1/6.
 */

export function hasNewNotice(state) {
  const unReadCnt = state.NOTICE.get('unReadCount')
  return unReadCnt > 0 ? true : false
}