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
import {ArticleItem} from '../../models/ArticleModel'
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
    query.equalTo('Category', articleCategory)
    query.include(['user'])
    query.descending('createdAt')
  }
  return query.find().then(function (results) {
    console.log('results=============>',results)

    let article = []
    let like = []
    results.forEach((result) => {
      let articleItem=AV.Object.createWithoutData('Articles',result.id)
      console.log('articleItem=============>',articleItem)
      let relation =  articleItem.relation('likers')
      let queryLikers = relation.query()
      console.log('articleItem=============>',queryLikers)

      queryLikers.find().then(function (likersResult) {
        // likers.forEach()
        console.log('likers=============>',likersResult)
        //article.push(ArticleItem.fromLeancloudObject(result,queryLikers))

      })
      // article.push(ArticleItem.fromLeancloudObject(result))
    })

    return new List(article)
  }, function (err) {
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