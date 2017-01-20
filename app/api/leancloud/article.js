/**
 * Created by lilu on 2016/12/29.
 */

import {ArticleItem, LikersItem,ArticleComment,Up,Favorite} from '../../models/ArticleModel'
import AV from 'leancloud-storage'
import {Map, List, Record} from 'immutable'

export function getArticle(payload) {
 // console.log('payload',payload)
  let query = new AV.Query('Articles')
  if (payload) {
    let categoryId = payload
    let articleCategory = AV.Object.createWithoutData('ArticleCategory', categoryId)
    //console.log('getLikers.category=====', articleCategory)
    query.equalTo('Category', articleCategory)
    query.equalTo('enable',true)
    query.include(['user'])
    query.descending('createdAt')
  }
  return query.find().then((results) => {
   // console.log('result-====>',results)

    let article = []
    results.forEach((result) => {
   //   console.log('result-====>=======',result)

      article.push(ArticleItem.fromLeancloudObject(result))
    })
   // console.log('article-====>',article)

    return new List(article)
  }, (err) => {
   // console.log(err)
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function getIsFavorite(payload) {
  let articleId = payload.articleId
  //let upType = payload.upType
  let article = AV.Object.createWithoutData('Articles', articleId)
  let currentUser = AV.User.current()
  let query = new AV.Query('ArticleFavorite')
  query.equalTo('article', article)
  query.equalTo('user', currentUser)
  //query.equalTo('status',true)
  query.include('user')
  //query.include('article')
  return query.first().then((result) =>{
   // console.log('result====>>>',result)

    let userUpShopInfo = undefined
    if(result && result.attributes) {
       //  console.log('result===>',result)
      userUpShopInfo = Favorite.fromLeancloudObject(result)
       // console.log('userUpShopInfo===>',userUpShopInfo)
    }
    return userUpShopInfo
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function favoriteArticle(payload) {
  let articleId = payload.articleId
  let article = AV.Object.createWithoutData('Articles', articleId)
  let currentUser = AV.User.current()
  return getIsFavorite(payload).then((userLikeTopicInfo) => {
    if (!userLikeTopicInfo) {
      let Favorite = AV.Object.extend('ArticleFavorite')
      let favorite = new Favorite()
      favorite.set('article', article)
      // favorite.set('upType', upType)
      favorite.set('user', currentUser)
      return favorite.save()
    }
    else if (userLikeTopicInfo.id && !userLikeTopicInfo.status) {
      console.log('hereiscodeupArticle====》',userLikeTopicInfo)
      let up = AV.Object.createWithoutData('ArticleFavorite', userLikeTopicInfo.id)
      up.set('status', true)
      return up.save()
    }
    return {
      code: '10107',
      message: '您已经收藏过该文章了'
    }
  }).then((result) => {
    if (result && '10107' == result.code) {
      return result
    }
    return {
      articleId: articleId,
      code: '10108',
      message: '成功收藏'
    }
  }).catch((err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function unFavoriteArticle(payload) {
//  console.log('hereiscode')
  let articleId = payload.articleId
  return getIsFavorite(payload).then((userLikeTopicInfo) => {
    if (userLikeTopicInfo && userLikeTopicInfo.id) {
      let up = AV.Object.createWithoutData('ArticleFavorite', userLikeTopicInfo.id)
      up.set('status', false)
      return up.save()
    }
    return {
      code: '10009',
      message: '您还没有收藏过该文章'
    }
  }).then((result) => {
    if (result && '10009' == result.code) {
      return result
    }
    return {
      articleId: articleId,
      code: '10010',
      message: '取消收藏成功'
    }
  }).catch((err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function getUps(payload) {
  //console.log('payload-=---=>',payload)
  let articleId = payload.articleId
  let upType = payload.upType
  let query = new AV.Query('Up')
  query.equalTo('targetId', articleId)
  query.equalTo('upType', upType)
  query.equalTo('status', true)
  query.include(['user'])
  return query.find().then((results) => {
    //console.log('results======>',results)

    let ups = []
    results.forEach((result) => {
      ups.push(Up.fromLeancloudObject(result))
    })
    return new List(ups)
  },(err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })

}

export function getCommentCount(payload) {
  let query = new AV.Query('ArticleComment')
  let articleId=payload

  let article = AV.Object.createWithoutData('Articles', articleId)

  query.equalTo('articleId',article)
 // console.log('payload=========>',articleId)
  query.equalTo('enable',true)
  return query.count().then((results) =>{
   // console.log('count==>',results)
   return results
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function getUpCount(payload) {
  let articleId = payload.articleId

  let upType = payload.upType
  let query = new AV.Query('Up')
  query.equalTo('upType', upType)
  query.equalTo('targetId', articleId)
  query.equalTo('status', true)
  return query.count().then((results)=> {
    return results
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function getIsUps(payload) {
//  console.log('payload====>',payload)
  let articleId = payload.articleId
  let upType = payload.upType
  let currentUser = AV.User.current()
  let query = new AV.Query('Up')
  query.equalTo('targetId', articleId)
  query.equalTo('upType', upType)
  query.equalTo('user', currentUser)
  //console.log('currentUser==>',currentUser)
  query.include('user')
  return query.first().then((result) =>{
    //console.log('result====>',result)
    let userUpShopInfo = undefined
    if(result && result.attributes) {
   //   console.log('result===>',result)
      userUpShopInfo = Up.fromLeancloudObject(result)
    //  console.log('userUpShopInfo===>',userUpShopInfo)
    }
    return userUpShopInfo
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}


export function upArticle(payload) {
 // console.log('hereiscodeupArticle====》',payload)
  let articleId = payload.articleId
  let upType = payload.upType
  let currentUser = AV.User.current()
  return getIsUps(payload).then((userLikeTopicInfo) => {
    if (!userLikeTopicInfo) {
      let Up = AV.Object.extend('Up')
      let up = new Up()
      up.set('targetId', articleId)
      up.set('upType', upType)
      up.set('user', currentUser)
      return up.save()
    }
    else if (userLikeTopicInfo.id && !userLikeTopicInfo.status) {
      let up = AV.Object.createWithoutData('Up', userLikeTopicInfo.id)
      up.set('status', true)
      return up.save()
    }
    return {
      code: '10107',
      message: '您已经赞过该文章了'
    }
  }).then((result) => {
    if (result && '10107' == result.code) {
      return result
    }
    return {
      articleId: articleId,
      code: '10108',
      message: '成功点赞'
    }
  }).catch((err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function unUpArticle(payload) {
//  console.log('hereiscode')
  let articleId = payload.articleId
  return getIsUps(payload).then((userLikeTopicInfo) => {
    if (userLikeTopicInfo && userLikeTopicInfo.id) {
      let up = AV.Object.createWithoutData('Up', userLikeTopicInfo.id)
      up.set('status', false)
      return up.save()
    }
    return {
      code: '10009',
      message: '您还没有赞过该话题'
    }
  }).then((result) => {
    if (result && '10009' == result.code) {
      return result
    }
    return {
      articleId: articleId,
      code: '10010',
      message: '取消点赞成功'
    }
  }).catch((err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

//根据ARTICLE的RELATION进行查询
export function getComment(payload) {
  //console.log('payload.......',payload)
  let article = AV.Object.createWithoutData('Articles',payload)
  let relation = article.relation('comments')
  let query = relation.query()
  query.equalTo('enable',true)
  query.include(['author'])
  query.include(['replyId'])
  query.include(['replyId.author'])
  return query.find().then(function (results) {

    let comment = []
    results.forEach((result) => {

      comment.push(ArticleComment.fromLeancloudObject(result))
    //  console.log('comment====>',comment)

    })

    return new List(comment)
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function submitArticleComment(payload) {
  //console.log('payload----->',payload)
  let articleId = payload.articleId
  let content = payload.content
  let replyId = payload.replyId
  let article = AV.Object.createWithoutData('Articles', articleId)
  let currentUser = AV.User.current()
 // console.log('user======>',currentUser)
  let reply = AV.Object.createWithoutData('ArticleComment', replyId)
  let ArticleComment = AV.Object.extend('ArticleComment')
  let articleComment = new ArticleComment()
  articleComment.set('author', currentUser)
  articleComment.set('articleId', article)
  articleComment.set('content', content)
  if (payload.replyId) {
    articleComment.set('replyId', reply)
  }
  return articleComment.save().then(function (result) {
    if (result) {
      let relation = article.relation('comments')
    //  console.log('result======>',relation)
      relation.add(articleComment)
    //  console.log('relation======>', relation)
      return article.save().then(function (data) {
      //  console.log('result======>',data)

      }, function (err) {
      //  console.log(err)
        err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
        throw err
      })
    }
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}