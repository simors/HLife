/**
 * Created by zachary on 2016/12/15.
 */
import AV from 'leancloud-storage'
import {Map, List, Record} from 'immutable'
import {
  BannerItem,
  AnnouncementItem,
  ColumnItem,
  TopicCategoryItem,
  ShopCategory,
} from '../../models/ConfigModels'
import {ArticleItem, LikersItem} from '../../models/ArticleModel'
import ERROR from '../../constants/errorCode'

export function getBanner(payload) {
  let type = payload.type
  let query = new AV.Query('Banners')
  query.equalTo('type', type)
  if (typeof payload.geo === 'object') {
    let point = new AV.GeoPoint(payload.geo);
    query.withinKilometers('geo', point, 10);
  }
  return query.find().then(function (results) {
    let banner = []
    results.forEach((result) => {
      banner.push(BannerItem.fromLeancloudObject(result))
    })
    return new List(banner)
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function getAnnouncement(payload) {
  let type = payload.type
  let query = new AV.Query('Announcement')
  query.equalTo('type', type)
  if (typeof payload.geo === 'object') {
    let point = new AV.GeoPoint(payload.geo);
    query.withinKilometers('geo', point, 10);
  }
  return query.find().then(function (results) {
    let announcement = []
    results.forEach((result) => {
      announcement.push(AnnouncementItem.fromLeancloudObject(result))
    })
    return new List(announcement)
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function getColumn() {

  let query = new AV.Query('ArticleCategory')

  // query.equalTo('type', type)
  return query.find().then(function (results) {
    let column = []
    results.forEach((result) => {
      column.push(ColumnItem.fromLeancloudObject(result))
    })
    return new List(column)
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function getTopicCategories() {
  let query = new AV.Query('TopicCategory')
  return query.find().then(function (results) {
    let topicCategories = []
    results.forEach((result) => {
      topicCategories.push(TopicCategoryItem.fromLeancloudObject(result))
    })
    return new List(topicCategories)
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}


export function getArticle(payload) {
  let query = new AV.Query('Articles')
  if (payload) {
    let categoryId = payload
    let articleCategory = AV.Object.createWithoutData('ArticleCategory', categoryId)
    console.log('getLikers.category=====', articleCategory)
    query.equalTo('Category', articleCategory)
    query.include(['user'])
    query.descending('createdAt')
  }
  return query.find().then((results) => {
    console.log('results=============>', results)
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
  console.log('ahahahahahahahaha',articleIdJson)
  return AV.Cloud.run('getArticleLikers', articleIdJson).then((datas) => {
    console.log('datas============>',datas)
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

export function getShopCategories(payload) {
  let query = new AV.Query('ShopCategory')
  query.equalTo('status', 1)
  //query.limit(payload.limit ? payload.limit : 5)
  return query.find().then(function (results) {
    let shopCategories = []
    results.forEach((result)=> {
      shopCategories.push(ShopCategory.fromLeancloudObject(result))
    })
    return new List(shopCategories)
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}