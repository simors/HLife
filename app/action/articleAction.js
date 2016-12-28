/**
 * Created by lilu on 2016/12/24.
 */
import {createAction} from 'redux-actions'
import * as lcConfig from '../api/leancloud/config'
import * as articleTypes from '../constants/articleActionTypes'

const addArticleAction = createAction(articleTypes.ADD_ARTICLES)
const addLikersAction = createAction(articleTypes.ADD_LIKERS)

export function fetchArticle(payload) {
  return (dispatch, getState) => {
    let columnId = payload
    lcConfig.getArticle(payload).then((articleList) => {
 //     console.log('articleListh======>',articleList)
      dispatch(addArticleAction({columnId: columnId, articleList: articleList}))
    }).catch((error) => {
      if(payload.error) {
        payload.error(error)
      }
    })
  }
}

export function fetchLikers(payload) {
  console.log('<><><><><>fetchLikers',payload)
  return (dispatch, getState) => {
    let articleId = payload
    lcConfig.getLikers(payload).then((likersList) => {
      console.log('likersList======>',likersList)
      dispatch(addLikersAction({articleId: articleId, likersList: likersList}))
    }).catch((error) => {
      if(payload.error) {
        payload.error(error)
      }
    })
  }
}