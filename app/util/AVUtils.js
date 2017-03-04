import {
  Platform,
  AppState,
} from 'react-native';
// import EventEmitter from 'eventemitter3';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import AV from 'leancloud-storage'
import PushNotification from '@zzzkk2009/react-native-leancloud-sdk'
import {store} from '../store/persistStore'
import * as Toast from '../components/common/Toast'
import {updateLocalDeviceToken} from '../action/pushAction'
import * as lcPush from '../api/leancloud/push'

// const EE = new EventEmitter()

/**
 * 推送初始化
 * @param options
 */
export function configurePush(options) {

  PushNotification.configure({
    
    leancloudAppId: options.appId,
    leancloudAppKey: options.appKey,
    
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function(data) {
      console.log( 'DATA:', data );

      //触发action更新本地状态树
      store.dispatch(updateLocalDeviceToken({deviceToken: data.token}))

      //监听应用状态变化
      AppState.addEventListener('change', _handleAppStateChange);

      _saveDeviceTokenToLeancloudAfterNotificationRegistration({deviceToken: data.token})

      //监听应用程序用户信息变化
      // let context = {
      //   deviceToken: data.token
      // }
      // EE.on('pushUserInfoChange', _handlePushUserInfoChange, context)

      // PushNotification.localNotificationSchedule({
      //   date: new Date(Date.now() + (10 * 1000)), // in 10 secs,
      //   message: 'your deviceToken is: ' + data.token,
      //   userInfo: {
      //     userId: "1",
      //     userName: 'abc'
      //   }
      // })
      // EE.emit('pushUserInfoChange',{userId: ''});

      //TODO:test
      // updateDeviceUserInfo({
      //   deviceToken: data.token,
      //   userId: '584be311ac502e006c679375',
      // })

      //TODO test push: tested, please comment it.
      // var query = new AV.Query('_Installation');
      // // var query = new AV.Query('DeviceUserInfo');
      // // query.equalTo('owner', AV.Object.createWithoutData('_User', '584be311ac502e006c679375'));
      // query.equalTo('installationId', data.token);
      // // query.equalTo('deviceToken', data.token);
      // let pushData = {
      //   alert: '您有新的订单,请及时处理',
      //   title: '邻家优店发来的通知',//android only
      //   //ios系统收到消息通知后,如果该应用正在前台,则系统不会显示通知
      //   //可以通过定时消息,延后发送,然后退出app,即可收到消息
      //   //Android在RNLeanCloudPushReceiver类handleRemotePushNotification方法进行控制
      //   // push_time: new Date(Date.now() + (10 * 1000)),
      //   sceneName: 'MESSAGE_BOX',
      //   badge: 30,
      //   sceneParams: {
      //     userId: 1,
      //     userName: 'zachary'
      //   }
      // }
      // push(pushData, query)

      //TODO: test
      // let userList = []
      // userList = ['58ab9bbb8d6d810058bc81a8', '584be311ac502e006c679375']
      // // userList = ['58ab9bbb8d6d810058bc81a8']
      // // userList = ['584be311ac502e006c679375']
      // let pushData = {
      //   alert: '您有新的订单,请及时处理123',
      //   title: '邻家优店发来的通知',//android only
      //   //ios系统收到消息通知后,如果该应用正在前台,则系统不会显示通知
      //   //可以通过定时消息,延后发送,然后退出app,即可收到消息
      //   //Android在RNLeanCloudPushReceiver类handleRemotePushNotification方法进行控制
      //   // push_time: new Date(Date.now() + (10 * 1000)),
      //   sceneName: 'MESSAGE_BOX',
      //   sceneParams: {
      //     userId: 1,
      //     userName: 'zachary'
      //   }
      // }
      // let deviceTokens = []
      // deviceTokens = ['4f8596625def721d7ffab5a7368c92a7']
      // pushByUserList(userList, pushData)
      // // pushByDeviceTokens(deviceTokens, pushData)

      
    },
    
    // (required) Called when a remote or local notification is opened or received
    onNotification: function(notification) {
      console.log( 'NOTIFICATION:', notification );
      // EE.emit('pushUserInfoChange',{userId: ''});
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

/**
 * 根据用户推送
 * @param pushData
 *  alert: 通知内容(android & ios)
 *  title: 通知标题(android only)
 *  sceneName: 点击通知跳转的Action名称
 *  sceneParams: 点击通知跳转指定Action传递的参数对象
 *  prod: 指定发送iOS推送时,使用哪个环境下的证书(ios only)
 *  push_time: 定时推送时间;exp: new Date(Date.now() + (10 * 1000))  10秒后发送
 *  expiration_time: 推送过期时间
 *  expiration_interval: 从当前时间开始,多少秒之后过期
 * @param userList
 *  要推送的用户
 */
export function pushByUserList(userList = [], pushData = {}) {
  if(userList.length) {
    buildPushQueryByUserList(userList).then((pushQuery)=>{
      if(pushQuery) {
        push(pushData, pushQuery)
      }
    })
  }
}

/**
 * 根据设备推送
 * @param pushData
 *  alert: 通知内容(android & ios)
 *  title: 通知标题(android only)
 *  sceneName: 点击通知跳转的Action名称
 *  sceneParams: 点击通知跳转指定Action传递的参数对象
 *  prod: 指定发送iOS推送时,使用哪个环境下的证书(ios only)
 *  push_time: 定时推送时间;exp: new Date(Date.now() + (10 * 1000))  10秒后发送
 *  expiration_time: 推送过期时间
 *  expiration_interval: 从当前时间开始,多少秒之后过期
 * @param deviceTokens
 *  要推送的设备
 */
export function pushByDeviceTokens(deviceTokens = [], pushData = {}) {
  if(deviceTokens.length) {
    let pushQuery = buildPushQuery(deviceTokens)
    if(pushQuery) {
      push(pushData, pushQuery)
    }
  }
}

/**
 * 根据用户列表构建推送的查询条件
 * @param userList
 * @returns {*}
 */
function buildPushQueryByUserList(userList = []) {
  return queryDeviceTokens(userList).then((tokenList)=>{
    // console.log('buildPushQueryByUserList.tokenList===', tokenList)
    if(tokenList && tokenList.length) {
      let pushTokens = []
      tokenList.forEach((item)=>{
        if ( Platform.OS === 'android' ) {
          pushTokens.push(item.installationId)
        }else {
          pushTokens.push(item.deviceToken)
        }
      })
      return buildPushQuery(pushTokens)
    }
    return null
  }, function (error) {
    throw error
  })
}

function buildPushQuery(pushTokens = []) {
  var query = new AV.Query('_Installation')
  if(pushTokens.length) {
    if ( Platform.OS === 'android' ) {
      query.containedIn('installationId', pushTokens)
    }else {
      query.containedIn('deviceToken', pushTokens)
    }
    return query
  }
  return null
}

/**
 * 根据用户查询设备列表
 * @param userList
 * @returns {*}
 */
function queryDeviceTokens(userList = []) {
  let userListObj = []
  userList.forEach((item)=>{
    userListObj.push(AV.Object.createWithoutData('_User', item))
  })
  var query = new AV.Query('DeviceUserInfo')
  query.containedIn('owner', userListObj)

  return query.find().then(function (results) {
    // console.log('queryDeviceTokens.results===', results)
    var tokenList = results.map(function (item) {
      return {
        deviceType:item.get('deviceType'),
        deviceToken:item.get('deviceToken'),
        installationId:item.get('installationId')
      }
    })
    // console.log('queryDeviceTokens.tokenList===', tokenList)
    return tokenList
  }, function (error) {
    throw error
  })
}

/**
 * 更新用户设备关联信息
 * installationId:android设备id
 * deviceToken:ios设备id
 * userId:用户id
 * removeUser: 是否删除设备对应的用户
 * @param payload
 */
export function updateDeviceUserInfo(payload = {}) {
  if ( Platform.OS === 'android' ) {
    payload.installationId = payload.deviceToken
    payload.deviceToken = ''
    payload.deviceType = 'android'
  }else {
    payload.deviceType = 'ios'
  }
  return lcPush.updateDeviceUserInfo(payload)
}

/**
 * 设备注册成功后,保存设备id到_Installation表
 * @param payload
 * @private
 */
function _saveDeviceTokenToLeancloudAfterNotificationRegistration(payload = {}) {
  var Installation = require('./leancloudInstallation')(AV);
  if ( Platform.OS === 'android' ) {
    payload.installationId = payload.deviceToken
    payload.deviceToken = ''
  }
  Installation.getCurrent()
    .then(installation => {
      console.log('Current installaton got: ' + JSON.stringify(installation.toJSON()));
      console.log('Update deviceToken info and save.');
      return installation.save(payload);
    })
}

/**
 * 清空应用图标消息数目
 * android没有统一的api设置badge number,因此暂不支持android应用的badge显示和清空功能
 * @param nextAppState
 * @private
 */
function _handleAppStateChange(nextAppState) {
  // console.log('_handleAppStateChange.nextAppState=', nextAppState)
  // console.log('_handleAppStateChange.AppState.currentState=', AppState.currentState)
  if(AppState.currentState) {
    if (AppState.currentState.match(/inactive|background/)
      && nextAppState === 'active') {
      // console.log('App has come to the foreground!')
      PushNotification.setApplicationIconBadgeNumber(0)
    }
  }
}


/**
 * 推送
 * @param data
 *  alert: 通知内容(android & ios)
 *  title: 通知标题(android only)
 *  badge: 应用图标消息数量(ios only)
 *  sceneName: 点击通知跳转的Action名称
 *  sceneParams: 点击通知跳转指定Action传递的参数对象
 *  prod: 指定发送iOS推送时,使用哪个环境下的证书(ios only)
 *  push_time: 定时推送时间;exp: new Date(Date.now() + (10 * 1000))  10秒后发送
 *  expiration_time: 推送过期时间
 *  expiration_interval: 从当前时间开始,多少秒之后过期
 * @param query
 *  自定义查询条件
 */
export function push(data, query) {
  let defaultData = {
    alert: '通知',
    title: '邻家优店',
    prod: 'dev'
  }

  let actionData = {}
  if ( Platform.OS === 'android' ) {
    actionData = {
      action: 'com.zachary.leancloud.push.action', //自定义推送,不需要设置频道
    }
  }

  Object.assign(defaultData, data, actionData)

  let sendData = {
    prod: defaultData.prod || 'dev', //iOS 设备可以通过 prod 属性指定使用测试环境还是生产环境证书.dev 表示开发证书，prod 表示生产证书，默认生产证书。
    data: defaultData
  }
  query && (sendData.where = query)

  //推送时间
  if(Object.prototype.toString.call(data.push_time) === '[object Date]') {
    sendData.push_time = data.push_time
  }

  //推送过期时间
  if(Object.prototype.toString.call(data.expiration_time) === '[object Date]') {
    sendData.expiration_time = data.expiration_time
  }

  //从当前时间开始,多少秒之后过期
  if(Object.prototype.toString.call(data.expiration_interval) === '[object Number]') {
    sendData.expiration_interval = data.expiration_interval
  }

  console.log('push sendData=====', sendData)
  AV.Push.send(sendData);
}
