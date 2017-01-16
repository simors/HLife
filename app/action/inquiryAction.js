/**
 * Created by wanpeng on 2017/1/9.
 */
import {createAction} from 'redux-actions'
import * as InquiryTypes from '../constants/inquiryActionTypes'
import * as uiTypes from '../constants/uiActionTypes'
import {getInputFormData, isInputFormValid, getInputData, isInputValid} from '../selector/inputFormSelector'
import * as lcAuth from '../api/leancloud/auth'


export function inputFormCheck(payload) {
  return (dispatch, getState) => {
    let formCheck = createAction(uiTypes.INPUTFORM_VALID_CHECK)
    dispatch(formCheck({formKey: payload.formKey}))
    let isFormValid = isInputFormValid(getState(), payload.formKey)
    if (isFormValid.isValid) {
      if (payload.success) {
        payload.success()
      }
    } else {
      if (payload.error) {
        payload.error({message: isFormValid.errMsg})
      }
      return
    }
  }
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
    dispatch(handleHealthProfileSubmit(payload,formData))
    dispatch(handleInquirySubmit(payload, formData))
  }

}

export function handleInquirySubmit(payload, formData) {
  console.log("handleInquirySubmit formData", formData)
  return (dispatch, getState) => {
    let inquiryPayload = {
      id: payload.id,
      question: formData.content.text,
      diseaseImages: formData.imgGroup.text,
      name: formData.nicknameInput.text,
      gender: formData.genderInput.text,
      birthday: formData.dtPicker.text,
    }

    lcAuth.inquirySubmit(inquiryPayload).then((result) => {
      console.log("handleInquirySubmit success")
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

export function handleHealthProfileSubmit(payload, formData) {
  return (dispatch, getState) => {
    let healthProfilePayload = {
      userId: payload.id,
      nickname: formData.nicknameInput.text,
      gender: formData.genderInput.text,
      birthday: formData.dtPicker.text,
    }
    lcAuth.healthProfileSubmit(healthProfilePayload).then((result) => {
      let addHealthProfileAction = createAction(InquiryTypes.ADD_HEALTH_PROFILE)
      dispatch(addHealthProfileAction(result))
      console.log("healthProfileSubmit success")
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
