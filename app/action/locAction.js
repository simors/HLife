/**
 * Created by yangyang on 2017/3/9.
 */
import {createAction} from 'redux-actions'
import {Platform} from 'react-native'
import {Geolocation} from '../components/common/BaiduMap'
import * as DeviceInfo from 'react-native-device-info'
import * as configTypes from '../constants/configActionTypes'
import {abbrProvince, abbrCity} from '../util/Utils'

let updateGeolocation = createAction(configTypes.UPDATE_GEO_LOCATION)

export function getCurrentLocation() {
  return (dispatch, getState) => {
    if (DeviceInfo.isEmulator()) {
      let geoPoint = {latitude: 28.2239, longitude: 112.87857}
      let pos = {
        latitude: geoPoint.latitude,
        longitude: geoPoint.longitude,
        address: "湖南省长沙市岳麓区麓松路539号",
        country: "中国",
        province: "湖南",
        city: "长沙",
        district: "岳麓区",
        street: "麓松路",
        streetNumber: "539号",
      }
      dispatch(updateGeolocation({position: pos}))
    } else {
      Geolocation.getCurrentPosition().then(geoPoint => {
        if (Platform.OS == 'ios') {
          Geolocation.reverseGeoCode(geoPoint.latitude, geoPoint.longitude).then(position => {
            let pos = {
              latitude: geoPoint.latitude,
              longitude: geoPoint.longitude,
              address: position.address,
              country: position.country,
              province: abbrProvince(position.province),
              city: abbrCity(position.city),
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
            province: abbrProvince(geoPoint.province),
            city: abbrCity(geoPoint.city),
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