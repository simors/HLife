/**
 * Created by zachary on 2016/12/10.
 */
import AV from 'leancloud-storage'

export function test(payload) {
  return (dispatch, getState) => {
    //console.log('test cloud func')
    return AV.Cloud.run('test', payload).then((result)=>{
      return result
    }, (err) => {
      //console.log('err=', err)
      throw err
    })
  }
}