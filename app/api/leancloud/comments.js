/**
 * Created by lilu on 2016/12/24.
 */
import AV from 'leancloud-storage'
import {Map, List, Record} from 'immutable'
import {
  ArticleCommentItem
} from '../../models/CommentModel'
import {ArticleItem} from '../../models/ArticleModel'
import ERROR from '../../constants/errorCode'

export function getCommentArticle(payload) {
  let query = new AV.Query('ArticleComment')
  if (payload) {
    let articleId = payload
    let commentForArticle = AV.Object.createWithoutData('Articles', articleId)
    query.equalTo('articleId', commentForArticle)
  }
  return query.find().then(function (results) {
    let comment = []
    results.forEach((result) => {
      comment.push(ArticleCommentItem.fromLeancloudObject(result))
    })

    return new List(comment)
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function publishCommentArticle(payload) {
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