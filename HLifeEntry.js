/**
 * Created by yangyang on 2016/12/1.
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native';
import {Provider, connect} from 'react-redux'
import {Router, Actions} from 'react-native-router-flux'
import {persistor, store} from './app/store/persistStore'
import {scenes} from './app/scenes/scenes'
import AV from 'leancloud-storage'
import * as LC_CONFIG from './app/constants/appConfig'
import PushNotification from '@zzzkk2009/react-native-leancloud-sdk'
import * as Toast from './app/components/common/Toast'
import * as AVUtils from './app/util/AVUtils'

const RouterWithRedux = connect()(Router)

const KM_Dev = {
  appId: LC_CONFIG.LC_DEV_APP_ID,
  appKey: LC_CONFIG.LC_DEV_APP_KEY,
}

const KM_PRO = {
  appId: LC_CONFIG.LC_PRO_APP_ID,
  appKey: LC_CONFIG.LC_PRO_APP_KEY,
}

//AV.setProduction(false)
AV.init(
  __DEV__ ? KM_Dev : KM_PRO
)

export default class HLifeEntry extends Component {
  constructor(props) {
    super(props)
  }
  
  componentWillMount() {
    // const that = this
    PushNotification.configure({
    
      leancloudAppId: KM_Dev.appId,
      leancloudAppKey: KM_Dev.appKey,
    
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function(data) {
        console.log( 'DATA:', data );
        // that.setState({
        //   deviceToken: data.token
        // })

        //TODO test push: tested, please comment it.
        // var query = new AV.Query('_Installation');
        // query.equalTo('installationId', data.token);
        // let pushData = {
        //   alert: '您有新的订单,请及时处理',
        //   title: '邻家优店发来的通知',
        //   sceneName: 'MESSAGE_BOX',
        //   sceneParams: {
        //     userId: 1,
        //     userName: 'zachary'
        //   }
        // }
        // AVUtils.push(pushData, query)

      },
    
      // (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
        console.log( 'NOTIFICATION:', notification );
        if(notification.userInteraction) {
          //用户点击通知栏消息
          // Toast.show(notification.data.userInfo.userName)
          let data = notification.data
          console.log('DATA:', notification.data)
          if(data.sceneName) {
            Actions[data.sceneName](data.sceneParams)
          }
        }else {
          //程序接收到远程或本地通知

        }
      },
    
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },
    
      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,
    
      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       */
      requestPermissions: true,
    })
  }

  componentDidMount() {
    console.disableYellowBox = true
  }

  render() {
    return (
      <Provider store={store}>
        <View style={{flex: 1}}>
          <RouterWithRedux scenes={scenes} store={store} sceneStyle={getSceneStyle}/>
        </View>
      </Provider>
    )
  }
}

const getSceneStyle = (props, computedProps) => {
  const style = {
    flex: 1,
    backgroundColor: 'white',
    shadowColor: null,
    shadowOffset: null,
    shadowOpacity: null,
    shadowRadius: null,
  }
  if (computedProps.isActive) {
    style.marginTop = computedProps.hideNavBar ? 0 : 64
    style.marginBottom = computedProps.hideTabBar ? 0 : 50
  }
  return style
}