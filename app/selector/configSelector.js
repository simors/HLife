/**
 * Created by zachary on 2016/12/14.
 */

export function getConfig(state) {
  return state.CONFIG.toJS()
}

export function getBanners(state) {
  return getConfig(state).banners
}

export function getBanner(state, type) {
  return getBanners(state)[type]
}

export function getAnnouncements(state) {
  return getConfig(state).announcements
}

export function getAnnouncement(state, type) {
  return getAnnouncements(state)[type]
}

export function getColumns(state) {
  return getConfig(state).column
}

export function getColumn(state, type) {
  let columns = getColumns(state).column

  if (columns) {
    if (type && type.length > 0) {
      columns = columns.filter(column => column.type == type)
    }

    return columns.toJS()
  }

  return undefined
}

export function getTopicCategories(state) {
  return getConfig(state).topicCategories
}

export function selectShopCategories(state, num) {
  if (num) {
    return getConfig(state).shopCategories.slice(0, num)
  }
  return getConfig(state).shopCategories
}