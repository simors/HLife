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
    case ConfigActionTypes.UPDATE_PROVINCES_AND_CITIES:
      return handleUpdateProvincesAndCities(state, action)
    case ConfigActionTypes.FETCH_APP_SERVICE_PHONE_SUCCESS:
      return handleFetchAppServicePhoneSuccess(state, action)
    case ConfigActionTypes.FETCH_APP_NOUPDATE_VERSION:
      return handleFetchAppNoUpdateVersion(state,action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function handleFetchAppServicePhoneSuccess(state, action) {
  let payload = action.payload
  let servicePhone = payload.servicePhone
  state = state.set('servicePhone', servicePhone)
  return state
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

function handleUpdateProvincesAndCities(state, action) {
  let payload = action.payload
  let provinceListWithCityList = payload.provinceListWithCityList
  state = state.set('provinceListWithCityList', new List(provinceListWithCityList))
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
function handleFetchAppNoUpdateVersion(state,action) {
  // console.log('===============+>',action.payload)
  state = state.set('noUpdateVersion',action.payload.noUpdateVersion)
  return state
}

function onRehydrate(state, action) {
  var incoming = action.payload.CONFIG
  if (!incoming) return state

  let position = incoming.location
  if (position) {
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
  }

  let provinceListWithCityList = incoming.provinceListWithCityList
  // console.log('onRehydrate.provinceListWithCityList=====', provinceListWithCityList)
  if(provinceListWithCityList) {
    state = state.set('provinceListWithCityList', new List(provinceListWithCityList))
  }
  let noUpdateVersion = incoming.noUpdateVersion
  if(noUpdateVersion){
    state = state.set('noUpdateVersion',noUpdateVersion)
  }
  
  return state
}