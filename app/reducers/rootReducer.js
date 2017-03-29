import {combineReducers} from 'redux'

import pushReducer from './pushReducer'
import configReducer from './configReducer'
import uiReducer from './uiReducer'
import authReducer  from './authReducer'
import messageReducer from './messageReducer'
import articleReducer from './articleReducer'
import topicReducer from './topicReducer'
import shopReducer from './shopReducer'
import doctorReducer from './doctorReducer'
import notifyReducer from './notifyReducer'
import promoterReducer from './promoterReducer'

const rootReducers = combineReducers({
  PUSH: pushReducer,
  CONFIG: configReducer,
  UI: uiReducer,
  AUTH: authReducer,
  MESSAGE: messageReducer,
  ARTICLE: articleReducer,
  TOPIC: topicReducer,
  SHOP: shopReducer,
  DOCTOR: doctorReducer,
  NOTICE: notifyReducer,
  PROMOTER: promoterReducer,
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