/**
 * Created by yangyang on 2017/3/9.
 */
import {createAction} from 'redux-actions'
import {Platform} from 'react-native'
import {Geolocation} from '../components/common/BaiduMap'
import * as DeviceInfo from 'react-native-device-info'
import * as configTypes from '../constants/configActionTypes'

let updateGeolocation = createAction(configTypes.UPDATE_GEO_LOCATION)

export function getCurrentLocation() {
  return (dispatch, getState) => {
    if (DeviceInfo.isEmulator()) {
      let geoPoint = {latitude: 28.213866, longitude: 112.8186868}
      Geolocation.reverseGeoCode(geoPoint.latitude, geoPoint.longitude).then(position => {
        let pos = {
          latitude: geoPoint.latitude,
          longitude: geoPoint.longitude,
          address: position.address,
          country: position.country,
          province: position.province,
          city: position.city,
          district: position.district,
          street: Platform.OS == 'ios' ? position.streetName : position.street,
          streetNumber: position.streetNumber,
        }
        dispatch(updateGeolocation({position: pos}))
      })
    } else {
      Geolocation.getCurrentPosition().then(geoPoint => {
        if (Platform.OS == 'ios') {
          Geolocation.reverseGeoCode(geoPoint.latitude, geoPoint.longitude).then(position => {
            let pos = {
              latitude: geoPoint.latitude,
              longitude: geoPoint.longitude,
              address: position.address,
              country: position.country,
              province: position.province,
              city: position.city,
              district: position.district,
              street: position.streetName,
              streetNumber: position.streetNumber,
            }
            if (!pos.address) {
              console.log("Cann't get current geolocation!")
              return
            }
            dispatch(updateGeolocation({position: pos}))
          })
        } else {
          let pos = {
            latitude: geoPoint.latitude,
            longitude: geoPoint.longitude,
            address: geoPoint.address,
            country: geoPoint.country,
            province: geoPoint.province,
            city: geoPoint.city,
            district: geoPoint.district,
            street: geoPoint.street,
            streetNumber: geoPoint.streetNumber,
          }
          if (!pos.address) {
            console.log("Cann't get current geolocation!")
            return
          }
          dispatch(updateGeolocation({position: pos}))
        }
      })
    }
  }
}