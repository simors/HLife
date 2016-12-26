/**
 * Created by yangyang on 2016/12/20.
 */
import  {Platform, CameraRoll} from 'react-native'
import {createAction} from 'redux-actions'
import AV from 'leancloud-storage'
import {TypedMessage, messageType, Realtime} from 'leancloud-realtime'
import {TypedMessagePlugin}from 'leancloud-realtime-plugin-typed-messages'
import * as LC_CONFIG from '../constants/appConfig'
import * as msgTypes from '../constants/messageActionTypes'
import {Conversation, Message} from '../models/messageModels'
import {activeUserId} from '../selector/authSelector'
import {messengerClient} from '../selector/messageSelector'

class TextMessage extends TypedMessage {
}
messageType(msgTypes.MSG_TEXT)(TextMessage)

class ImageMessage extends TypedMessage {
}
messageType(msgTypes.MSG_IMAGE)(ImageMessage)

class AudioMessage extends TypedMessage {
}
messageType(msgTypes.MSG_AUDIO)(AudioMessage)

class ReviewMessage extends TypedMessage {
}
messageType(msgTypes.MSG_REVIEW)(ReviewMessage)

class CommentMessage extends TypedMessage {
}
messageType(msgTypes.MSG_COMMENT)(CommentMessage)

class LikeMessage extends TypedMessage {
}
messageType(msgTypes.MSG_LIKE)(LikeMessage)

class HearsayMessage extends TypedMessage {
}
messageType(msgTypes.MSG_HEARSAY)(HearsayMessage)

//we should move this to the server to avoid reverse-engineering


const appId = __DEV__ ? LC_CONFIG.LC_DEV_APP_ID : LC_CONFIG.LC_PRO_APP_ID
const appKey = __DEV__ ? LC_CONFIG.LC_DEV_APP_KEY : LC_CONFIG.LC_PRO_APP_KEY

const realtime = new Realtime({
  appId: appId,
  appKey: appKey,
  region: 'cn',
  noBinary: true,
  pushOfflineMessages: true,
  plugins: [TypedMessagePlugin],
})
realtime.register(TextMessage)
realtime.register(ImageMessage)
realtime.register(AudioMessage)
realtime.register(ReviewMessage)
realtime.register(CommentMessage)
realtime.register(LikeMessage)
realtime.register(HearsayMessage)

const initMessenger = createAction(msgTypes.INIT_MESSENGER_CLIENT)
const onCreateConversation = createAction(msgTypes.ON_CONVERSATION_CREATED)

export function initMessageClient(payload) {
  return (dispatch, getState) => {
    const userId = activeUserId(getState())

    if (!userId) {
      if (payload.error) {
        payload.error({message: '用户未登录'})
      }
    }
    let tag = 'web'
    if (Platform.OS == 'ios' || Platform.OS == 'android') {
      tag = 'mobile'
    }

    return dispatch(initLcMessenger({
      tag: tag,
      userId: userId,
    }))
  }
}

export function initLcMessenger(payload) {
  return (dispatch) => {
    realtime.createIMClient(payload.userId, {}, payload.tag).then((client) => {
      client.on('message', function (message, conversation) {
        dispatch(onReceiveMsg(message, conversation))
      })

      client.on('disconnect', function () {
        console.log('网络连接已断开');
      })
      client.on('schedule', function (attempt, delay) {
        console.log(delay + 'ms 后进行第' + (attempt + 1) + '次重连');
      })
      client.on('retry', function (attempt) {
        console.log('正在进行第' + attempt + '次重连');
      })
      client.on('reconnect', function () {
        console.log('网络连接已恢复');
      })

      dispatch(initMessenger({client: client}))
    }).catch((error) => {
      console.log(error)
    })
  }
}

export function createConversation(payload) {
  return (dispatch, getState) => {
    dispatch(createLcConversation(payload)).then((conversation) => {
      dispatch(onCreateConversation(conversation))
      if (payload.success) {
        payload.success({meesage: '创建对话成功'})
      }
    }).catch((error) => {
      console.log('failed to create conversation: ', error)
    })
  }
}

export function sendMessage(payload) {
  return (dispatch, getState) => {

    let attributes = {}
    if (payload.type == msgTypes.MSG_IMAGE) {
      attributes['localUri'] = payload.uri
    } else if (payload.type == msgTypes.MSG_AUDIO) {
      attributes['localUri'] = payload.uri
      attributes['duration'] = payload.duration
    }

    let msg = new Message({
      id: payload.msgId,
      from: activeUserId(getState()),
      type: payload.type,
      text: payload.text,
      conversation: payload.conversationId,
      status: 'created',
      attributes: Map(attributes)
    })

    dispatch(sendLcTypedMessage(payload))
  }
}

function createLcConversation(payload) {
  return (dispatch, getState) => {
    let client = messengerClient(getState())
    if (!client) {
      if (payload.error) {
        payload.error()
      }
      console.log('leancloud Messenger init failed, can\'t get client')
    }
    return client.createConversation({
      members: payload.members,
      name: payload.name,
      unique: true,
    }).then((conversation) => {
      return Conversation.fromLeancloudConversation(conversation)
    })
  }
}

function sendLcTypedMessage(payload) {
  return (dispatch, getState) => {
    let client = messengerClient(getState())
    if (!client) {
      if (payload.error) {
        payload.error()
      }
      console.log('leancloud Messenger init failed, can\'t get client')
    }

    return client.getConversation(payload.conversationId).then((conversation)=> {
      switch (payload.type) {
        case msgTypes.MSG_IMAGE:
          return sendImageMessage(conversation, payload)

        case msgTypes.MSG_AUDIO:
          return sendAudioMessage(conversation, payload)

        case msgTypes.MSG_TEXT:
        default:
          return sendTextMessage(conversation, payload)
      }
    })
  }
}

function onReceiveMsg(message, conversation) {
  return (dispatch, getState) => {
    console.log("receive message:", message)
    console.log("in conversation: ", conversation)
  }
}

function sendTextMessage(conversation, payload) {
  let message = new TextMessage()
  message.setText(payload.text)
  return conversation.send(message).then((message)=> {
    return Message.fromLeancloudMessage(message, payload)
  })
}

function sendImageMessage(conversation, payload) {
  let message = new ImageMessage()
  message.setText(payload.text)
  let file = new AV.File(payload.fileName, {blob: {uri: payload.uri}})
  return file.save().then((savedFile)=> {
    message.setAttributes({
      'mediaId': savedFile.attributes.url
    })
    return conversation.send(message)
  }).then((message)=> {
    return Message.fromLeancloudMessage(message, payload)
  })
}

function sendAudioMessage(conversation, payload) {
  let message = new AudioMessage()
  message.setText(payload.text)
  let file = new AV.File(payload.fileName, {blob: {uri: payload.uri}})
  return file.save().then((savedFile)=> {
    message.setAttributes({
      'mediaId': savedFile.attributes.url,
      'duration': payload.duration
    })
    return conversation.send(message)
  }).then((message)=> {
    return Message.fromLeancloudMessage(message, payload)
  })
}