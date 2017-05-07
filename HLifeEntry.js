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
import RNRestart from 'react-native-restart'
import Popup from '@zzzkk2009/react-native-popup'
import THEME from './app/constants/themes/theme1'
import {selectNetworkStatus} from './app/selector/configSelector'
import {updateNetworkStatus} from './app/action/configAction'
import {KM_FIN, ENV} from './app/util/global'

const RouterWithRedux = connect()(Router)

AV.setProduction(ENV == 'pro')

AV.init(
  KM_FIN
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
      KM_FIN
    )

    AVUtils.appInit()
    CodePush.allowRestart();//在加载完了可以允许重启
    // CodePush.notifyApplicationReady()
    CodePush.sync({installMode: CodePush.InstallMode.ON_NEXT_RESTART})
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
    let preStatus = selectNetworkStatus(store.getState())

    if (preStatus != undefined && AppState.currentState && AppState.currentState == 'active') {
      if (preStatus == true && !connectStatus) {
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
      // if (preStatus == false && connectStatus == true) {
      //   setTimeout(() => {
      //     RNRestart.Restart()
      //   }, 1000)
      // }
    }
    store.dispatch(updateNetworkStatus({networkStatus: connectStatus}))
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

export default HLifeEntry = CodePush({ checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME})(HLifeEntry);