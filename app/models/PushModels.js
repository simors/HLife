/**
 * Created by zachary on 2017/3/3.
 */
import {Map, List, Record} from 'immutable'

export const SystemNoticeRecord = Record({
  message_abstract: '',
  message_title: '',
  message_url: '',
  message_cover_url: '',
  notice_time: '',
  timestamp: '',
  hasReaded: false
}, 'SystemNoticeRecord')

export class SystemNotice extends SystemNoticeRecord {
  static fromPlainObj(obj) {
    let sysNotice = new SystemNotice()

    return sysNotice.withMutations((record)=>{
      for(let key in obj) {
        record.set(key, obj[key])
      }
    })
  }
}

export const Push = Record({
  deviceToken: undefined,
  systemNoticeList: List()
}, 'Push')



