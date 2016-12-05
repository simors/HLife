/**
 * Created by yangyang on 2016/12/3.
 */
import {combineReducers} from 'redux'
import inputFormReducer from './inputFormReducer'

const uiReducer = combineReducers({
  INPUTFORM: inputFormReducer,
})

export default uiReducer