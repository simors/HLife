/**
 * Created by lilu on 2016/12/24.
 */
import * as Types from '../constants/articleActionTypes'
import {REHYDRATE} from 'redux-persist/constants'
import {Map, List} from 'immutable'

const initialState = new Map()

export default function authReducer(state = initialState, action) {
  switch(action.type) {
    case Types.ADD_ARTICLES:
      return handleAddArticles(state, action)
    default:
      return state
  }
}

function handleAddArticles(state, action) {
  let columnId = action.payload.columnId
  let articleList = action.payload.articleList
  state = state.set(columnId, articleList)
  return state
}
