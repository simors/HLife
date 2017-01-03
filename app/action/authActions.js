import {createAction} from 'redux-actions'
import {Actions} from 'react-native-router-flux'
import * as AuthTypes from '../constants/authActionTypes'
import * as uiTypes from '../constants/uiActionTypes'
import {getInputFormData, isInputFormValid, getInputData, isInputValid} from '../selector/inputFormSelector'
import * as dbOpers from '../api/leancloud/databaseOprs'
import * as lcAuth from '../api/leancloud/auth'
import {initMessageClient} from '../action/messageAction'
import {UserInfo} from '../models/userModels'

export const INPUT_FORM_SUBMIT_TYPE = {
  REGISTER: 'REGISTER',
  GET_SMS_CODE: 'GET_SMS_CODE',
  RESET_PWD_SMS_CODE: 'RESET_PWD_SMS_CODE',
  LOGIN_WITH_SMS: 'LOGIN_WITH_SMS',
  LOGIN_WITH_PWD: 'LOGIN_WITH_PWD',
  FORGET_PASSWORD: 'FORGET_PASSWORD',
  MODIFY_PASSWORD: 'MODIFY_PASSWORD',
  DOCTOR_CERTIFICATION: 'DOCTOR_CERTIFICATION',
  PROFILE_SUBMIT: 'PROFILE_SUBMIT',
  SHOP_CERTIFICATION: 'SHOP_CERTIFICATION',
  INQUIRY_SUBMIT: 'INQUIRY_SUBMIT',
}

export function submitFormData(payload) {
  return (dispatch, getState) => {
    let formCheck = createAction(uiTypes.INPUTFORM_VALID_CHECK)
    dispatch(formCheck({formKey: payload.formKey}))
    let isFormValid = isInputFormValid(getState(), payload.formKey)
    if (!isFormValid.isValid) {
      if (payload.error) {
        payload.error({message: isFormValid.errMsg})
      }
      return
    }
    const formData = getInputFormData(getState(), payload.formKey)
    switch (payload.submitType) {
      case INPUT_FORM_SUBMIT_TYPE.REGISTER:
        dispatch(handleRegister(payload, formData))
        break
      case INPUT_FORM_SUBMIT_TYPE.LOGIN_WITH_PWD:
        dispatch(handleLoginWithPwd(payload, formData))
        break
      case INPUT_FORM_SUBMIT_TYPE.MODIFY_PASSWORD:
        dispatch(handleResetPwdSmsCode(payload, formData))
        break
      case INPUT_FORM_SUBMIT_TYPE.DOCTOR_CERTIFICATION:
        dispatch(handleDoctorCertification(payload, formData))
        break
      case INPUT_FORM_SUBMIT_TYPE.PROFILE_SUBMIT:
        dispatch(handleProfileSubmit(payload, formData))
        break
      case INPUT_FORM_SUBMIT_TYPE.SHOP_CERTIFICATION:
        dispatch(handleShopCertification(payload, formData))
        break
      case INPUT_FORM_SUBMIT_TYPE.INQUIRY_SUBMIT:
        dispatch(handleInquirySubmit(payload, formData))
        break
    }
  }
}

