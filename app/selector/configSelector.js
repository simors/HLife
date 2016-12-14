/**
 * Created by zachary on 2016/12/14.
 */

export function getConfig(state) {
  return state.CONFIG.toJS()
}

export function getBanners(state) {
  return getConfig(state).banners
}

export function getBanner(state, type) {
  return getBanners(state)[type]
}
