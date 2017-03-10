import {Map, List} from 'immutable'
import {REHYDRATE} from 'redux-persist/constants'
import * as ConfigActionTypes from '../constants/configActionTypes'
import {Config, BannerItemConfig,ColumnItemConfig,ArticleItemConfig, LocationRecord} from '../models/ConfigModels'

const initialState = Config()

export default function configReducer(state = initialState, action) {
  switch (action.type) {
    case ConfigActionTypes.UPDATE_CONFIG_BANNERS:
      return handleUpdateConfigBanners(state, action)
    case ConfigActionTypes.UPDATE_CONFIG_ANNOUNCEMENT:
      return handleUpdateConfigAnnouncements(state, action)
    case ConfigActionTypes.UPDATE_CONFIG_COLUMN:
      return handleUpdateConfigColumns(state,action)
    case ConfigActionTypes.UPDATE_CONFIG_TOPIC_CATEGORIES:
      return handleUpdateConfigTopicCategories(state, action)
    case ConfigActionTypes.UPDATE_CONFIG_SHOP_CATEGORIES:
      return handleUpdateConfigShopCategories(state, action)
    case ConfigActionTypes.UPDATE_GEO_LOCATION:
      return handleUpdateGeolocation(state, action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function handleUpdateConfigBanners(state, action) {
  let payload = action.payload
  let type = payload.type
  let _map = state.get('banners')
  _map = _map.set(type, payload.banner)
  state = state.set('banners',  _map)
  return state
}

function handleUpdateConfigAnnouncements(state, action) {
  let payload = action.payload
  let type = payload.type
  let _map = state.get('announcements')
  _map = _map.set(type, payload.announcement)
  state = state.set('announcements',  _map)
  return state
}

function handleUpdateConfigTopicCategories(state, action) {
  let payload = action.payload
  state = state.set('topicCategories', payload.topicCategories)
  return state
}

function handleUpdateConfigColumns(state, action) {
  let payload = action.payload
  state = state.set('column', payload)
  return state
}

function handleUpdateConfigShopCategories(state, action) {
  // console.log('handleUpdateConfigShopCategories=', action)
  let payload = action.payload
  let shopCategories = payload.shopCategories
  //console.log('handleUpdateConfigShopCategories.12=', shopCategories)
  state = state.set('shopCategories', shopCategories)
  return state
}

function handleUpdateGeolocation(state, action) {
  let position = action.payload.position
  let location = new LocationRecord({
    latitude: position.latitude,
    longitude: position.longitude,
    address: position.address,
    country: position.country,
    province: position.province,
    city: position.city,
    district: position.district,
    street: position.street,
    streetNumber: position.streetNumber,
  })
  state = state.set('location', location)
  return state
}

function onRehydrate(state, action) {
  var incoming = action.payload.CONFIG
  if (!incoming) return state

  return state
}