export function submitInputData(payload) {
  return (dispatch, getState) => {
    let formCheck = createAction(uiTypes.INPUTFORM_VALID_CHECK)
    dispatch(formCheck({formKey: payload.formKey}))
    let isValid = isInputValid(getState(), payload.formKey, payload.stateKey)
    if (!isValid.isValid) {
      if (payload.error) {
        payload.error({message: isValid.errMsg})
      }
      return
    }

    const data = getInputData(getState(), payload.formKey, payload.stateKey)
    switch (payload.submitType) {
      case INPUT_FORM_SUBMIT_TYPE.GET_SMS_CODE:
        dispatch(handleGetSmsCode(payload, data))
        break
      case INPUT_FORM_SUBMIT_TYPE.RESET_PWD_SMS_CODE:
        dispatch(handleRequestResetPwdSmsCode(payload, data))
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
    lcAuth.loginWithPwd(loginPayload).then((userInfo) => {
      if (payload.success) {
        payload.success(userInfo)
      }
      let loginAction = createAction(AuthTypes.LOGIN_SUCCESS)
      dispatch(loginAction({...userInfo}))
      dispatch(initMessageClient(payload))
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}

function handleGetSmsCode(payload, data) {
  return (dispatch, getState) => {
    let getSmsPayload = {
      phone: data.text,
    }
    lcAuth.requestSmsAuthCode(getSmsPayload).then(() => {
      if (payload.success) {
        let succeedAction = createAction(AuthTypes.GET_SMS_CODE_SUCCESS)
        dispatch(succeedAction({stateKey: payload.stateKey}))
        payload.success()
      }
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}

function handleRegister(payload, formData) {
  return (dispatch, getState) => {
    let verifyRegSmsPayload = {
      smsType: 'register',
      phone: formData.phoneInput.text,
      smsAuthCode: formData.smsAuthCodeInput.text,
    }
    if (__DEV__) {// in android and ios simulator ,__DEV__ is true
      dispatch(registerWithPhoneNum(payload, formData))
    } else {
      lcAuth.verifySmsCode(verifyRegSmsPayload).then(() => {
        dispatch(registerWithPhoneNum(payload, formData))
      }).catch((error) => {
        if (payload.error) {
          payload.error(error)
        }
      })
    }
  }
}

function registerWithPhoneNum(payload, formData) {
  return (dispatch, getState) => {
    let regPayload = {
      smsType: 'register',
      phone: formData.phoneInput.text,
      password: formData.passwordInput.text
    }
    lcAuth.register(regPayload).then((user) => {
      if (payload.success) {
        let regAction = createAction(AuthTypes.REGISTER_SUCCESS)
        dispatch(regAction(user))
        payload.success(user)
      }
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}

function handleRequestResetPwdSmsCode(payload, data) {
  return (dispatch, getState) => {
    let getSmsPayload = {
      phone: data.text,
    }
    lcAuth.requestResetPwdSmsCode(getSmsPayload).then(() => {
      let succeedAction = createAction(AuthTypes.GET_SMS_CODE_SUCCESS)
      dispatch(succeedAction({stateKey: payload.stateKey}))
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}

function handleResetPwdSmsCode(payload, formData) {
  return (dispatch, getState) => {
    let resetPwdPayload = {
      password: formData.passwordInput.text,
      smsAuthCode: formData.smsAuthCodeInput.text,
    }
    lcAuth.resetPwdBySmsCode(resetPwdPayload).then(() => {
      if (payload.success) {
        let regAction = createAction(AuthTypes.FORGOT_PASSWORD_SUCCESS)
        dispatch(regAction())
        payload.success()
      }
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}

function handleDoctorCertification(payload, formData) {
  console.log("handleDoctorCertification start", formData)
  return (dispatch, getState) => {
    let smsPayload = {
      phone: formData.phoneInput.text,
      smsAuthCode: formData.smsAuthCodeInput.text,
    }

    // lcAuth.verifySmsCode(smsPayload).then(() => {
    //   dispatch(doctorCertification(payload, formData))
    // }).catch((error) => {
    //   if(payload.error){
    //     payload.error(error)
    //   }
    // })
    dispatch(doctorCertification(payload, formData))
  }

}

function doctorCertification(payload, formData) {
  console.log("doctorCertification", formData)
  return (dispatch, getState) => {
    let certPayload = {
      id: payload.id,
      name: formData.nameInput.text,
      ID: formData.IDInput.text,
      phone: formData.phoneInput.text,
      organization: formData.regionPicker.text,
      department: formData.medicalPicker.text,
      certifiedImage: formData.idImageInput.text,
      certificate: formData.imgGroup.text,
    }
    lcAuth.certification(certPayload).then((doctor) => {
      if (payload.success) {
        // console.log("doctorCertification doctor", doctor)
        // let cartificationAction = createAction(AuthTypes.DOCTOR_CERTIFICATION_REQUEST)
        // dispatch(cartificationAction(doctor))
        payload.success(doctor)
      }
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }

}

function handleProfileSubmit(payload, formData) {
  return (dispatch, getState) => {
    console.log('handleProfileSubmit=', formData)
    let profilePayload = {
      id: payload.id,
      nickname: formData.nicknameInput.text,
      avatar: formData.avatarInput.text,
      phone: formData.phoneInput.text,
      birthday: formData.dtPicker.text,
      gender: formData.genderInput.text,
    }
    lcAuth.profileSubmit(profilePayload).then((profile) => {
      if (payload.success) {
        payload.success()
      }
      console.log("profileSubmit return profile", profile)
      let profileAction = createAction(AuthTypes.PROFILE_SUBMIT_SUCCESS)
      dispatch(profileAction({...profile}))
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}

function handleShopCertification(payload, formData) {
  return (dispatch, getState) => {
    let smsPayload = {
      phone: formData.phoneInput.text,
      smsAuthCode: formData.smsAuthCodeInput.text,
    }
    lcAuth.verifySmsCode(smsPayload).then(() => {
      dispatch(verifyInvitationCode(payload, formData))
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}

function verifyInvitationCode(payload, formData) {
  return (dispatch, getState) => {
    lcAuth.verifyInvitationCode({invitationsCode: formData.invitationCodeInput.text}).then(()=> {
      dispatch(shopCertification(payload, formData))
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }

}

function shopCertification(payload, formData) {
  return (dispatch, getState) => {
    let certPayload = {
      name: formData.nameInput.text,
      phone: formData.phoneInput.text,
      shopName: formData.shopNameInput.text,
      shopAddress: formData.shopAddrInput.text,
    }
    lcAuth.shopCertification(certPayload).then((shop) => {
      let cartificationAction = createAction(AuthTypes.SHOP_CERTIFICATION_SUCCESS)
      dispatch(cartificationAction(shop))
      if (payload.success) {
        payload.success(shop)
      }
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }

}

export function getUserInfoById(payload) {
  return (dispatch, getState) => {
    if (!payload.userId) {
      return
    }
    lcAuth.getUserById(payload).then((user) => {
      let code = user.error
      if (0 != code) {
        return
      }
      let userInfo = UserInfo.fromLeancloudApi(user.userInfo)
      const addUserProfile = createAction(AuthTypes.ADD_USER_PROFILE)
      dispatch(addUserProfile({userInfo}))
    }).catch(error => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}

export function fetchUserFollowees(payload) {
  return (dispatch, getState) => {
    lcAuth.fetchUserFollowees(payload).then((result)=> {
      let updateAction = createAction(AuthTypes.FETCH_USER_FOLLOWEES_SUCCESS)
      dispatch(updateAction(result))
      if (payload.success) {
        payload.success(result)
      }
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}

export function userIsFollowedTheUser(payload) {
  return (dispatch, getState) => {
    lcAuth.userIsFollowedTheUser(payload).then((result)=> {
      if (payload.success) {
        payload.success(result)
      }
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}

export function followUser(payload) {
  return (dispatch, getState) => {
    lcAuth.followUser(payload).then((result) => {
      if (result && '10003' == result.code) {
        if (payload.success) {
          payload.success(result)
        }
      } else {
        if (payload.error) {
          payload.error(result)
        }
      }
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}

export function unFollowUser(payload) {
  return (dispatch, getState) => {
    lcAuth.unFollowUser(payload).then((result) => {
      if (result && '10005' == result.code) {
        if (payload.success) {
          payload.success(result)
        }
      } else {
        if (payload.error) {
          payload.error(result)
        }
      }
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}

export function handleInquirySubmit(payload, formData) {
  console.log("handleInquirySubmit payload", payload)
  return (dispatch, getState) => {
    let inquiryPayload = {
      id: payload.id,
      question: formData.content.text,
      diseaseImages: formData.imgGroup.text,
    }

    lcAuth.inquirySubmit(inquiryPayload).then((result) => {
      console.log("handleInquirySubmit success")

    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })

  }
}
