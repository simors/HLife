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

export function getArticles(state) {
  return getConfig(state).article
}

export function getArticle(state, category) {
  let articles = getArticles(state).article

  if (articles) {
    if (category && category.length > 0) {
      articles = articles.filter(article => article.category == category)
    }
    console.log('=========>',articles)
    return articles.toJS()
  }

  return undefined
}


export function getTopics(state) {
  return getConfig(state).topics
}

export function getTopic(state) {
  return getTopics(state)[true]
}

export function selectShopCategories(state) {
  return getConfig(state).shopCategories
}