import AV from 'leancloud-storage'
import {Map, List, Record} from 'immutable'
import {ArticleItem} from '../../models/ArticleModelsModels'
import ERROR from '../../constants/errorCode'


export function getArticles(payload){
  let Category = AV.Object.createWithoutData('ArticleCategory',payload.objectId)
  let query = new AV.Query('Article')
  if(payload.Category){

    query.equalTo('Category.title')
  return query.find().then(function(results) {
    let article = []
    results.forEach((result) => {
      articles.push(ArticleItem.fromLeancloudObject(result))
    })
    return new List(articles)
  }, function(err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
})
}
}