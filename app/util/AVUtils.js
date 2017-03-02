import AV from 'leancloud-storage'

export function push(data, query) {
  let defaultData = {
    alert: '通知',
    title: '邻家优店',
    prod: 'dev'
  }
  const actionData = {
    action: 'com.zachary.leancloud.push.action', //自定义推送,不需要设置频道
  }
  Object.assign(defaultData, data, actionData)

  let sendData = {
    prod: defaultData.prod || 'dev', //iOS 设备可以通过 prod 属性指定使用测试环境还是生产环境证书.dev 表示开发证书，prod 表示生产证书，默认生产证书。
    data: defaultData
  }
  query && (sendData.where = query)
  AV.Push.send(sendData);
}
