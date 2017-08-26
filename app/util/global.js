import Sound from 'react-native-sound'
import * as LC_CONFIG from '../../app/constants/appConfig'

function initSounc() {
	// Load the sound file 'whoosh.mp3' from the app bundle
  // See notes below about preloading sounds within initialization code below.
  var sound = new Sound('twitter.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    } 
    // loaded successfully
    console.log('duration in seconds: ' + sound.getDuration() + 'number of channels: ' + sound.getNumberOfChannels());
  });

  return sound
}

global.messageSound = initSounc()
global.isSounding = false
global.chatMessageSoundOpen = true //聊天消息开关
global.pushMessageSoundOpen = true //通知消息开关

export const ENV = 'pre' //dev 开发环境；pre 预上线环境；pro 生产环境

const KM_Dev = {
  appId: LC_CONFIG.LC_DEV_APP_ID,
  appKey: LC_CONFIG.LC_DEV_APP_KEY,
}

const KM_ENV = {
  appId: ENV == 'pro'? LC_CONFIG.LC_PRO_APP_ID : LC_CONFIG.LC_STAGE_APP_ID,
  appKey: ENV == 'pro'? LC_CONFIG.LC_PRO_APP_KEY : LC_CONFIG.LC_STAGE_APP_KEY,
}

export const KM_FIN = __DEV__ ? KM_ENV : KM_ENV

export const DEFAULT_SHARE_DOMAIN = KM_FIN.appId === LC_CONFIG.LC_DEV_APP_ID ?
  'http://hlyd-dev.leanapp.cn/' : KM_FIN.appId === LC_CONFIG.LC_STAGE_APP_ID ?
  'http://hlyd-pre.leanapp.cn/' : 'http://share.xiaojee.cn/'