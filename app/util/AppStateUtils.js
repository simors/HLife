/**
 * Created by yangyang on 2017/3/10.
 */
import {
  Platform,
  AppState,
} from 'react-native';
import {store} from '../store/persistStore'
import PushNotification from '@zzzkk2009/react-native-leancloud-sdk'
import {getCurrentLocation} from '../action/locAction'

/**
 * 清空应用图标消息数目
 * android没有统一的api设置badge number,因此暂不支持android应用的badge显示和清空功能
 * @param nextAppState
 * @private
 */
export function handleAppStateChange(nextAppState) {
  if(AppState.currentState) {
    if (nextAppState === 'active') {
      // 清空应用图标消息数目
      PushNotification.setApplicationIconBadgeNumber(0)
      // 获取地理位置
      store.dispatch(getCurrentLocation())
    }
  }
}