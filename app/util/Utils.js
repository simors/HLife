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

export function abbrProvince(province) {
  if (!province || province == '') {
    return ''
  }
  let newProvince = province
  if (province.endsWith('省')) {
    newProvince = province.substring(0, province.lastIndexOf('省'))
  } else if (province.endsWith('市')) {
    newProvince = province.substring(0, province.lastIndexOf('市'))
  } else if (province.startsWith('新疆')) {
    newProvince = '新疆'
  } else if (province.startsWith('广西')) {
    newProvince = '广西'
  } else if (province.startsWith('宁夏')) {
    newProvince = '宁夏'
  } else if (province.startsWith('内蒙古')) {
    newProvince = '内蒙古'
  } else if (province.startsWith('西藏')) {
    newProvince = '西藏'
  } else if (province.startsWith('澳门')) {
    newProvince = '澳门'
  } else if (province.startsWith('香港')) {
    newProvince = '香港'
  }
  return newProvince
}

export function abbrCity(city) {
  if (!city || city == '') {
    return ''
  }
  let newCity = city
  if (city.endsWith('市')) {
    newCity = city.substring(0, city.lastIndexOf('市'))
  } else if (city.endsWith('地区')) {
    newCity = city.substring(0, city.lastIndexOf('地区'))
  } else if (city.startsWith('临夏')) {
    newCity = '临夏'
  } else if (city.startsWith('甘南')) {
    newCity = '甘南'
  } else if (city.startsWith('延边')) {
    newCity = '延边'
  } else if (city.startsWith('海西')) {
    newCity = '海西'
  } else if (city.startsWith('海北')) {
    newCity = '海北'
  } else if (city.startsWith('海南')) {
    newCity = '海南'
  } else if (city.startsWith('黄南')) {
    newCity = '黄南'
  } else if (city.startsWith('玉树')) {
    newCity = '玉树'
  } else if (city.startsWith('果洛')) {
    newCity = '果洛'
  } else if (city.startsWith('克孜勒苏柯尔克孜')) {
    newCity = '克孜勒'
  } else if (city.startsWith('巴音郭楞')) {
    newCity = '巴音郭楞'
  } else if (city.startsWith('博尔塔拉')) {
    newCity = '博尔塔拉'
  } else if (city.startsWith('伊犁')) {
    newCity = '伊犁'
  } else if (city.startsWith('昌吉')) {
    newCity = '昌吉'
  } else if (city.startsWith('恩施')) {
    newCity = '恩施'
  } else if (city.startsWith('神农架')) {
    newCity = '神农架'
  } else if (city.startsWith('保亭')) {
    newCity = '保亭'
  } else if (city.startsWith('昌江')) {
    newCity = '昌江'
  } else if (city.startsWith('陵水')) {
    newCity = '陵水'
  } else if (city.startsWith('琼中')) {
    newCity = '琼中'
  } else if (city.startsWith('乐东')) {
    newCity = '乐东'
  } else if (city.startsWith('白沙')) {
    newCity = '白沙'
  } else if (city.startsWith('锡林郭勒')) {
    newCity = '锡林郭勒'
  } else if (city.startsWith('黔南')) {
    newCity = '黔南'
  } else if (city.startsWith('黔东')) {
    newCity = '黔东'
  } else if (city.startsWith('黔西')) {
    newCity = '黔西'
  } else if (city.startsWith('湘西')) {
    newCity = '湘西'
  } else if (city.startsWith('楚雄')) {
    newCity = '楚雄'
  } else if (city.startsWith('红河')) {
    newCity = '红河'
  } else if (city.startsWith('西双版纳')) {
    newCity = '西双版纳'
  } else if (city.startsWith('大理')) {
    newCity = '大理'
  } else if (city.startsWith('怒江')) {
    newCity = '怒江'
  } else if (city.startsWith('迪庆')) {
    newCity = '迪庆'
  } else if (city.startsWith('德宏')) {
    newCity = '德宏'
  } else if (city.startsWith('文山')) {
    newCity = '文山'
  } else if (city.startsWith('甘孜')) {
    newCity = '甘孜'
  } else if (city.startsWith('凉山')) {
    newCity = '凉山'
  } else if (city.startsWith('阿坝')) {
    newCity = '阿坝'
  } else if (city.startsWith('彭水')) {
    newCity = '彭水'
  } else if (city.startsWith('秀山')) {
    newCity = '秀山'
  } else if (city.startsWith('酉阳')) {
    newCity = '酉阳'
  } else if (city.startsWith('石柱')) {
    newCity = '石柱'
  } else if (city.startsWith('酉阳')) {
    newCity = '酉阳'
  }
  return newCity
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
                  geoCity: abbrCity(geoCity)
                })
              })
          }else {
            geoCity = data.city
            resolve({
              geo: geo,
              geoCity: abbrCity(geoCity)
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
