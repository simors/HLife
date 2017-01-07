/**
 * Created by lilu on 2016/12/24.
 */

function getArticles(state) {
  return state.ARTICLE.toJS()
}

export function getArticleByCid(state, categoryId) {
  let articles = getArticles(state).get(categoryId)
  if (articles) {
    return articles.toJS()
  }

  return undefined
}

export function getArticleCollection(state) {
  let articles = state.ARTICLE.get('articleList')
  //console.log('articles======>',articles)
  return articles
 //  let articles = getArticles(state).articleList
 //  let articleArray = []
 //  articles.forEach((value, key) => {
 //    let articleItem = {}
 //    articleItem.id = key
 //    articleItem.articles = value
 //    articleArray.push(articleItem)
 //  })
 // // console.log('articleArray====>',articleArray)
 //  return articleArray
}



export function getArticleItem(state,articleId,categoryId)
{
  let articles= getArticles(state).articleList[categoryId] || []
 //console.log('articles====>',articles)
  if (articleId) {
    let articleItem = articles.find((value) => {
      return value.articleId == articleId
    })
    // console.log('articleItem====>',articleItem)
  return articleItem
  }
}

export function getLikerList(state,articleId,categoryId)
{
  return getArticles(state).likerList[articleId] || []
  //let likerList= articles.find((value) => {return value.articleId == articleId})
 // return selectShop(state).shopAnnouncements[shopId] || []


}

export function getcommentList(state,articleId,categoryId)
{
  //let commentList= getArticles(state).get('commentList')
  //let commentList= articles.find((value) => {return value.articleId == articleId})
  return getArticles(state).commentList[articleId] || []

  //return commentList
}

export function getcommentCount(state,articleId,categoryId) {
  return getArticles(state).commentsCount[articleId] || []
}

export function getUpCount(state,articleId,categoryId) {
  return getArticles(state).upCount[articleId] || []
}

export function getIsUp(state,articleId) {
//  console.log('=========>',articleId)
  return getArticles(state).isUp[articleId]
}
export function getIsFavorite(state,articleId) {
//  console.log('=========>',articleId)
  return getArticles(state).isFavorite[articleId]
}