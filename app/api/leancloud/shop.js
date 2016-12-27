/**
 * Created by zachary on 2016/12/24.
 */
import AV from 'leancloud-storage'
import {Map, List, Record} from 'immutable'
import ERROR from '../../constants/errorCode'
import {
  ShopInfo,
} from '../../models/shopModel'

export function getShopList(payload) {
  let shopCategoryId = payload.shopCategoryId
  let sortId = payload.sortId // 0-智能,1-按好评,2-按距离
  let distance = payload.distance
  let geo = payload.geo
  let geoName = payload.geoName
  let isRefresh = payload.isRefresh
  let lastScore = payload.lastScore
  let lastGeo = payload.lastGeo

  let query = new AV.Query('Shop')
  if(shopCategoryId){
    //构建内嵌查询
    let innerQuery = new AV.Query('ShopCategory')
    innerQuery.equalTo('shopCategoryId', shopCategoryId)
    //执行内嵌查询
    query.matchesQuery('targetShopCategory', innerQuery)
  }

  //用 include 告知服务端需要返回的关联属性对应的对象的详细信息，而不仅仅是 objectId
  query.include('targetShopCategory')

  if(sortId == 1) {
    if(!isRefresh) { //分页查询
      query.skip(1)
      query.lessThanOrEqualTo('score', lastScore)
    }
    query.addDescending('score')
  }else if(sortId == 2) {
    if(!isRefresh) { //分页查询
      query.skip(1)
      query.lessThanOrEqualTo('geo', lastGeo)
    }
    query.addDescending('geo')
    query.addDescending('score')
  }else{
    if(!isRefresh) { //分页查询
      query.skip(1)
      query.lessThanOrEqualTo('score', lastScore)
    }
    query.addDescending('score')
    query.addDescending('geo')
  }

  

  query.limit(3) // 最多返回 3 条结果
  if(distance) {
    if (Array.isArray(geo)) {
      let point = new AV.GeoPoint(geo)
      query.withinKilometers('geo', point, distance)
    }
  }else {
    query.contains('geoName', geoName)
  }
  return query.find().then(function (results) {
    // console.log('getShopList.results=', results)
    let shopList = []
    results.forEach((result) => {
      shopList.push(ShopInfo.fromLeancloudObject(result))
    })
    return new List(shopList)
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}