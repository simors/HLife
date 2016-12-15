/**
 * Created by zachary on 2016/12/14.
 */
import {Map, List, Record} from 'immutable'

export const BannerItemConfig = Record({
  type: undefined,
  title: undefined,
  image: undefined
}, 'BannerItemConfig')

export class BannerItem extends BannerItemConfig {
  static fromLeancloudObject(lcObj) {
    console.log(lcObj)
    let bannerItemConfig = new BannerItemConfig()
    let attrs = lcObj.attributes
    return bannerItemConfig.withMutations((record) => {
      record.set('type', attrs.type)
      record.set('title', attrs.title)
      record.set('image', attrs.image)
    })
  }
}

export const Config = Record({
  banners: Map()
}, 'Config')



