import {createAction} from 'redux-actions'
import * as AuthTypes from '../constants/authActionTypes'
import * as uiTypes from '../constants/uiActionTypes'
import {getInputFormData, isInputFormValid, getInputData, isInputValid} from '../selector/inputFormSelector'
import * as lcAuth from '../api/leancloud/auth'
import * as lcShop from '../api/leancloud/shop'
import {initMessageClient, notifyUserFollow} from '../action/messageAction'
import {UserInfo} from '../models/userModels'
import * as msgAction from './messageAction'
import {activeUserId, activeUserInfo} from '../selector/authSelector'
import {IDENTITY_SHOPKEEPER} from '../constants/appConfig'
import {closeMessageClient} from './messageAction'

import * as AVUtils from '../util/AVUtils'
import {calUserRegist, calRegistShoper} from '../action/pointActions'
import {IDENTITY_PROMOTER} from '../constants/appConfig'
import * as ImageUtil from '../util/ImageUtil'

export const INPUT_FORM_SUBMIT_TYPE = {
  REGISTER: 'REGISTER',
  GET_SMS_CODE: 'GET_SMS_CODE',
  RESET_PWD_SMS_CODE: 'RESET_PWD_SMS_CODE',
  LOGIN_WITH_SMS: 'LOGIN_WITH_SMS',
  LOGIN_WITH_PWD: 'LOGIN_WITH_PWD',
  SET_NICKNAME: 'SET_NICKNAME',
  FORGET_PASSWORD: 'FORGET_PASSWORD',
  MODIFY_PASSWORD: 'MODIFY_PASSWORD',
  PROFILE_SUBMIT: 'PROFILE_SUBMIT',
  SHOP_CERTIFICATION: 'SHOP_CERTIFICATION',
  SHOP_RE_CERTIFICATION: 'SHOP_RE_CERTIFICATION',
  HEALTH_PROFILE_SUBMIT: 'HEALTH_PROFILE_SUBMIT',
  COMPLETE_SHOP_INFO: 'COMPLETE_SHOP_IFNO',
  EDIT_SHOP_IFNO: 'EDIT_SHOP_IFNO',
  PROMOTER_RE_CERTIFICATION: 'PROMOTER_RE_CERTIFICATION',
  UPDATE_SHOP_COVER: 'UPDATE_SHOP_COVER',
  UPDATE_SHOP_ALBUM: 'UPDATE_SHOP_ALBUM',
  PUBLISH_ANNOUNCEMENT: 'PUBLISH_ANNOUNCEMENT',
  PUBLISH_SHOP_COMMENT: 'PUBLISH_SHOP_COMMENT',
  UPDATE_ANNOUNCEMENT: 'UPDATE_ANNOUNCEMENT',
}

const addIdentity = createAction(AuthTypes.ADD_PERSONAL_IDENTITY)

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
      case INPUT_FORM_SUBMIT_TYPE.SET_NICKNAME:
        dispatch(handleSetNickname(payload, formData))
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
        break
      case INPUT_FORM_SUBMIT_TYPE.PROMOTER_RE_CERTIFICATION:
        dispatch(handleShopReCertification(payload, formData))
        break
      case INPUT_FORM_SUBMIT_TYPE.COMPLETE_SHOP_INFO:
        dispatch(handleCompleteShopInfo(payload, formData))
        break
      case INPUT_FORM_SUBMIT_TYPE.EDIT_SHOP_IFNO:
        dispatch(handleEditShopInfo(payload, formData))
        break
      case INPUT_FORM_SUBMIT_TYPE.UPDATE_SHOP_COVER:
        dispatch(handleShopCover(payload, formData))
        break
      case INPUT_FORM_SUBMIT_TYPE.UPDATE_SHOP_ALBUM:
        dispatch(handleShopAlbum(payload, formData))
        break
      case INPUT_FORM_SUBMIT_TYPE.PUBLISH_ANNOUNCEMENT:
        dispatch(handlePublishAnnouncement(payload, formData))
        break
      case INPUT_FORM_SUBMIT_TYPE.PUBLISH_SHOP_COMMENT:
        dispatch(handlePublishShopComment(payload, formData))
        break
      case INPUT_FORM_SUBMIT_TYPE.UPDATE_ANNOUNCEMENT:
        dispatch(handleUpdateAnnouncement(payload, formData))
        break
    }
  }
}

