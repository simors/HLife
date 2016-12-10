/**
 * Created by zachary on 2016/12/10.
 */
import * as cfTest from '../test'
import * as Toast from '../../../../components/common/Toast'

function demoMethod(payload) {
  return (dispatch, getState) => {
    dispatch(cfTest.test(payload)).then((result)=>{
      console.log('test cloud func success=', result)
      Toast.show(result)
    }, (err) => {
      console.log('err1=', err)
      throw err
    })
  }
}
