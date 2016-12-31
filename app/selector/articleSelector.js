/**
 * Created by lilu on 2016/12/24.
 */

function getArticles(state) {
  return state.ARTICLE
}

export function getArticleByCid(state, categoryId) {
  let articles = getArticles(state).get(categoryId)
  if (articles) {
    return articles.toJS()
  }

  return undefined
}

export function getArticleCollection(state) {
  let articles = getArticles(state)
  let articleArray = []
  articles.forEach((value, key) => {
    let articleItem = {}
    articleItem.id = key
    articleItem.articles = value.toJS()
    articleArray.push(articleItem)
  })
 // console.log('articleArray====>',articleArray)
  return articleArray
}

export function getArticleItem(state,articleId,categoryId)
{
  let articles= getArticles(state).get('article')
 //console.log('articles====>',articles)
  let articleItem= articles.find((value) => {return value.articleId == articleId})
 // console.log('articleItem====>',articleItem)

  return articleItem
}

export function getLikerList(state,articleId,categoryId)
{
  let likerList= getArticles(state).get('liker')
  //let likerList= articles.find((value) => {return value.articleId == articleId})

  return likerList
}

export function getcommentList(state,articleId,categoryId)
{
  let commentList= getArticles(state).get('comments')
  //let commentList= articles.find((value) => {return value.articleId == articleId})

  return commentList
}