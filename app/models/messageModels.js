/**
 * Created by yangyang on 2016/12/20.
 */
import {Map, List, Record} from 'immutable'

export const MsgClientRecord = Record({
  client: undefined,
}, 'MsgClientRecord')

export const MessageRecord = Record({
  id: undefined,
  from: undefined,
  status: undefined,
  type: undefined,
  text: undefined,
  contentURI: undefined,
  conversation: undefined,
  timestamp: undefined,
  attributes: Map(),
}, 'MessageRecord')