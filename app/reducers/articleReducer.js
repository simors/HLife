/**
 * Created by lilu on 2016/12/24.
 */
import * as Types from '../constants/articleActionTypes'
import {REHYDRATE} from 'redux-persist/constants'
import {Map, Record,List} from 'immutable'
import {Articles} from '../models/ArticleModel'

const initialState = new Articles()

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
 // console.log('columnId',columnId)
 // console.log('articleList',articleList)
  // state = state.set('articleList', articleList)
  // return state
  let _map = state.get('articleList')
  _map = _map.set(columnId, articleList)
  state = state.set('articleList',_map)
  return state
}

function handleAddLikers(state, action) {
  // let columnId = action.payload.columnId
  let articleId = action.payload.articleId
  let likerList = action.payload.likerList
  let _map = state.get('likerList')
  _map = _map.set(articleId, likerList)
  state = state.set('likerList',_map)
  return state

}

function handleAddComments(state, action) {
  // let columnId = action.payload.columnId
  let articleId = action.payload.articleId
  let commentList = action.payload.commentList
  // let articleList = state.get(columnId)
  // let article = articleList.find((value) => {return value.articleId == articleId})
  // let index = articleList.findIndex((value) => {return value.articleId == articleId})
  // article = article.set('comments', commentList)
  // articleList = articleList.update(index, val => article)
  // state = state.set(columnId, articleList)
  // //console.log('state======>',state)
  //
  // return state
 // let articleId = action.payload.articleId
  let _map = state.get('commentList')
  _map = _map.set(articleId, commentList)
  state = state.set('commentList',_map)
  return state
}