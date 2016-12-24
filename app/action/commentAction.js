/**
 * Created by lilu on 2016/12/24.
 */
import {createAction} from 'redux-actions'
import * as lcComment from '../api/leancloud/comments'
import * as commentsType from '../constants/commentActionTypes'


const addCommentArticleAction = createAction(commentsType.ADD_COMMENT_ARTICLE)

export function fetchCommentsArticle(payload) {
  return (dispatch, getState) => {
    let articleId = payload
    lcComment.getCommentArticle(payload).then((commentArticleList) => {
      dispatch(addCommentArticleAction({articleId: articleId, commentArticleList: commentArticleList}))
    }).catch((error) => {
      if(payload.error) {
        payload.error(error)
      }
    })
  }
}