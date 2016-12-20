/**
 * Created by yangyang on 2016/12/20.
 */
import  {Platform, CameraRoll} from 'react-native'
import AV from 'leancloud-storage'
import {TypedMessage, messageType, Realtime} from 'leancloud-realtime'
import {TypedMessagePlugin}from 'leancloud-realtime-plugin-typed-messages'
import * as LC_CONFIG from '../../constants/appConfig'
import * as msgTypes from '../../constants/messageActionTypes'

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

export function initLeancloudClient(payload) {
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
  }).catch((error) => {
    console.log(error)
  })
}

function onReceiveMsg(message, conversation) {
  return (dispatch, getState) => {

  }
}