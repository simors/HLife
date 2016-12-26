/**
 * Created by zachary on 2016/12/9.
 */

import {
  NativeModules,
  Platform
} from 'react-native'
import RNRestart from 'react-native-restart'

/**
 * Common
 */
const RnBridge = NativeModules.RnBridge

export function event(name) {
  CommonNative.event(name)
}

export function reload() {
  if (Platform.OS == 'ios') {
    RnBridge.reloadJs()
  } else {
    RNRestart.Restart()
  }
}