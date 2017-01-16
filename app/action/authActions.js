import {createAction} from 'redux-actions'
import * as AuthTypes from '../constants/authActionTypes'
import * as uiTypes from '../constants/uiActionTypes'
import {getInputFormData, isInputFormValid, getInputData, isInputValid} from '../selector/inputFormSelector'
import * as dbOpers from '../api/leancloud/databaseOprs'
import * as lcAuth from '../api/leancloud/auth'
import {initMessageClient, notifyUserFollow} from '../action/messageAction'
import {UserInfo} from '../models/userModels'

export const INPUT_FORM_SUBMIT_TYPE = {
  REGISTER: 'REGISTER',
  GET_SMS_CODE: 'GET_SMS_CODE',
  RESET_PWD_SMS_CODE: 'RESET_PWD_SMS_CODE',
  LOGIN_WITH_SMS: 'LOGIN_WITH_SMS',
  LOGIN_WITH_PWD: 'LOGIN_WITH_PWD',
  FORGET_PASSWORD: 'FORGET_PASSWORD',
  MODIFY_PASSWORD: 'MODIFY_PASSWORD',
  PROFILE_SUBMIT: 'PROFILE_SUBMIT',
  SHOP_CERTIFICATION: 'SHOP_CERTIFICATION',
  SHOP_RE_CERTIFICATION: 'SHOP_RE_CERTIFICATION',
  HEALTH_PROFILE_SUBMIT: 'HEALTH_PROFILE_SUBMIT',
  COMPLETE_SHOP_INFO: 'COMPLETE_SHOP_IFNO',
  PROMOTER_CERTIFICATION: 'PROMOTER_CERTIFICATION',
  PROMOTER_RE_CERTIFICATION: 'PROMOTER_RE_CERTIFICATION',
  UPDATE_SHOP_COVER: 'UPDATE_SHOP_COVER',
  UPDATE_SHOP_ALBUM: 'UPDATE_SHOP_ALBUM',
  PUBLISH_ANNOUNCEMENT: 'PUBLISH_ANNOUNCEMENT',
  UPDATE_ANNOUNCEMENT: 'UPDATE_ANNOUNCEMENT',
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
      case INPUT_FORM_SUBMIT_TYPE.PROFILE_SUBMIT:
        dispatch(handleProfileSubmit(payload, formData))
        break
      case INPUT_FORM_SUBMIT_TYPE.SHOP_CERTIFICATION:
        dispatch(handleShopCertification(payload, formData))
        break
      case INPUT_FORM_SUBMIT_TYPE.SHOP_RE_CERTIFICATION:
        dispatch(handleShopReCertification(payload, formData))
        break
      case INPUT_FORM_SUBMIT_TYPE.HEALTH_PROFILE_SUBMIT:
        dispatch(handleHealthProfileSubmit(payload, formData))
      case INPUT_FORM_SUBMIT_TYPE.PROMOTER_RE_CERTIFICATION:
        dispatch(handleShopReCertification(payload, formData))
        break
      case INPUT_FORM_SUBMIT_TYPE.COMPLETE_SHOP_INFO:
        dispatch(handleCompleteShopInfo(payload, formData))
        break
      case INPUT_FORM_SUBMIT_TYPE.PROMOTER_CERTIFICATION:
        dispatch(handlePromoterCertification(payload,formData))
        break
      case INPUT_FORM_SUBMIT_TYPE.UPDATE_SHOP_COVER:
        dispatch(handleShopCover(payload,formData))
        break
      case INPUT_FORM_SUBMIT_TYPE.UPDATE_SHOP_ALBUM:
        dispatch(handleShopAlbum(payload,formData))
        break
      case INPUT_FORM_SUBMIT_TYPE.PUBLISH_ANNOUNCEMENT:
        dispatch(handlePublishAnnouncement(payload,formData))
        break
      case INPUT_FORM_SUBMIT_TYPE.UPDATE_ANNOUNCEMENT:
        dispatch(handleUpdateAnnouncement(payload,formData))
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


function handlePromoterCertification(payload, formData) {
  return (dispatch, getState) => {
    let smsPayload = {
      phone: formData.phoneInput.text,
      smsAuthCode: formData.smsAuthCodeInput.text,
    }
    if(__DEV__) {
      dispatch(verifyInviteCode(payload, formData))
    }
    else {
      lcAuth.verifySmsCode(smsPayload).then(() => {
        dispatch(verifyInviteCode(payload, formData))
      }).catch((error) => {
        if (payload.error) {
          payload.error(error)
        }
      })
    }
  }
}

function verifyInviteCode(payload, formData) {
  return (dispatch, getState) => {
    lcAuth.verifyInvitationCode({invitationsCode: formData.inviteCodeInput.text}).then(()=> {
      dispatch(promoterCertification(payload, formData))
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}
function promoterCertification(payload, formData) {
  return (dispatch, getState) => {
    let certPayload = {
      name: formData.nameInput.text,
      phone: formData.phoneInput.text,
      level: 1,
      address: formData.regionPicker.text,
      cardId: formData.IDInput.text,
      //upUser: payload.upUser,
    }
    lcAuth.promoteCertification(certPayload).then((promoter) => {
     //console.log('promoter',promoter)
      let certificationAction = createAction(AuthTypes.PROMOTER_CERTIFICATION_SUCCESS)
      dispatch(certificationAction({promoter}))
      if (payload.success) {
        payload.success(promoter)
      }
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
    if(__DEV__) {
      dispatch(verifyInvitationCode(payload, formData))
    }
    else {
      lcAuth.verifySmsCode(smsPayload).then(() => {
        dispatch(verifyInvitationCode(payload, formData))
      }).catch((error) => {
        if (payload.error) {
          payload.error(error)
        }
      })
    }
  }
}

function handleShopReCertification(payload, formData) {
  return (dispatch, getState) => {
    payload.isReCertification = true
    let smsPayload = {
      phone: formData.phoneInput.text,
      smsAuthCode: formData.smsAuthCodeInput.text,
      isReCertification: payload.isReCertification
    }
    if(__DEV__) {
      dispatch(shopCertification(payload, formData))
    }
    else {
      lcAuth.verifySmsCode(smsPayload).then(() => {
        dispatch(shopCertification(payload, formData))
      }).catch((error) => {
        if (payload.error) {
          payload.error(error)
        }
      })
    }
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
      let actionType = AuthTypes.SHOP_CERTIFICATION_SUCCESS
      if(payload.isReCertification) {
        actionType = AuthTypes.SHOP_RE_CERTIFICATION_SUCCESS
      }
      let cartificationAction = createAction(actionType)
      dispatch(cartificationAction({shop}))
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

function handleShopCover(payload, formData) {
  return (dispatch, getState) => {
    let shopPayload = {
      id: payload.id,
      coverUrl: formData.shopCoverInput.text
    }
    lcAuth.updateShopCover(shopPayload).then((success) => {
      if (payload.success) {
        payload.success(success)
      }
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}


function handleShopAlbum(payload, formData) {
  return (dispatch, getState) => {
    let shopPayload = {
      id: payload.id,
      album: formData.shopAlbumInput.text
    }
    lcAuth.handleShopAlbum(shopPayload).then((success) => {
      if (payload.success) {
        payload.success(success)
      }
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}

function handleCompleteShopInfo(payload, formData) {
  return (dispatch, getState) => {
    let newPayload = {
      shopId: payload.shopId,
      shopCategoryObjectId: formData.shopCategoryInput.text,
      openTime: formData.serviceTimeInput.text,
      contactNumber: formData.servicePhoneInput.text,
      ourSpecial: formData.ourSpecialInput.text,
      album: formData.shopAlbumInput.text,
      coverUrl: formData.shopCoverInput.text,
      tagIds: formData.tagsInput.text,
    }
    lcAuth.submitCompleteShopInfo(newPayload).then((result) => {
      let _action = createAction(AuthTypes.COMPLETE_SHOP_INFO_SUCCESS)
      dispatch(_action({}))
      if (payload.success) {
        payload.success()
      }
    }).catch((error) => {
      // console.log('error=======', error)
      // console.log('error=======', error.code)
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}

function handlePublishAnnouncement(payload, formData) {
  return (dispatch, getState) => {
    let newPayload = {
      id: payload.id,
      announcementContent: formData.announcementContentInput.text,
      announcementCover: formData.announcementCoverInput.text,
    }
    lcAuth.publishAnnouncement(newPayload).then((shop) => {
      let _action = createAction(AuthTypes.PUBLISH_ANNOUNCEMENT_SUCCESS)
      dispatch(_action(shop))
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

function handleUpdateAnnouncement(payload, formData) {
  return (dispatch, getState) => {
    let newPayload = {
      shopAnnouncementId: payload.shopAnnouncementId,
      announcementContent: formData.announcementContentInput.text,
      announcementCover: formData.announcementCoverInput.text,
    }
    lcAuth.updateAnnouncement(newPayload).then((shop) => {
      let _action = createAction(AuthTypes.UPDATE_ANNOUNCEMENT_SUCCESS)
      dispatch(_action(shop))
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
        let params = {
          toPeers: payload.userId
        }
        dispatch(notifyUserFollow(params))
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

export function handleHealthProfileSubmit(payload, formData) {

  return (dispatch, getState) => {
    let healthProfilePayload = {
      userId: payload.id,
      nickname: formData.nicknameInput.text,
      gender: formData.genderInput.text,
      birthday: formData.dtPicker.text,
    }
    lcAuth.healthProfileSubmit(healthProfilePayload).then((result) => {
      let addHealthProfileAction = createAction(AuthTypes.ADD_HEALTH_PROFILE)
      dispatch(addHealthProfileAction({result}))
      if (payload.success) {
        payload.success(result)
      }

    })
  }
}

export function fetchFavoriteArticles(payload) {
  //console.log('columnId======>')
  return (dispatch, getState) => {
   // console.log('columnId======>---------------------')
    lcAuth.getFavoriteArticles(payload).then((result) => {
        //console.log('result======>',result)
      let updateAction = createAction(AuthTypes.FETCH_USER_FAVORITEARTICLE_SUCCESS)
      dispatch(updateAction(result))
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}


