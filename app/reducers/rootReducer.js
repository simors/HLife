import {combineReducers} from 'redux'

import configReducer from './configReducer'

const rootReducers = combineReducers({
  CONFIG: configReducer,
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