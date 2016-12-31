/**
 * Created by lilu on 2016/12/24.
 */
import * as Types from '../constants/articleActionTypes'
import {REHYDRATE} from 'redux-persist/constants'
import {Map, List} from 'immutable'

const initialState = new Map()

export default function articleReducer(state = initialState, action) {
  switch(action.type) {
    case Types.ADD_ARTICLES:
      return handleAddArticles(state, action)
    case Types.ADD_LIKERS:
      return handleAddLikers(state, action)
    case Types.ADD_COMMENT:
      return handleAddComments(state,action)
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

function handleAddLikers(state, action) {
  let columnId = action.payload.columnId
  let articleId = action.payload.articleId
  let likersList = action.payload.likersList

  let articleList = state.get(columnId)
  let article = articleList.find((value) => {return value.articleId == articleId})
  let index = articleList.findIndex((value) => {return value.articleId == articleId})
  article = article.set('likers', likersList)
  articleList = articleList.update(index, val => article)
  state = state.set(columnId, articleList)
  //console.log('state======>',state)

  return state

}

function handleAddComments(state, action) {
  let columnId = action.payload.columnId
  let articleId = action.payload.articleId
  let commentList = action.payload.commentList

  let articleList = state.get(columnId)
  let article = articleList.find((value) => {return value.articleId == articleId})
  let index = articleList.findIndex((value) => {return value.articleId == articleId})
  article = article.set('comments', commentList)
  articleList = articleList.update(index, val => article)
  state = state.set(columnId, articleList)
  //console.log('state======>',state)

  return state

}