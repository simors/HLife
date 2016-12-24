/**
 * Created by lilu on 2016/12/24.
 */
import {Map, List, Record} from 'immutable'

export const ArticleItemConfig = Record({
  articleId: undefined,     // 唯一识别码
  title: undefined,         // 标题
  content: undefined,       // 文章内容
  categoryId: undefined,    // (ArticleCategory.type)  分类
  abstract: undefined,      // 简介
  images: undefined,        // 展示图片
  author: undefined,        // 作者
}, 'ArticleItemConfig')

export class ArticleItem extends ArticleItemConfig {
  static fromLeancloudObject(lcObj) {
    let articleItem = new ArticleItemConfig()
    let attrs = lcObj.attributes
    return articleItem.withMutations((record)=> {
      record.set('title', attrs.title)
      record.set('content', attrs.content)
      record.set('categoryId', attrs.Category.id)
      record.set('abstract', attrs.abstract)
      record.set('images', attrs.images)
      record.set('author', attrs.author)
      record.set('articleId', lcObj.id)
    })
  }
}