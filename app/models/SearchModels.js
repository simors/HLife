/**
 * Created by wanpeng on 2017/5/12.
 */
import {Map, List, Record} from 'immutable'


export const Search = Record({
  user: Map(),
  shop: Map(),
  topic: Map()
}, 'Search')