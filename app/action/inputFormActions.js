/**
 * Created by yangyang on 2016/12/3.
 */
import {createAction} from 'redux-actions'
import * as uiTypes from '../constants/uiActionTypes'

export const inputFormOnChange = createAction(uiTypes.INPUTFORM_ON_CHANGE)
export const inputFormInit = createAction(uiTypes.INPUTFORM_INIT_STATE)

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