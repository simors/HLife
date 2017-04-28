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
import {updateLocalDeviceToken, updateSystemNotice} from '../action/pushAction'
import {fetchShopPromotionMaxNum, fetchUserOwnedShopInfo} from '../action/shopAction'
import {fetchAllProvincesAndCities, fetchAppServicePhone} from '../action/configAction'
import * as lcPush from '../api/leancloud/push'
import Popup from '@zzzkk2009/react-native-popup'
import * as pushSelect from '../selector/pushSelector'
import * as configSelector from '../selector/configSelector'
import * as authSelector from '../selector/authSelector'
import * as dateUtils from '../util/dateUtils'
import './global'

// const EE = new EventEmitter()

export function switchTab(tabKey = 'MINE', tabParams = {}){
  Actions.HOME({type:'reset'})
  Actions[tabKey](tabParams)
}

this.isPoping = false
export function pop(payload) {
  if(this.isPoping) return

  this.isPoping = true  
  if(payload && payload.backSceneName) {
    Actions.pop({popNum:2})
    if(payload.timeout) {
      setTimeout(()=>{
        Actions[payload.backSceneName](payload.backSceneParams)
      }, payload.timeout || 10)
    }else {
      Actions[payload.backSceneName](payload.backSceneParams)
    }
  }else{
    Actions.pop()
  }
  setTimeout(()=>{
    this.isPoping = false
  }, 1000)
}

export function updateProvincesAndCities(payload) {
  store.dispatch(fetchAllProvincesAndCities(payload))
}

export function playMessageSound() {
  if(global.pushMessageSoundOpen) {
    if(!global.isSounding) {
      global.isSounding = true
      global.messageSound.play((success) => {
        global.isSounding = false
      })
    }
  }
}

export function appInit() {

  updateProvincesAndCities()

  store.dispatch(fetchAppServicePhone())
  
  if(authSelector.isUserLogined(store.getState())) {
    store.dispatch(fetchShopPromotionMaxNum())
    store.dispatch(fetchUserOwnedShopInfo())
  }
}

export function getPromoterLevelInfo(level) {

  if(level < 1 || level > 5) {
    return null
  }

  const levelName = ['青铜级', '白银级', '黄金级', '钻石级', '皇冠级']

  const levelMainIcon = [
    require('../assets/images/bronze_16.png'),
    require('../assets/images/silver_16.png'),
    require('../assets/images/gold_16.png'),
    require('../assets/images/diamond_16.png'),
    require('../assets/images/crown_16.png'),
  ]
  const levelMainReverseIcon = [
    require('../assets/images/bronze_20.png'),
    require('../assets/images/silver_20.png'),
    require('../assets/images/gold_20.png'),
    require('../assets/images/diamond_20.png'),
    require('../assets/images/crown_20.png'),
  ]

  return {
    levelName: levelName[level-1],
    levelMainIcon: levelMainIcon[level-1],
    levelMainReverseIcon: levelMainReverseIcon[level-1]
  }
}

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
      // console.log( 'NOTIFICATION:', notification );
      // EE.emit('pushUserInfoChange',{userId: ''});
      let data = notification.data

      if(data.notice_type == "SYSTEM_NOTICE"){
        let notice_time = dateUtils.getCurrentDate()
        store.dispatch(updateSystemNotice({
          message_abstract: data.message_abstract,
          message_title: data.message_title,
          message_url: data.message_url,
          message_cover_url: data.message_cover_url,
          notice_time: notice_time,
          timestamp: Date.now()
        }))
      }

      if(authSelector.isUserLogined(store.getState())) {
        if(notification.foreground) {//程序在前台
          if(!Popup.popup) {
            Popup.confirm({
              title: data.title || '邻家优店通知',
              content: data.alert || '',
              ok: {
                text: '查看',
                style: {color: '#FF7819'},
                callback: ()=>{
                  Popup.popup = null
                  // console.log('ok')
                  if(data.sceneName) {
                    Actions[data.sceneName](data.sceneParams)
                  }else{
                    Actions.MESSAGE_BOX()
                  }
                }
              },
              cancel: {
                text: '取消',
                callback: ()=>{
                  Popup.popup = null
                  // console.log('cancel')
                }
              }
            })
          }
          
        }else {//程序在后台
          if(notification.userInteraction) {//用户点击通知栏消息
            // Toast.show(notification.data.userInfo.userName)
            // console.log('DATA:', notification.data)

            if(data.sceneName) {
              Actions[data.sceneName](data.sceneParams)
            }else{
              Actions.MESSAGE_BOX()
            }
          }else {
            //程序接收到远程或本地通知

          }
        }

        playMessageSound()
        
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
  // pushData.push_time = new Date(Date.now() + (10 * 1000))
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
    if(Object.prototype.toString.call(item) === '[object String]') {
      userListObj.push(AV.Object.createWithoutData('_User', item))
    }else if(Object.prototype.toString.call(item) === '[object Object]'){
      userListObj.push(item)
    }
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
 * (deprecated): installationId:android设备id
 * (deprecated): deviceToken:ios设备id
 * userId:用户id
 * removeUser: 是否删除设备对应的用户
 * @param payload
 */
export function updateDeviceUserInfo(payload = {}) {
  return new Promise((resolve, reject)=>{
    // console.log('updateDeviceUserInfo.payload===', payload)
    // console.log('updateDeviceUserInfo.store.state===', store.getState())
    let deviceToken = pushSelect.selectDeviceToken(store.getState())
    // console.log('updateDeviceUserInfo.deviceToken===', deviceToken)
    if(deviceToken) {
      if ( Platform.OS === 'android' ) {
        payload.installationId = deviceToken
        payload.deviceType = 'android'
      }else {
        payload.deviceToken = deviceToken
        payload.deviceType = 'ios'
      }
      lcPush.updateDeviceUserInfo(payload).then(()=>{
        resolve({
          code: 1,
          message: 'success'
        })
      },()=>{
        resolve({
          code:-1,
          message: 'fail'
        })
      })
    }else {
      resolve({
        code:-2,
        message: 'error'
      })
    }
  })
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
    prod: 'dev',
    sceneName: 'MESSAGE_BOX',
    sceneParams: {}
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
