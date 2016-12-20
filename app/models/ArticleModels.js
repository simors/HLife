import {Map, List, Record} from 'immutable'

export const ArticleItemStruc = Record({
  title: undefined , //标题
  url: undefined , //文章来源
 // enable: undefined  //是否启用
  category: undefined ,//(ArticleCategory.type)  分类
  abstract: undefined,  //简介
  image: undefined , //展示图片
  author: undefined , //作者
  objectId: undefined//唯一识别码
})

export class ArticleItem extends ArticleItemStruc {
  static fromLeancloudObject(lcObj) {
    let articleItem = new ArticleItemStruc()
    let attrs = lcObj.attributes
    return articleItem.withMutations((record)=> {
      record.set('objectId',attrs.objectId)
      record.set('title', attrs.title)
      record.set('url', attrs.url)
      record.set('category', attrs.category)
      record.set('image', attrs.image)
      record.set('abstract', attrs.abstract)
      record.set('author',attrs.author)

    })
  }
}

export const CommentItem = Record({
  content: undefined,
  author: undefined,
  commentobject: defined,
}
)


