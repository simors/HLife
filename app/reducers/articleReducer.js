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
    case Types.ADD_UPS:
      return handleAddUps(state, action)
    case Types.ADD_UP_COUNT:
      return handleUpdateUpCount(state,action)
    case Types.UPDATE_ISUP:
      return handleUpdateIsUp(state,action)
    // case Types.UP_ARTICLE_SUCCESS:
    //   return handleUpArticle(state,action)
    // case Types.UNUP_ARTICLE_SUCCESS:
    //   return handleUnUpArticle(state,action)
    case Types.ADD_COMMENT:
      return handleAddComments(state,action)
    case Types.ADD_COMMENT_COUNT:
      return handleAddCommentsCount(state,action)
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

function handleAddUps(state, action) {
  // let columnId = action.payload.columnId
  let articleId = action.payload.articleId
  let upList = action.payload.upList
  let _map = state.get('upList')
  _map = _map.set(articleId, likerList)
  state = state.set('upList',_map)
  return state

}

function handleAddComments(state, action) {
  // let columnId = action.payload.columnId
  let articleId = action.payload.articleId
  let commentList = action.payload.commentList
  let _map = state.get('commentList')
  _map = _map.set(articleId, commentList)
  state = state.set('commentList',_map)
  return state
}

function handleAddCommentsCount(state, action) {
 let articleId = action.payload.articleId
  let commentsCount = action.payload.commentsCount
  let _map = state.get('commentsCount')
  _map = _map.set(articleId, commentsCount)
  state = state.set('commentsCount',_map)
  return state
}

function handleUpdateIsUp(state, action) {
  let payload = action.payload
  let articleId = payload.articleId
  let userUpInfo = payload.userUpInfo
  let _map = state.get('isUp')
  if(userUpInfo && userUpInfo.status)
  {
    _map = _map.set(articleId, true)
  }else{
    _map = _map.set(articleId, false)
  }
  state = state.set('isUp',  _map)
  return state
}

function handleUpdateUpCount(state,action){
  let articleId = action.payload.articleId
  let upCount = action.payload.upCount
  let _map = state.get('upCount')
  _map = _map.set(articleId, upCount)
  state = state.set('upCount',_map)
  return state
}

// function handleUpArticle(state,action){
//   let payload = action.payload
//   let articleId = payload.articleId
//   let _map = state.get('isUp')
//   _map = _map.set(articleId, true)
//   state = state.set('isUp', _map)
//   return state
// }
// function handleUnUpArticle(state,action){
//   let payload = action.payload
//   let articleId = payload.articleId
//   let _map = state.get('isUp')
//   _map = _map.set(articleId, false)
//   state = state.set('isUp', _map)
//   return state
// }