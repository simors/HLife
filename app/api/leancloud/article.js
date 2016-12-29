/**
 * Created by lilu on 2016/12/29.
 */

import {ArticleItem, LikersItem} from '../../models/ArticleModel'
import AV from 'leancloud-storage'
import {Map, List, Record} from 'immutable'

export function getArticle(payload) {
  let query = new AV.Query('Articles')
  if (payload) {
    let categoryId = payload
    let articleCategory = AV.Object.createWithoutData('ArticleCategory', categoryId)
   // console.log('getLikers.category=====', articleCategory)
    query.equalTo('Category', articleCategory)
    query.include(['user'])
    query.descending('createdAt')
  }
  return query.find().then((results) => {
   // console.log('results=============>', results)
    let article = []
    results.forEach((result) => {
      // console.log('resultId=========>', result.id)
      // getLikers(result.id).then((likersList) => {
      //   console.log('likersList', likersList)
      //   article.push(ArticleItem.fromLeancloudObject(result, likersList))
      // })
      article.push(ArticleItem.fromLeancloudObject(result))

    })

    return new List(article)
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function getLikers(payload) {
  let articleIdJson = {
    articleId: payload
  }
  let likers = []
  //console.log('ahahahahahahahaha',articleIdJson)
  return AV.Cloud.run('getArticleLikers', articleIdJson).then((datas) => {
    //console.log('datas============>',datas)
    datas.forEach((data)=> {
      likers.push(data)
    })
    // console.log('likers=============================>', likers)
    return likers
  }, (err) => {
    console.log(err)

    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}