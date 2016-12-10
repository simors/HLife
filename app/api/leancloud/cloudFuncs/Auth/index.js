/**
 * Created by wuxingyu on 2016/12/10.
 */
import AV from 'leancloud-storage'

export function modifyMobilePhoneVerified(payload) {
    return AV.Cloud.run('hLifeModifyMobilePhoneVerified', payload).then((result)=>{
      return result
    }, (err) => {
      throw err
    })
  }