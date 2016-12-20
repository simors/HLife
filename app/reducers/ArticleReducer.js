import {Map, Record,List} from 'immutable'
import {REHYDRATE} from 'redux-persist/constants'
import * as ConfigActionTypes from '../constants/configActionTypes'
import {Config, BannerItemConfig,ColumnItemConfig} from '../models/ArticleModels.js'

const initialState = Articles()
export default function ArticleReduce(state = initialState, action) {
  switch (action.type) {
    case ConfigActionTypes.UPDATE_CONFIG_TOPICS:
      return handleUpdateArticles(state, action)
    default:
      return state
  }
}

function handleUpdateArticles(state, action) {
  let payload = action.payload
  // let type = payload.type
  // let columnMap = new Map()
  // columnMap = columnMap.set(type, payload.column)
  state = state.set('Article', payload)

  return state
}

export const Articles = Record({

  article: List(),

}, 'Articles')