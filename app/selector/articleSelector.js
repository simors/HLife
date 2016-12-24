/**
 * Created by lilu on 2016/12/24.
 */

export function getArticles(state) {
  return state.ARTICLE
}

export function getArticle(state, categoryId) {
  let articles = getArticles(state).get(categoryId)
  if (articles) {
    return articles.toJS()
  }

  return undefined
}