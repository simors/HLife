/**
 * Created by yangyang on 2017/3/9.
 */

export function getAddress(state) {
  let location = state.CONFIG.location
  if (location) {
    let locJs = location.toJS()
    return locJs.address
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