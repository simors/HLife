/**
 * Created by zachary on 2016/12/14.
 */
import {Map, List, Record} from 'immutable'

export const BannerItemConfig = Record({
  type: undefined, //banner类型:0-home主页,1-local本地,...
  title: undefined,//banner标题
  image: undefined,//banner显示图片地址
  actionType: 'link',//点击banne图片动作类型
  action: undefined //点击banner图片动作
}, 'BannerItemConfig')

export class BannerItem extends BannerItemConfig {
  static fromLeancloudObject(lcObj) {
    let bannerItemConfig = new BannerItemConfig()
    let attrs = lcObj.attributes
    return bannerItemConfig.withMutations((record) => {
      record.set('type', attrs.type)
      record.set('title', attrs.title)
      record.set('image', attrs.image)
      record.set('actionType', attrs.actionType)
      record.set('action', attrs.action)
    })
  }
}

export const Config = Record({
  banners: Map()
}, 'Config')



