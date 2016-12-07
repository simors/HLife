import {combineReducers} from 'redux'

import configReducer from './configReducer'
import uiReducer from './uiReducer'
import toastReducer  from './toastReducer'

const rootReducers = combineReducers({
  CONFIG: configReducer,
  UI: uiReducer,
  TOAST: toastReducer,
})

const rootReducersWrapper = (state, action) => {
  action.rootState = state
  if (action.error) {
    return {
      ...state
    }
  } else {
    return rootReducers(state, action)
  }
}

export default rootReducersWrapper