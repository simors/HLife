/**
 * Created by lilu on 2017/7/4.
 */


import {hidePhoneNumberDetail, formatLeancloudTime, getConversationTime} from '../util/numberUtils'
import {Map, Record,List} from 'immutable'




export const NewTopics = Record({
  allComments : Map(),
  commentsForTopic : Map(),
  commentsForComment : Map(),
  myUpCommentList : List(),
}, 'NewTopic')
