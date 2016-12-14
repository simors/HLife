/**
 * Created by zachary on 2016/12/14.
 */
import {Map, List, Record} from 'immutable'

export const BannerItemConfig = Record({
  title: undefined,
  image: undefined
}, 'BannerItemConfig')

export const Config = Record({
  banners: Map()
}, 'Config')

