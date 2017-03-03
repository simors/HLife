import {
  Platform,
} from 'react-native';

import AV from 'leancloud-storage'

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
