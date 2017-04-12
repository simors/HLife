/**
 * Created by yangyang on 2017/3/24.
 */
import {createAction} from 'redux-actions'
import * as uiTypes from '../constants/uiActionTypes'
import * as promoterActionTypes from '../constants/promoterActionTypes'
import * as lcAuth from '../api/leancloud/auth'
import * as lcPromoter from '../api/leancloud/promoter'
import * as shopActionTypes from '../constants/shopActionTypes'
import {getInputFormData, isInputFormValid, getInputData, isInputValid} from '../selector/inputFormSelector'
import {activeUserId, activeUserInfo} from '../selector/authSelector'
import {calRegistPromoter} from '../action/pointActions'
import {IDENTITY_PROMOTER} from '../constants/appConfig'
import * as AuthTypes from '../constants/authActionTypes'
import {PromoterInfo} from '../models/promoterModel'
import {UserInfo} from '../models/userModels'
import {ShopInfo} from '../models/shopModel'
import {activePromoter} from '../selector/promoterSelector'

let formCheck = createAction(uiTypes.INPUTFORM_VALID_CHECK)
const addIdentity = createAction(AuthTypes.ADD_PERSONAL_IDENTITY)
let certificatePromoter = createAction(promoterActionTypes.CERTIFICATE_PROMOTER)
let setActivePromoter = createAction(promoterActionTypes.SET_ACTIVE_PROMOTER)
let updatePromoter = createAction(promoterActionTypes.UPDATE_PROMOTER_INFO)
let updateTenant = createAction(promoterActionTypes.UPDATE_TENANT_FEE)
let addUserProfile = createAction(AuthTypes.ADD_USER_PROFILE)
let updateUpPromoter = createAction(promoterActionTypes.UPDATE_UPPROMOTER_ID)
let setPromoterTeam = createAction(promoterActionTypes.SET_PROMOTER_TEAM)
let addPromoterTeam = createAction(promoterActionTypes.ADD_PROMOTER_TEAM)
let addShopDetail = createAction(shopActionTypes.FETCH_SHOP_DETAIL_SUCCESS)
let addPromoterShops = createAction(promoterActionTypes.ADD_PROMOTER_SHOPS)
let setPromoterShops = createAction(promoterActionTypes.SET_PROMOTER_SHOPS)
let setUserPromoterMap = createAction(promoterActionTypes.SET_USER_PROMOTER_MAP)

export function getInviteCode(payload) {
  return (dispatch, getState) => {
    lcPromoter.generateInviteCode().then((code) => {
      if (code.status == 0) {
        let generateInviteCode = createAction(promoterActionTypes.GENERATE_INVITE_CODE)
        dispatch(generateInviteCode({code: code.result}))
      } else {
        if (payload.error) {
          payload.error({message: '生成验证码失败，请重新生成！'})
        }
      }
    })
  }
}

export function clearInviteCode() {
  return (dispatch, getState) => {
    let clearCode = createAction(promoterActionTypes.CLEAR_INVITE_CODE)
    dispatch(clearCode())
  }
}

