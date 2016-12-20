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
  type:undefined,//是否显示在首页
  title: undefined, //标题
  url: undefined, //图标
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
  objectId: undefined,
  type:undefined,//是否显示在首页
  title: undefined, // 标题
  imageSource: undefined, //图标
})


export class ColumnItem extends ColumnItemConfig {
  static fromLeancloudObject(lcObj) {
    let columnItemConfig = new ColumnItemConfig()
    let attrs = lcObj.attributes
    return columnItemConfig.withMutations((record)=> {
      record.set('type', attrs.type)
      record.set('title', attrs.title)
      record.set('imageSource', attrs.imageSource)
      record.set('objectId', attrs.objectId)
    })
  }
}
export const TopicsItemConfig = Record({
  isPicked:undefined,//是否精选
  title: undefined, //话题名称
}, 'TopicsItemConfig')

export class TopicsItem extends TopicsItemConfig {
  static fromLeancloudObject(lcObj) {
    let topicsItemConfig = new TopicsItemConfig()
    let attrs = lcObj.attributes
    return topicsItemConfig.withMutations((record)=> {
      record.set('isPicked', attrs.isPicked)
      record.set('title', attrs.title)
    })
  }
}
export const Config = Record({
  banners: Map(),
  announcements: Map(),
  column: List(),
  topics: Map()
}, 'Config')