export function userLogOut(payload) {
  return (dispatch, getState) => {
    lcAuth.logOut({})
    dispatch(createAction(AuthTypes.LOGIN_OUT)({}))
    dispatch(closeMessageClient({}))
    AVUtils.updateDeviceUserInfo({
      removeUser: true
    })
    if (payload.success) {
      payload.success()
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
      return userInfo
    }).then((user) => {
      dispatch(initMessageClient(payload))
      AVUtils.updateDeviceUserInfo({
        userId: user.userInfo.id
      })
    }).catch((error) => {
      dispatch(createAction(AuthTypes.LOGIN_OUT)({}))
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}

function handleSetNickname(payload, formData) {
  return (dispatch, getState) => {
    let form = {
      userId: activeUserId(getState()),
      nickname: formData.nicknameInput.text,
    }
    lcAuth.setUserNickname(form).then((result) => {
      if (result.errcode == 0) {
        if (payload.success) {
          payload.success()
        }
      } else {
        if (payload.error) {
          payload.error({message: '设置昵称失败，请重试'})
        }
      }
    }).then(() => {
      let user = activeUserInfo(getState())
      lcAuth.become({token: user.token}).then((userInfo) => {
        let loginAction = createAction(AuthTypes.LOGIN_SUCCESS)
        dispatch(loginAction({...userInfo}))
        return userInfo
      }).then((user) => {
        dispatch(calUserRegist({userId: user.userInfo.id}))
        dispatch(initMessageClient(payload))
        AVUtils.updateDeviceUserInfo({
          userId: user.userInfo.id
        })
      })
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
      dispatch(initMessageClient(payload))
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
      let regAction = createAction(AuthTypes.REGISTER_SUCCESS)
      dispatch(regAction(user))
      if (payload.success) {
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
    let localImgs = []
    localImgs.push(formData.avatarInput.text)

    return ImageUtil.batchUploadImgs(localImgs).then((leanUris) => {
      return leanUris
    }).then((leanUris) => {
      let profilePayload = {
        id: payload.id,
        nickname: formData.nicknameInput && formData.nicknameInput.text,
        avatar: leanUris[0],
        phone: formData.phoneInput && formData.phoneInput.text,
        birthday: formData.dtPicker && formData.dtPicker.text,
        gender: formData.genderInput && formData.genderInput.text,
      }
      return lcAuth.profileSubmit(profilePayload).then((profile) => {
        if (payload.success) {
          payload.success()
        }
        let profileAction = createAction(AuthTypes.PROFILE_SUBMIT_SUCCESS)
        dispatch(profileAction({...profile}))
      }).catch((error) => {
        if (payload.error) {
          payload.error(error)
        }
      })
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}

// function handleShopCertification(payload, formData) {
//   return (dispatch, getState) => {
//     let smsPayload = {
//       phone: formData.phoneInput.text,
//       smsAuthCode: formData.smsAuthCodeInput.text,
//     }
//     if (__DEV__) {
//       // dispatch(verifyInvitationCode(payload, formData))
//       dispatch(shopCertification(payload, formData))
//       return
//     }
//     else {
//       lcAuth.verifySmsCode(smsPayload).then(() => {
//         dispatch(verifyInvitationCode(payload, formData))
//       }).then(() => {
//         let userId = activeUserId(getState())
//         dispatch(calRegistShoper({userId}))   // 计算注册成为店家的积分
//       }).catch((error) => {
//         if (payload.error) {
//           payload.error(error)
//         }
//       })
//     }
//   }
// }



function handleShopCertification(payload, formData) {
  return (dispatch, getState) => {

    if(__DEV__) {
      dispatch(shopCertification4UploadCertiImg(payload, formData))
    }else{
      let smsPayload = {
        phone: formData.phoneInput.text,
        smsAuthCode: formData.smsAuthCodeInput.text,
      }
      lcAuth.verifySmsCode(smsPayload).then(() => {
        dispatch(shopCertification4UploadCertiImg(payload, formData))
      }).catch((error) => {
        if (payload.error) {
          payload.error(error)
        }
      })
    }
  }
}

function shopCertification4UploadCertiImg(payload, formData) {
  return (dispatch, getState) =>{
    let localImgs = []
    if(formData.certificationInput.text) {
      localImgs.push(formData.certificationInput.text)
      return ImageUtil.batchUploadImgs(localImgs).then((leanUris) => {
        payload.certiImgLeanUris = leanUris
        dispatch(shopCertification4Cloud(payload, formData))
      }).catch((error) => {
        if (payload.error) {
          error.message = error.message || '上传营业执照异常'
          payload.error(error)
        }
      })
    }else{
      if (payload.error) {
        let error = {}
        error.message = '请上传有效的营业执照'
        payload.error(error)
      }
    }
  }
}

function shopCertification4Cloud(payload, formData) {
  return (dispatch, getState) =>{
    let shopInfo = {
      inviteCode: formData.invitationCodeInput.text,
      name: formData.nameInput.text,
      phone: formData.phoneInput.text,
      shopName: formData.shopNameInput.text,
      shopAddress:formData.shopAddrInput && formData.shopAddrInput.text,
      geo: formData.shopGeoInput && formData.shopGeoInput.text,
      geoCity: formData.shopGeoCityInput && formData.shopGeoCityInput.text,
      geoDistrict:formData.shopGeoDistrictInput && formData.shopGeoDistrictInput.text,
      certification: payload.certiImgLeanUris[0],
    }
    lcShop.shopCertification(shopInfo).then((shop) => {
      let userId = activeUserId(getState())
      dispatch(calRegistShoper({userId}))   // 计算注册成为店家的积分
      dispatch(addIdentity({identity: IDENTITY_SHOPKEEPER}))
      if (payload.success) {
        payload.success(shop)
      }
    }).catch((error) => {
      if (payload.error) {
        error.message = error.message || '注册店铺失败，请稍候再试'
        payload.error(error)
      }
    })
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
    if (__DEV__) {
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
        error.message = "邀请码验证失败！"
        payload.error(error)
      }
    })
  }
}

function shopCertification(payload, formData) {
  return (dispatch, getState) => {
    // console.log('shopCertification=formData==', formData)
    let certPayload = {
      name: formData.nameInput.text,
      phone: formData.phoneInput.text,
      shopName: formData.shopNameInput.text,
      shopAddress: formData.shopAddrInput.text,
      geo: formData.shopGeoInput.text,
      geoCity: formData.shopGeoCityInput.text,
      geoDistrict: formData.shopGeoDistrictInput.text,
    }
    lcAuth.shopCertification(certPayload).then((shop) => {
      dispatch(addIdentity({identity: IDENTITY_SHOPKEEPER}))
      let actionType = AuthTypes.SHOP_CERTIFICATION_SUCCESS
      if (payload.isReCertification) {
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

    let shopCategoryObjectId = ''
    if (payload.canModifyShopCategory) {
      shopCategoryObjectId = formData.shopCategoryInput.text
    }

    let newPayload = {
      shopId: payload.shopId,
      shopCategoryObjectId: shopCategoryObjectId,
      album: payload.album,
      coverUrl: payload.coverUrl,
      openTime: formData.serviceTimeInput.text,
      contactNumber: formData.servicePhoneInput.text,
      contactNumber2: formData.servicePhone2Input.text,
      ourSpecial: formData.ourSpecialInput.text,
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

function handleEditShopInfo(payload, formData) {
  return (dispatch, getState) => {

    let newPayload = {
      shopId: payload.shopId,
      album: payload.album,
      coverUrl: payload.coverUrl,
      openTime: formData.serviceTimeInput.text,
      contactNumber: formData.servicePhoneInput.text,
      contactNumber2: formData.servicePhone2Input.text,
      ourSpecial: formData.ourSpecialInput.text,
      tagIds: formData.tagsInput.text,
    }
    lcAuth.submitEditShopInfo(newPayload).then((result) => {
      // console.log('submitEditShopInfo.result====', result)
      let _action = createAction(AuthTypes.EDIT_SHOP_INFO_SUCCESS)
      dispatch(_action({}))
      if (payload.success) {
        payload.success()
      }
    }, (reason)=>{
      if (payload.error) {
        payload.error(reason || '更新店铺失败')
      }
    })
  }
}

function handlePublishAnnouncement(payload, formData) {
  return (dispatch, getState) => {
    if (!formData.announcementContentInput || !formData.announcementContentInput.text) {
      throw new Error('请填写公告内容')
    }
    let newPayload = {
      id: payload.id,
      announcementContent: formData.announcementContentInput.text,
      announcementCover: formData.announcementCoverInput && formData.announcementCoverInput.text,
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

function handlePublishShopComment(payload, formData) {
  return (dispatch, getState) => {
    let newPayload = {}
    newPayload.id = payload.id
    if (formData.content) {
      newPayload.content = formData.content.text
    } else {
      throw new Error('请填写评论内容')
    }
    if (formData.score) {
      newPayload.score = formData.score.text
    }
    if (formData.imgGroup) {
      newPayload.blueprints = formData.imgGroup.text
    }
    lcShop.submitShopComment(newPayload).then((result) => {
      let _action = createAction(AuthTypes.PUBLISH_SHOP_COMMENT_SUCCESS)
      dispatch(_action({}))
      let params = {
        shopId: payload.id,
        replyTo: payload.shopOwnerId,
        commentId: result.id,
        content: newPayload.content,
      }
      // console.log('handlePublishShopComment=====params=', params)
      dispatch(msgAction.notifyShopComment(params))
      if (payload.success) {
        payload.success()
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
    if (!formData.announcementContentInput || !formData.announcementContentInput.text) {
      throw new Error('请填写公告内容')
    }
    let newPayload = {
      shopAnnouncementId: payload.shopAnnouncementId,
      announcementContent: formData.announcementContentInput.text,
      announcementCover: formData.announcementCoverInput && formData.announcementCoverInput.text,
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

      const updateUserIdentityAction = createAction(AuthTypes.UPDATE_USER_IDENTITY)
      dispatch(updateUserIdentityAction({identity: userInfo.identity}))
      
    }).catch(error => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}

export function fetchUsers(payload) {
  return (dispatch, getState) => {
    lcAuth.getUsers(payload).then((user) => {
      let code = user.error
      if (0 != code) {
        return
      }
      user.users.forEach((lcUser) => {
        let userInfo = UserInfo.fromLeancloudApi(lcUser)
        const addUserProfile = createAction(AuthTypes.ADD_USER_PROFILE)
        dispatch(addUserProfile({userInfo}))
      })
    }).catch(error => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}

/**
 * 查询自己关注的用户列表
 * @param payload
 * @returns {function()}
 */
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

/**
 * 查询指定用户的粉丝列表
 * @param payload
 * @returns {function()}
 */
export function fetchOtherUserFollowers(payload) {
  return (dispatch, getState) => {
    lcAuth.fetchOtherUserFollowers(payload).then((result)=> {
      let updateAction = createAction(AuthTypes.FETCH_USER_FOLLOWERS_SUCCESS)
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

/**
 * 查询指定用户的粉丝总数
 * @param payload
 * @returns {function()}
 */
export function fetchOtherUserFollowersTotalCount(payload) {
  return (dispatch, getState) => {
    lcAuth.fetchOtherUserFollowersTotalCount(payload).then((result)=> {
      let updateAction = createAction(AuthTypes.FETCH_USER_FOLLOWERS_TOTAL_COUNT_SUCCESS)
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

/**
 * 查询自己的粉丝
 * @param payload
 * @returns {function()}
 */
export function fetchUserFollowers(payload) {
  return (dispatch, getState) => {
    lcAuth.fetchUserFollowers(payload).then((result)=> {
      let updateAction = createAction(AuthTypes.FETCH_USER_FOLLOWERS_SUCCESS)
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

export function fetchUserFollowersTotalCount(payload) {
  return (dispatch, getState) => {
    lcAuth.fetchUserFollowersTotalCount(payload).then((result)=> {
      let updateAction = createAction(AuthTypes.FETCH_USER_FOLLOWERS_TOTAL_COUNT_SUCCESS)
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
  console.log("handleHealthProfileSubmit payload", payload)
  console.log("handleHealthProfileSubmit formData", formData)

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


