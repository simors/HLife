/**
 * Created by yangyang on 2017/3/9.
 */
import {createAction} from 'redux-actions'
import {Platform} from 'react-native'
import {Geolocation} from '../components/common/BaiduMap'
import AV from 'leancloud-storage'
import * as configTypes from '../constants/configActionTypes'

let updateGeolocation = createAction(configTypes.UPDATE_GEO_LOCATION)

export function getCurrentLocation() {
  return (dispatch, getState) => {
    AV.GeoPoint.current().then((geoPoint) => {
      console.log("getCurrentLocation", geoPoint)
      if (geoPoint) {
        Geolocation.reverseGeoCode(geoPoint.latitude, geoPoint.longitude).then((position) => {
          console.log('position: ', position)
          let pos = {
            latitude: geoPoint.latitude,
            longitude: geoPoint.longitude,
            address: position.address,
            country: position.country,
            province: position.province,
            city: position.city,
            district: position.district,
            street: Platform.OS === 'ios' ? position.streetName : position.street,
            streetNumber: position.streetNumber,
          }
          dispatch(updateGeolocation({position: pos}))
        })
      }
    })
  }
}