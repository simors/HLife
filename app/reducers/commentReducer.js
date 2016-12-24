/**
 * Created by lilu on 2016/12/24.
 */
import * as Types from '../constants/articleActionTypes'
import {REHYDRATE} from 'redux-persist/constants'
import {Map, List} from 'immutable'

const initialState = new Map()

export default function commentArticleReducer(state = initialState, action) {
  switch(action.type) {
    case Types.ADD_COMMENT_ARTICLE:
      return handleAddArticles(state, action)
    default:
      return state
  }
}

function handleAddArticles(state, action) {
  let articleId = action.payload.articleId
  let commentArticleList = action.payload.commentArticleList
  state = state.set(articleId, commentArticleList)
  return state
}