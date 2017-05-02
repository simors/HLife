/**
 * Created by yangyang on 2016/12/1.
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  AppState,
  BackAndroid,
  ToastAndroid,
  StatusBar,
  NetInfo,
} from 'react-native';
import {Provider, connect} from 'react-redux'
import {Router, Actions} from 'react-native-router-flux'
import {persistor, store} from './app/store/persistStore'
import {scenes} from './app/scenes/scenes'
import AV from 'leancloud-storage'
import * as LC_CONFIG from './app/constants/appConfig'
import * as AVUtils from './app/util/AVUtils'
import {handleAppStateChange} from './app/util/AppStateUtils'
import CodePush from "react-native-code-push"
import Popup from '@zzzkk2009/react-native-popup'
import THEME from './app/constants/themes/theme1'

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


 class HLifeEntry extends Component {
  constructor(props) {
    super(props)
    this.state = { restartAllowed: true };

  }

   componentWillMount(){

     CodePush.disallowRestart();//页面加载的禁止重启，在加载完了可以允许重启

   }

  componentDidMount() {
    console.disableYellowBox = true

    AppState.addEventListener('change', handleAppStateChange);
    NetInfo.addEventListener('change', this._handleConnectionInfoChange);
    // 通知初始化
    AVUtils.configurePush(
      __DEV__ ? KM_Dev : KM_PRO
    )

    AVUtils.appInit()
    CodePush.allowRestart();//在加载完了可以允许重启
    CodePush.notifyApplicationReady()
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', handleAppStateChange);
    NetInfo.removeEventListener('change', this._handleConnectionInfoChange);
  }

  onBackAndroid = () => {
   if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
     return false;
   }
   this.lastBackPressed = Date.now();
   ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
   return true;
  }

   _handleConnectionInfoChange = (connectionInfo) => {
     console.log('connection:', connectionInfo)
     let connectStatus = true
     if (Platform.OS == 'ios') {
       if (connectionInfo == 'none' || connectionInfo == 'unknown') {
         connectStatus = false
       }
     } else {
       if (connectionInfo == 'NONE' || connectionInfo == 'UNKNOWN') {
         connectStatus = false
       }
     }
     if (!connectStatus) {
       Popup.confirm({
         title: '系统提示',
         content: '无法访问网络，请确认网络已连接！',
         ok: {
           text: '确定',
           style: {color: THEME.base.mainColor},
           callback: ()=> {
           }
         },
       })
     }
   }

  render() {
    if (Platform.OS == 'android') {
      StatusBar.setTranslucent(true)
      StatusBar.setBackgroundColor('transparent', true)
    }
    StatusBar.setBarStyle('light-content', true)
    return (
      <Provider store={store}>
        <View style={{flex: 1}}>
          <RouterWithRedux scenes={scenes} store={store} sceneStyle={getSceneStyle} onExitApp={this.onBackAndroid}/>
        </View>
      </Provider>
    )
  }
}
const codepushOption={
  
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

export default HLifeEntry = CodePush({ checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME, installMode: CodePush.InstallMode.ON_NEXT_RESUME })(HLifeEntry);