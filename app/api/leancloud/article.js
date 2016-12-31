/**
 * Created by lilu on 2016/12/29.
 */

import {ArticleItem, LikersItem,ArticleComment} from '../../models/ArticleModel'
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
    let article = []
    results.forEach((result) => {
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

//根据ARTICLE的RELATION进行查询
export function getComment(payload) {
  let article = AV.Object.createWithoutData('Articles',payload)
  let relation = article.relation('comments')
  let query = relation.query()
  return query.find().then(function (results) {

    let comment = []
    results.forEach((result) => {
     // console.log('articleItem====>',result)

      comment.push(ArticleComment.fromLeancloudObject(result))
    })

    return new List(comment)
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function publishComment(payload) {
  let comments = AV.Object.extend('ArticleComment')
  let comment = new comments()

  var articleId = AV.Object.createWithoutData('Articles', payload.articleId);
  comment.set('author',payload.author)
  comment.set('articleId', articleId);
  comment.set('replyId', payload.replyId)
  comment.set('content', payload.content)

  return comment.save().then(function (comment) {
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}