/**
 * Created by yangyang on 2016/12/3.
 */
import {createAction} from 'redux-actions'
import * as uiTypes from '../constants/uiActionTypes'
import {getInputFormData, isInputFormValid} from '../selector/inputFormSelector'

export const inputFormOnChange = createAction(uiTypes.INPUTFORM_ON_CHANGE)
export const inputFormInit = createAction(uiTypes.INPUTFORM_INIT_STATE)
export const inputFormDestroy = createAction(uiTypes.INPUTFORM_DESTROY)
export const inputFormCheck = createAction(uiTypes.INPUTFORM_VALID_CHECK)

export const initInputForm = (payload) => {
  return (dispatch) => {
    dispatch(inputFormInit(payload))
  }
}

export const inputFormUpdate = (payload) => {
  return (dispatch) => {
    dispatch(inputFormOnChange(payload))
  }
}

export const inputFormOnDestroy = (payload) => {
  return (dispatch) => {
    dispatch(inputFormDestroy(payload))
  }
}

export function submitInputForm(payload) {
  return (dispatch, getState) => {
    let formKey = payload.formKey
    dispatch(inputFormCheck({formKey}))
    let formData = getInputFormData(getState(), formKey)
    console.log("formData:", formData)
    let isValid = isInputFormValid(getState(), formKey)
    if (isValid) {
      console.log("invoke method to post form")
      dispatch(inputFormDestroy({formKey}))
    }
  }
}