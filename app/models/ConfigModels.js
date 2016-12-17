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

export const AnnouncementItemConfig = Record({
  type:undefined,//公告类型:0-home主页,1-local本地,...
  title: undefined, //公告标题
  url: undefined, //公告跳转地址
})

export class AnnouncementItem extends AnnouncementItemConfig {
  static fromLeancloudObject(lcObj) {
    let announcementItemConfig = new AnnouncementItemConfig()
    let attrs = lcObj.attributes
    return announcementItemConfig.withMutations((record)=> {
      record.set('type', attrs.type)
      record.set('title', attrs.title)
      record.set('url', attrs.url)
    })
  }
}

export const ColumnItemConfig = Record({
  type:undefined,//公告类型:0-home主页,1-local本地,...
  title: undefined, //公告标题
  imageSource: undefined, //公告跳转地址
})


export class ColumnItem extends ColumnItemConfig {
  static fromLeancloudObject(lcObj) {
    let columnItemConfig = new ColumnItemConfig()
    let attrs = lcObj.attributes
    return columnItemConfig.withMutations((record)=> {
      record.set('type', attrs.type)
      record.set('title', attrs.title)
      record.set('imageSource', attrs.imageSource)
    })
  }
}
export const Config = Record({
  banners: Map(),
  announcements: Map(),
  column: List()
}, 'Config')



