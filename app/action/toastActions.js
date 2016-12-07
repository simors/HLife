import {createAction} from 'redux-actions'

export const SHOW_TOAST_TYPE = 'SHOW_TOAST_TYPE'
export const END_TOAST_TYPE = 'END_TOAST_TYPE'

export const showToast = createAction(SHOW_TOAST_TYPE)
export const endToast = createAction(END_TOAST_TYPE)