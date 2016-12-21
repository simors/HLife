import {createAction} from 'redux-actions'
import {Actions} from 'react-native-router-flux'
import * as ConfigActionTypes from '../constants/configActionTypes'
import * as lcArticle from '../api/leancloud/Article'



export function fetchAticle() {
  return (dispatch, getState) => {
    lcArticle.getArticles().then((article) => {
      let updateColumnAction = createAction(ArticleActionTypes.UPDATE_ARTICLE)
      dispatch(updateColumnAction({article: article}))
    }).catch((error) => {
      if(payload.error) {
        payload.error(error)
      }
    })
  }
}