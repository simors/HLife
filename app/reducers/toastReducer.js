
import {Map} from 'immutable'
import * as toastActions from '../action/toastActions'

const initialState = Map({
  text: undefined,
  isShowSearchModal:false,
})

export default function toastReducer(state = initialState, action) {
  switch (action.type) {
    case toastActions.SHOW_TOAST_TYPE:
    	//console.log('action.payload.text=', action.payload.text)
      return state.set('text', action.payload.text)

    case toastActions.END_TOAST_TYPE:
      return state.set('text', undefined)

    default:
      return state
  }
}