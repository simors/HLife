/**
 * Created by zachary on 2016/12/14.
 */
import {TopicCategoryItem} from '../models/ConfigModels'

export function getConfig(state) {
  return state.CONFIG
}

export function selectServicePhone(state) {
  return state.CONFIG.servicePhone
}

export function getBanners(state) {
  let config = getConfig(state)
  if (config) {
    return config.banners.toJS()
  }
  return undefined
}

export function getBanner(state, type) {
  let banner = getBanners(state)
  if (banner) {
    return banner[type]
  }
  return undefined
}

export function getAnnouncements(state) {
  let config = getConfig(state)
  if (config) {
    return config.announcements.toJS()
  }
  return undefined
}

export function getAnnouncement(state, type) {
  let announcements = getAnnouncements(state)
  if (announcements) {
    return announcements[type]
  }
  return undefined
}

export function getColumns(state) {
  let config = getConfig(state)
  if (config) {
    return config.column
  }
  return undefined
}

export function getColumn(state, type) {
  let columns = getColumns(state).column

  if (columns) {
    if (type && type.length > 0) {
      columns = columns.filter(column => column.type == type)
    }

    return columns
  }

  return undefined
}

export function getTopicCategoriesById(state, categoryId) {
  let config = getConfig(state)
  let topicCategories = config.topicCategories
  if (topicCategories) {
    let category = topicCategories.find((recode) => {
      if(recode.get('objectId') === categoryId)
        return true
      return false
    })
    if(category)
      return category.toJS()
  }
  return new TopicCategoryItem().toJS()
}

export function getTopicCategories(state) {
  let config = getConfig(state)
  if (config) {
    return config.topicCategories.toJS()
  }
  return undefined
}

export function selectShopCategories(state, num) {
  let config = getConfig(state)
  if (config) {
    let shopCategories = config.shopCategories.toJS()
    if (shopCategories) {
      if (num) {
        return shopCategories.slice(0, num)
      } else {
        return shopCategories
      }
    }
  }
  return undefined
}

export function selectProvincesAndCities(state) {
  let config = getConfig(state)
  if (config) {
    let provinceListWithCityList = config.provinceListWithCityList.toJS()
    return provinceListWithCityList || []
  }
  return []
}

export function selectSubArea(state, payload) {
  let level = payload.sublevel
  let province = payload.province
  let city = payload.city
  let retCity = []
  let retDistrict = []

  let config = getConfig(state)
  if (!config) {
    return undefined
  }

  let provinceListWithCityList = config.provinceListWithCityList.toJS()
  if (!provinceListWithCityList) {
    return undefined
  }

  // 获取省份底下的所有市
  if (level == 1) {
    let provinceData = provinceListWithCityList.find((subProvince) => {
      if (subProvince.area_name == province) {
        return true
      }
      return false
    })
    if (provinceData && provinceData.sub && provinceData.sub.length > 0) {
      provinceData.sub.forEach((subCity) => {
        retCity.push(subCity.area_name)
      })
    }
    return retCity
  }

  // 获取市下面的所有区县
  if (level == 2) {
    let provinceData = provinceListWithCityList.find((subProvince) => {
      if (subProvince.area_name == province) {
        return true
      }
      return false
    })
    if (provinceData && provinceData.sub && provinceData.sub.length > 0) {
      let cityData = provinceData.sub.find((subCity) => {
        if (subCity.area_name == city) {
          return true
        }
        return false
      })

      if (cityData && cityData.sub && cityData.sub.length > 0) {
        cityData.sub.forEach((subDistrict) => {
          retDistrict.push(subDistrict.area_name)
        })
      }
      return retDistrict
    }
  }

  return undefined
}