/**
 * Created by yangyang on 2016/12/3.
 */
import {combineReducers} from 'redux'
import inputFormReducer from './inputFormReducer'
import searchReducer from './searchReducer'

const uiReducer = combineReducers({
  INPUTFORM: inputFormReducer,
  SEARCH: searchReducer,
})

export default uiReducer