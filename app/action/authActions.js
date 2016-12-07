
import {createAction} from 'redux-actions'
import * as authTypes from '../constants/authActionTypes'
import * as toastActions from './toastActions'
import {getInputFormData, isInputFormValid} from '../selector/inputFormSelector'
import * as dbOpers from '../api/leancloud/databaseOprs'
import * as auth from '../api/leancloud/auth'

export const INPUT_FORM_SUBMIT_TYPE = {
  REGISTER: 'REGISTER',
  LOGIN_WITH_SMS: 'LOGIN_WITH_SMS',
  LOGIN_WITH_PWD: 'LOGIN_WITH_PWD',
  FORGET_PASSWORD: 'FORGET_PASSWORD',
  MODIFY_PASSWORD: 'MODIFY_PASSWORD'
}

export function submitFormData(payload) {
  return (dispatch, getState) => {
  	const formData = getInputFormData(getState(), payload.formKey)
  	console.log('formData=', formData)
		switch (payload.submitType) {
			case INPUT_FORM_SUBMIT_TYPE.REGISTER:
        dispatch(handleRegister(payload, formData))
        break
      case INPUT_FORM_SUBMIT_TYPE.LOGIN_WITH_PWD:
        dispatch(handleLoginWithPwd(payload, formData))
        break  
		}
  }
}

function handleLoginWithPwd(payload, formData) {
  return (dispatch, getState) => {
    let loginPayload = {
      phone: formData.phoneInput.text,
      password: formData.passwordInput.text,
    }
    console.log('loginPayload=', loginPayload)
    auth.loginWithPwd(loginPayload).then((userInfos) => {
    	console.log('userInfos=', userInfos)
    	dispatch(toastActions.showToast({text: '登录成功'}))
      // let loginAction = createAction(authTypes.LOGIN_SUCCESS)
      // dispatch(loginAction({...userInfos}))
      // dispatch(initMessenger())
      // dispatch(getUserPermissions())
      // dispatch(updateDeviceTokenAfterLogin({userId: userInfos.userInfo.id}))
      // Actions.popTo('root')
    }).catch((error) => {
      console.log('login error is', error)
      dispatch(showToast({text: error.message}))
    })
  }
}


function handleRegister(payload, formData) {
  return (dispatch, getState) => {
  	dispatch(registerWithPhoneNum(formData))
    // var query = dbOpers.createQuery('_User')
    // query.equalTo('mobilePhoneNumber', formData.phoneInput.text)
    // dbOpers.retrieveObj(query).then((result)=> {
    //   return result.length === 0 ? false : true
    // }).then((isRegistered)=> {
    // 	console.log('isRegistered=', isRegistered)
    // 	dispatch(registerWithPhoneNum(formData))
    //   // if (isRegistered) {
    //   //   dispatch(showToast({text: "该号码已被注册"}))
    //   // } else {
    //   //   let verifyRegSmsPayload = {
    //   //     smsType: 'register',
    //   //     phone: formData.phone.text,
    //   //     randCode: formData.randCode.text,
    //   //   }
    //   //   verifySmsCode(verifyRegSmsPayload).then(() => {
    //   //     dispatch(registerWithPhoneNum(formData))
    //   //   }).catch((error) => {
    //   //     dispatch(showToast({text: "无效的短信验证码"}))
    //   //   })
    //   // }
    // }).catch((err)=> {
    //   console.log('error is ', err)
    // })
  }
}

function registerWithPhoneNum(formData) {
  return (dispatch, getState) => {
    let regPayload = {
      smsType: 'register',
      phone: formData.phoneInput.text,
      password: formData.passwordInput.text
    }
    auth.register(regPayload).then((user) => {
    	dispatch(toastActions.showToast({text: '注册成功'}))
      // let regAction = createAction(authTypes.REGISTER_SUCCESS)
      // dispatch(regAction(user))
      // Actions.SUPPLEMENT_INFO_VIEW()
    }).catch((error) => {
      dispatch(toastActions.showToast({text: error.message}))
      console.log('register using phone num failed:', error)
    })
  }
}
