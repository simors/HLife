/**
 * Created by zachary on 2016/12/15.
 */

import {createAction} from 'redux-actions'
import {Actions} from 'react-native-router-flux'
import * as ConfigActionTypes from '../constants/configActionTypes'
import * as lcConfig from '../api/leancloud/config'

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