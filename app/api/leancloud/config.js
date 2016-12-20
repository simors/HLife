/**
 * Created by zachary on 2016/12/15.
 */
import AV from 'leancloud-storage'
import {Map, List, Record} from 'immutable'
import {BannerItem, AnnouncementItem,ColumnItem, TopicsItem} from '../../models/ConfigModels'
import ERROR from '../../constants/errorCode'

export function getBanner(payload) {
  let type = payload.type
  let query = new AV.Query('Banners')
  query.equalTo('type', type)
  if(typeof payload.geo === 'object') {
    let point = new AV.GeoPoint(payload.geo);
    query.withinKilometers('geo', point, 10);
  }
  return query.find().then(function(results){
    let banner = []
    results.forEach((result) => {
      banner.push(BannerItem.fromLeancloudObject(result))
    })
    return new List(banner)
  }, function(err){
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function getAnnouncement(payload) {
  let type = payload.type
  let query = new AV.Query('Announcement')
  query.equalTo('type', type)
  if(typeof payload.geo === 'object') {
    let point = new AV.GeoPoint(payload.geo);
    query.withinKilometers('geo', point, 10);
  }
  return query.find().then(function(results) {
    let announcement = []
    results.forEach((result) => {
      announcement.push(AnnouncementItem.fromLeancloudObject(result))
    })
    return new List(announcement)
  }, function(err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function getColumn() {

  let query = new AV.Query('ArticleCategory')

   // query.equalTo('type', type)
    return query.find().then(function(results) {
      let column = []
      console.log('===========>',results)
      results.forEach((result) => {
        column.push(ColumnItem.fromLeancloudObject(result))
      })
      console.log('===========>',column)
      return new List(column)
    }, function(err) {
      err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
      throw err
    })
}

export function getTopics() {
  let query = new AV.Query('Topics')
  return query.find().then(function(results) {
    let topics = []
    results.forEach((result) => {
      topics.push(TopicsItem.fromLeancloudObject(result))
    })
    return new List(topics)
  }, function(err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function getPickedTopics(payload) {
  let isPicked = payload.isPicked
  let query = new AV.Query('Topics')
  query.equalTo('isPicked', isPicked)
  return query.find().then(function(results) {
    let topics = []
    results.forEach((result) => {
      topics.push(TopicsItem.fromLeancloudObject(result))
    })
    return new List(topics)
  }, function(err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}