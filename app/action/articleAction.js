/**
 * Created by lilu on 2016/12/24.
 */
import {createAction} from 'redux-actions'
import * as laArticle from '../api/leancloud/article'
import * as articleTypes from '../constants/articleActionTypes'

const addArticleAction = createAction(articleTypes.ADD_ARTICLES)
const addLikersAction = createAction(articleTypes.ADD_LIKERS)
const addCommentAction = createAction(articleTypes.ADD_COMMENT)

export function fetchArticle(payload) {
  return (dispatch, getState) => {
    let columnId = payload
    laArticle.getArticle(payload).then((articleList) => {
 //     console.log('articleListh======>',articleList)
      dispatch(addArticleAction({columnId: columnId, articleList: articleList}))
    }).catch((error) => {
      if(payload.error) {
        payload.error(error)
      }
    })
  }
}

export function fetchLikers(articleId,columnId) {
 // console.log('<><><><><>fetchLikers',payload)
  return (dispatch, getState) => {
   // let articleId = payload
    laArticle.getLikers(articleId).then((likersList) => {
   //   console.log('likersList======>',likersList)
      dispatch(addLikersAction({articleId: articleId, likersList: likersList,columnId: columnId}))
    }).catch((error) => {
      if(payload.error) {
        payload.error(error)
      }
    })
  }
}


export function fetchCommentsArticle(payload) {
  return (dispatch, getState) => {
    let articleId = payload
    laArticle.getComment(payload).then((commentArticleList) => {
      dispatch(addCommentAction({articleId: articleId, commentArticleList: commentArticleList,columnId:columnId}))
    }).catch((error) => {
      if(payload.error) {
        payload.error(error)
      }
    })
  }
}