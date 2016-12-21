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
  id: undefined,
  type:undefined,//是否显示在首页
  title: undefined, // 标题
  imageSource: undefined, //图标
},'ColumnItemConfig')


export class ColumnItem extends ColumnItemConfig {
  static fromLeancloudObject(lcObj) {
    let columnItemConfig = new ColumnItemConfig()
    let attrs = lcObj.attributes
    return columnItemConfig.withMutations((record)=> {
      record.set('type', attrs.type)
      record.set('title', attrs.title)
      record.set('imageSource', attrs.imageSource)
      record.set('id',lcObj.id)
    })
  }
}
export const ArticleItemConfig = Record({
  title: undefined , //标题
  url: undefined , //文章来源
 categoryId: undefined ,//(ArticleCategory.type)  分类
  abstract: undefined,  //简介
  images: undefined , //展示图片
  author: undefined , //作者
  articleId: undefined//唯一识别码
},'ArticleItemConfig')

export class ArticleItem extends ArticleItemConfig {
  static fromLeancloudObject(lcObj) {
    let articleItem = new ArticleItemConfig()
    let attrs = lcObj.attributes
    return articleItem.withMutations((record)=> {
     record.set('title',attrs.title)
      record.set('url',attrs.url)
      record.set('categoryId',attrs.Category.id)
      record.set('abstract',attrs.abstract)
      record.set('images',attrs.images)
      record.set('author',attrs.Author)
      record.set('articleId',lcObj.id)
    })
  }
}

export const TopicsItemConfig = Record({
  isPicked:undefined,//是否精选
  title: undefined, //话题名称
  image: undefined, //图片
  introduction: undefined, //介绍
  objectId: undefined
}, 'TopicsItemConfig')

export class TopicsItem extends TopicsItemConfig {
  static fromLeancloudObject(lcObj) {
    let topicsItemConfig = new TopicsItemConfig()
    let attrs = lcObj.attributes
    return topicsItemConfig.withMutations((record)=> {
      record.set('isPicked', attrs.isPicked)
      record.set('title', attrs.title)
      record.set('image', attrs.image)
      record.set('introduction', attrs.introduction)
      record.set('objectId', lcObj.id)
    })
  }
}

export const ShopCategoryConfig = Record({
  status: 0, // 0-关闭, 1-启用
  shopCategoryId: undefined,
  imageSource: undefined,
  text: undefined
})

export class ShopCategory extends ShopCategoryConfig {
  static fromLeancloudObject(lcObj) {
    let shopCategoryConfig = new ShopCategoryConfig()
    let attrs = lcObj.attributes
    return shopCategoryConfig.withMutations((record)=>{
      record.set('status', attrs.status)
      record.set('shopCategoryId', attrs.shopCategoryId)
      record.set('imageSource', attrs.imageSource)
      record.set('text', attrs.text)
    })
  }
}

export const Config = Record({
  banners: Map(),
  announcements: Map(),
  column: List(),
  topics: Map(),
  article:List(),
  shopCategories: List()
}, 'Config')



