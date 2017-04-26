import Sound from 'react-native-sound'

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