/**
 * Created by yangyang on 2016/12/20.
 */

// 会诊会话中默认加入的系统用户名
export const WUAI_SYSTEM_DOCTOR = 'wuaiSystemDocter'

// 会话的类型
export const INQUIRY_CONVERSATION = 'INQUIRY_CONVERSATION'      // 问诊
export const PERSONAL_CONVERSATION = 'PERSONAL_CONVERSATION'    // 私信

export const MSG_TEXT = -1
export const MSG_SYSTEM = 1
export const MSG_IMAGE = 2
export const MSG_AUDIO = 3

export const TOPIC_TYPE = 'TOPIC_TYPE'
export const SHOP_TYPE = 'SHOP_TYPE'
export const SYSTEM_TYPE = 'SYSTEM_TYPE'

export const MSG_ARTICLE_COMMENT  = 20      // 文章评论
export const MSG_TOPIC_COMMENT    = 21      // 话题评论
export const MSG_SHOP_COMMENT     = 22      // 店铺评论


export const MSG_ARTICLE_LIKE     = 30      // 文章点赞
export const MSG_TOPIC_LIKE       = 31      // 话题点赞
export const MSG_SHOP_LIKE        = 32      // 店铺点赞

export const MSG_USER_FOLLOW      = 40      // 关注用户
export const MSG_SHOP_FOLLOW      = 41      // 关注店铺

export const INIT_MESSENGER_CLIENT = 'INIT_MESSENGER_CLIENT'
export const INIT_CONVERSATION = 'INIT_CONVERSATION'
export const CLOSE_MESSENGER_CLIENT = 'CLOSE_MESSENGER_CLIENT'
export const ON_CONVERSATION_CREATED = 'ON_CONVERSATION_CREATED'
export const ON_ENTER_CONVERSATION = 'ON_ENTER_CONVERSATION'
export const ON_LEAVE_CONVERSATION = 'ON_LEAVE_CONVERSATION'
export const ON_MESSAGE_CREATED = 'ON_MESSAGE_CREATED'
export const ON_MESSAGE_SENTED = 'ON_MESSAGE_SENTED'
export const ON_MESSAGE_RECEIVED = 'ON_MESSAGE_RECEIVED'
export const ON_INIT_MESSAGES = 'ON_INIT_MESSAGES'

export const ADD_NOTIFY_MSG = 'ADD_NOTIFY_MSG'