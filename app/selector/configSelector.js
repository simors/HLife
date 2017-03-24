/**
 * Created by zachary on 2016/12/14.
 */

export function getConfig(state) {
  return state.CONFIG
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