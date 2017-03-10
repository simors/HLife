/**
 * Created by yangyang on 2017/3/9.
 */

export function getLocation(state) {
  let location = state.CONFIG.location
  if (location) {
    return location.toJS()
  }
  return {}
}

export function getGeopoint(state) {
  let location = state.CONFIG.location
  if (location) {
    let locJs = location.toJS()
    return {latitude: locJs.latitude, longitude: locJs.longitude}
  }
  return {latitude: 0, longitude: 0}
}

export function getAddress(state) {
  let location = state.CONFIG.location
  if (location) {
    let locJs = location.toJS()
    return locJs.address
  }
  return ""
}

export function getCountry(state) {
  let location = state.CONFIG.location
  if (location) {
    let locJs = location.toJS()
    return locJs.country
  }
  return ""
}

export function getProvince(state) {
  let location = state.CONFIG.location
  if (location) {
    let locJs = location.toJS()
    return locJs.province
  }
  return ""
}

export function getCity(state) {
  let location = state.CONFIG.location
  if (location) {
    let locJs = location.toJS()
    return locJs.city
  }
  return '全国'
}

export function getDistrict(state) {
  let location = state.CONFIG.location
  if (location) {
    let locJs = location.toJS()
    return locJs.district
  }
  return ""
}

export function getStreet(state) {
  let location = state.CONFIG.location
  if (location) {
    let locJs = location.toJS()
    return locJs.street
  }
  return ""
}

export function getStreetNumber(state) {
  let location = state.CONFIG.location
  if (location) {
    let locJs = location.toJS()
    return locJs.streetNumber
  }
  return ""
}