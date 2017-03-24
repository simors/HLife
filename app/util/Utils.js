import {
  Platform,
} from 'react-native'
import {Geolocation} from '../components/common/BaiduMap'
import * as DeviceInfo from 'react-native-device-info'

/**
 * 用户(userId)是否在指定用户的关注列表中,
 * ture: 已关注
 * false: 未关注
 *
 * @param phone
 */
export function userIsFollowedTheUser(userId, userFollowees) {
  if(userFollowees && userFollowees.length) {
    for(let i = 0; i < userFollowees.length; i++) {
      if(userFollowees[i].id == userId) {
        return true
      }
    }
    return false
  }
}

/**
 * 获取用户当前地理位置信息
 *
 * @returns {Promise}
 */
export function getCurrentPositionInfo() {
  return new Promise((resolve, reject)=>{
    // console.log("DeviceInfo.isEmulator===", DeviceInfo.isEmulator())
    if(DeviceInfo.isEmulator()) {
      resolve({
        geo: [28.213866,112.8186868],
        geoCity: '长沙'
      })
    }else {
      Geolocation.getCurrentPosition()
        .then(data => {
          // console.log('getCurrentPosition.data====', data)
          let geo = [data.latitude, data.longitude]
          let geoCity = ''
          if (Platform.OS == 'ios') {
            Geolocation.reverseGeoCode(data.latitude, data.longitude)
              .then(response => {
                geoCity = response.city
                resolve({
                  geo: geo,
                  geoCity: geoCity
                })
              })
          }else {
            geoCity = data.city
            resolve({
              geo: geo,
              geoCity: geoCity
            })
          }
        }, (reason)=>{
          resolve({
            geo: [28.213866,112.8186868],
            geoCity: '长沙'
          })
        })
    }
  })
}

export function getProvinceCode(treeData = [], provinceName = "") {
  if(treeData && treeData.length && provinceName) {
    for(let i = 0; i < treeData.length; i++) {
      if(provinceName == treeData[i].area_name) {
        return treeData[i].area_code
      }
    }
  }
  return {}
}

export function getCityCode(treeData = [], cityName = "") {
  if(treeData && treeData.length && cityName) {
    let cityList = getAllCityList(treeData)
    if(cityList && cityList.length) {
      for(let i = 0; i < cityList.length; i++) {
        if(cityName == cityList[i].area_name) {
          return cityList[i].area_code
        }
      }
    }
  }
  return {}
}

export function getDistrictCode(treeData = [], districtName = '') {
  if(treeData && treeData.length && districtName) {
    let districtList = getAllDistrictList(treeData)
    if(districtList && districtList.length) {
      for(let i = 0; i < districtList.length; i++) {
        if(districtName == districtList[i].area_name) {
          return districtList[i].area_code
        }
      }
    }
  }
  return {}
}

export function getAllCityList(treeData = []) {
  let cityList = []
  if(treeData && treeData.length) {
    treeData.forEach((item) => {
      if(item.sub && item.sub.length) {
        cityList = cityList.concat(item.sub)
      }
    })
  }
  return cityList
}

export function getAllDistrictList(treeData = []) {
  let districtList = []
  let cityList = getAllCityList(treeData)
  if(cityList && cityList.length) {
    cityList.forEach((item) => {
      if(item.sub && item.sub.length) {
        districtList = districtList.concat(item.sub)
      }
    })
  }
  return districtList
}