export function promoterCertification(payload) {
  return (dispatch, getState) => {
    dispatch(formCheck({formKey: payload.formKey}))
    let isFormValid = isInputFormValid(getState(), payload.formKey)
    if (!isFormValid.isValid) {
      if (payload.error) {
        payload.error({message: isFormValid.errMsg})
      }
      return
    }
    let formData = getInputFormData(getState(), payload.formKey)
    let smsPayload = {
      phone: formData.phoneInput.text,
      smsAuthCode: formData.smsAuthCodeInput.text,
    }
    lcAuth.verifySmsCode(smsPayload).then(() => {
      let region = formData.regionPicker.text
      let promoterInfo = {
        inviteCode: formData.inviteCodeInput.text,
        name: formData.nameInput.text,
        phone: formData.phoneInput.text,
        liveProvince: region.province,
        liveCity: region.city,
        liveDistrict: region.district,
      }
      lcPromoter.promoterCertification(promoterInfo).then((promoterInfo) => {
        let promoterId = promoterInfo.promoter.objectId
        let promoter = PromoterInfo.fromLeancloudObject(promoterInfo.promoter)
        dispatch(addIdentity({identity: IDENTITY_PROMOTER}))
        dispatch(setActivePromoter({promoterId}))
        dispatch(updatePromoter({promoterId, promoter}))
      }).then(() => {
        let userId = activeUserId(getState())
        dispatch(calRegistPromoter({userId}))   // 计算注册成为推广员的积分
        if (payload.success) {
          payload.success()
        }
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

export function getCurrentPromoter(payload) {
  return (dispatch, getState) => {
    let userId = activeUserId(getState())
    lcPromoter.fetchPromterByUser({userId}).then((promoterInfo) => {
      if (promoterInfo.errcode != 0) {
        if (payload.error) {
          payload.error(promoterInfo.message)
        }
        return
      }
      let promoterId = promoterInfo.promoter.objectId
      let promoter = PromoterInfo.fromLeancloudObject(promoterInfo.promoter)
      dispatch(setActivePromoter({promoterId}))
      dispatch(updatePromoter({promoterId, promoter}))
      dispatch(setUserPromoterMap({userId: activeUserId(getState), promoterId: promoterId}))
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}

export function getPromoterByUserId(payload) {
  return (dispatch, getState) => {
    let userId = payload.userId
    lcPromoter.fetchPromterByUser({userId}).then((promoterInfo) => {
      if (promoterInfo.errcode != 0) {
        if (payload.error) {
          payload.error(promoterInfo.message)
        }
        return
      }
      let promoterId = promoterInfo.promoter.objectId
      let promoter = PromoterInfo.fromLeancloudObject(promoterInfo.promoter)
      dispatch(updatePromoter({promoterId, promoter}))
      dispatch(setUserPromoterMap({userId, promoterId}))
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}

export function getShopTenant(payload) {
  return (dispatch, getState) => {
    lcPromoter.getShopTenantFee(payload).then((tenant) => {
      dispatch(updateTenant({tenant}))
    })
  }
}

export function getPromoterTenant(payload) {
  return (dispatch, getState) => {
    lcPromoter.getPormoterTenant(payload).then((tenant) => {
      dispatch(updateTenant({tenant}))
    })
  }
}

export function getMyUpPromoter(payload) {
  return (dispatch, getState) => {
    let userId = activeUserId(getState())
    lcPromoter.getUpPromoter({userId}).then((promoterInfo) => {
      let promoterId = promoterInfo.promoter.objectId
      let promoter = PromoterInfo.fromLeancloudObject(promoterInfo.promoter)
      let userInfo = UserInfo.fromLeancloudApi(promoterInfo.user)
      dispatch(addUserProfile({userInfo}))
      dispatch(updatePromoter({promoterId, promoter}))
      dispatch(updateUpPromoter({upPromoterId: promoterId}))
    })
  }
}

export function getMyPromoterTeam(payload) {
  return (dispatch, getState) => {
    let more = payload.more
    if (!more) {
      more = false
    }
    lcPromoter.getMyPromoterTeam(payload).then((result) => {
      let team = []
      let promoters = result.promoters
      let users = result.users
      promoters.forEach((promoter) => {
        let promoterId = promoter.objectId
        let promoterRecord = PromoterInfo.fromLeancloudObject(promoter)
        team.push(promoterId)
        dispatch(updatePromoter({promoterId, promoter: promoterRecord}))
      })
      users.forEach((user) => {
        let userInfo = UserInfo.fromLeancloudApi(user)
        dispatch(addUserProfile({userInfo}))
      })
      if (more) {
        dispatch(addPromoterTeam({promoterId: activePromoter(getState()), newTeam: team}))
      } else {
        dispatch(setPromoterTeam({promoterId: activePromoter(getState()), team: team}))
      }
    })
  }
}

export function getPromoterTeamById(payload) {
  return (dispatch, getState) => {
    let more = payload.more
    if (!more) {
      more = false
    }
    lcPromoter.getPromoterTeamById(payload).then((result) => {
      let team = []
      let promoters = result.promoters
      let users = result.users
      promoters.forEach((promoter) => {
        let promoterId = promoter.objectId
        let promoterRecord = PromoterInfo.fromLeancloudObject(promoter)
        team.push(promoterId)
        dispatch(updatePromoter({promoterId, promoter: promoterRecord}))
      })
      users.forEach((user) => {
        let userInfo = UserInfo.fromLeancloudApi(user)
        dispatch(addUserProfile({userInfo}))
      })
      if (more) {
        dispatch(addPromoterTeam({promoterId: payload.promoterId, newTeam: team}))
      } else {
        dispatch(setPromoterTeam({promoterId: payload.promoterId, team: team}))
      }
    })
  }
}

export function getMyInvitedShops(payload) {
  return (dispatch, getState) => {
    let more = payload.more
    if (!more) {
      more = false
    }
    lcPromoter.getMyInvitedShops(payload).then((shops) => {
      let shopIds = []
      shops.forEach((shop) => {
        let shopRecord = ShopInfo.fromLeancloudApi(shop)
        console.log('shopRecord:', shopRecord)
        shopIds.push(shop.id)
        dispatch(addShopDetail({id: shop.id, shopInfo: shopRecord}))
      })
      if (more) {
        dispatch(addPromoterShops({promoterId: activePromoter(getState()), newShops: shopIds}))
      } else {
        dispatch(setPromoterShops({promoterId: activePromoter(getState()), shops: shopIds}))
      }
    })
  }
}