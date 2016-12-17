import {Map, List} from 'immutable'
import {REHYDRATE} from 'redux-persist/constants'
import * as ConfigActionTypes from '../constants/configActionTypes'
import {Config, BannerItemConfig,ColumnItemConfig} from '../models/ConfigModels'

const initialState = Config()

export default function configReducer(state = initialState, action) {
  switch (action.type) {
    case ConfigActionTypes.UPDATE_CONFIG_BANNERS:
      return handleUpdateConfigBanners(state, action)
    case ConfigActionTypes.UPDATE_CONFIG_ANNOUNCEMENT:
      return handleUpdateConfigAnnouncements(state, action)
    case ConfigActionTypes.UPDATE_CONFIG_COLUMN:
      return handleUpdateConfigColumns(state,action)
    case ConfigActionTypes.UPDATE_CONFIG_TOPICS:
      return handleUpdateConfigTopics(state, action)
    default:
      return state
  }
}

function initConfig(payload) {
  let record = Config()
  if(payload) {
    record = record.withMutations((config) => {
      if(payload.banners) {
        config.set('banners', initBanners(payload.banners))
      }
      if(payload.columns) {
        config.set('columns', initColumns(payload.columns))
      }
      if(payload.topics) {
        config.set('topics', initTopics(payload.topics))
      }
    })
  }
  return record
}

function initBanners(banners) {
  let bannerMap = new Map()
  if(banners) {
    for(let type in banners) {
      bannerMap = bannerMap.set(type, initBanner(banners[type]))
    }
  }
  return bannerMap
}

function initBanner(banner) {
  let bannerItems = []
  banner.map((bannerItem) => {
    bannerItems.push(new BannerItemConfig(bannerItem))
  })
  return new List(bannerItems)
}

function handleUpdateConfigBanners(state, action) {
  let payload = action.payload
  let type = payload.type
  let bannerMap = new Map()
  bannerMap = bannerMap.set(type, payload.banner)
  state = state.set('banners',  bannerMap)
  return state
}

function handleUpdateConfigAnnouncements(state, action) {
  let payload = action.payload
  let type = payload.type
  let announcementMap = new Map()
  announcementMap = announcementMap.set(type, payload.announcement)
  state = state.set('announcements', announcementMap)
  return state
}

function handleUpdateConfigTopics(state, action) {
  let payload = action.payload
  let isPicked = payload.isPicked
  let topicsMap = new Map()
  topicsMap = topicsMap.set(isPicked, payload.topics)
  state = state.set('topics', topicsMap)
  return state
}

function initTopics(topics) {
  let topicsMap = new Map()
  if(topics) {
    for(let isPicked in topics) {
      topicsMap = topicsMap.set(isPicked, initTopic(topics[isPicked]))
    }
  }
  return topicsMap
}

function initTopic(topic) {
  let topicItems = []
  topic.map((topicItem) => {
    topicItems.push(new ColumnItemConfig(topicItem))
  })
  return new List(topicItems)
}

function handleUpdateConfigColumns(state, action) {
  let payload = action.payload
 // let type = payload.type
  // let columnMap = new Map()
  // columnMap = columnMap.set(type, payload.column)
  state = state.set('column', payload)
  return state
}

function initColumns(columns) {
  let columnMap = new Map()
  if(columns) {
    for(let type in columns) {
      columnMap = columnMap.set(type, initColumn(columns[type]))
    }
  }
  return columnMap
}

function initColumn(column) {
  let columnItems = []
  column.map((columnItem) => {
    columnItems.push(new ColumnItemConfig(columnItem))
  })
  return new List(columnItems)
}

function onRehydrate(state, action) {
  var incoming = action.payload.CONFIG
  if (!incoming) return state

  return incoming
}