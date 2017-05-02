/**
 * Created by zachary on 2016/12/15.
 */

import {createAction} from 'redux-actions'
import {Actions} from 'react-native-router-flux'
import * as ConfigActionTypes from '../constants/configActionTypes'
import * as lcConfig from '../api/leancloud/config'
const noUpdateVersion = createAction(ConfigActionTypes.FETCH_APP_NOUPDATE_VERSION)

export function fetchBanner(payload) {
  return (dispatch ,getState) => {
    lcConfig.getBanner(payload).then((banner) => {
      //console.log('fetchBanner,results=', banner)
      let updateBannerAction = createAction(ConfigActionTypes.UPDATE_CONFIG_BANNERS)
      dispatch(updateBannerAction({type: payload.type, banner: banner}))
    }).catch((error) => {
      if(payload.error){
        payload.error(error)
      }
    })
  }
}

export function fetchAnnouncement(payload) {
  return (dispatch, getState) => {
    lcConfig.getAnnouncement(payload).then((announcement) => {
      let updateAnnouncementAction = createAction(ConfigActionTypes.UPDATE_CONFIG_ANNOUNCEMENT)
      dispatch(updateAnnouncementAction({type: payload.type, announcement: announcement}))
    }).catch((error) => {
      if(payload.error) {
        payload.error(error)
      }
    })
  }
}


export function fetchColumn(payload) {
  return (dispatch, getState) => {
    lcConfig.getColumn().then((column) => {
      let updateColumnAction = createAction(ConfigActionTypes.UPDATE_CONFIG_COLUMN)
      dispatch(updateColumnAction({column: column}))
    }).catch((error) => {
      if(payload.error) {
        payload.error(error)
      }
    })
  }
}

export function getAllTopicCategories(payload) {
  return (dispatch, getState) => {
    lcConfig.getTopicCategories().then((topicCategories) => {
      let updateTopicsAction = createAction(ConfigActionTypes.UPDATE_CONFIG_TOPIC_CATEGORIES)
      dispatch(updateTopicsAction({topicCategories: topicCategories}))
    }).catch((error) => {
      if(payload.error) {
        payload.error(error)
      }
    })
  }
}

export function fetchShopCategories(payload) {
  return (dispatch, getState) => {
    lcConfig.getShopCategories(payload).then((shopCategories) => {
      let updateAction = createAction(ConfigActionTypes.UPDATE_CONFIG_SHOP_CATEGORIES)
      dispatch(updateAction({shopCategories: shopCategories}))
    }).catch((error) => {
      if(payload.error){
        payload.error(error)
      }
    })
  }
}

export function fetchAllProvincesAndCities(payload) {
  return (dispatch, getState) => {
    lcConfig.fetchAllProvincesAndCities(payload).then((results)=>{
      // console.log('action***fetchAllProvincesAndCities.results--->>>', results)
      let updateAction = createAction(ConfigActionTypes.UPDATE_PROVINCES_AND_CITIES)
      dispatch(updateAction({provinceListWithCityList: results}))
    }).catch((error) => {
      console.log('fetchAllProvincesAndCities.error--->>>', error)
    })
  }
}

export function fetchAppServicePhone(payload) {
  return (dispatch, getState) => {
    lcConfig.fetchAppServicePhone(payload).then((servicePhone)=>{
      let updateAction = createAction(ConfigActionTypes.FETCH_APP_SERVICE_PHONE_SUCCESS)
      dispatch(updateAction({servicePhone}))
      if(payload && payload.success) {
        payload.success(servicePhone)
      }
    }).catch((error) => {
      if(payload && payload.error) {
        payload.error(error)
      }
      console.log('fetchAppServicePhone.error--->>>', error)
    })
  }
}


export function fetchAppNoUpdate(payload) {
  // console.log('payload',payload)
  return (dispatch) => {
    dispatch(noUpdateVersion(payload))
  }
  //  return (dispatch)=>{
  //    // let updateAction = createAction(ConfigActionTypes.FETCH_APP_NOUPDATE_VERSION)
  //    console.log('payload++++++++++++',payload)
  //
  //    dispatch(noUpdateVersion(payload))
  // }
}

export function updateNetworkStatus(payload) {
  return (dispatch, getState) => {
    let updateNetworkStatus = createAction(ConfigActionTypes.UPDATE_NETWORK_STATUS)
    dispatch(updateNetworkStatus({networkStatus: payload.networkStatus}))
  }
}