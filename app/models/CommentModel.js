import {Map, List, Record} from 'immutable'

export const ArticleCommentItem=Record({
  commentId: undefined,   //评论识别码
  articleId: undefined,   //评论的文章引用 为POINTER
  content: undefined,     //评论内容
  reply: undefined,       //回复评论引用  为POINTER
  author: undefined,      //作者名称
})

export class ArticleComment extends ArticleCommentItem {
  static fromLeancloudObject(lcObj) {
    let commentItem = new ArticleCommentItem()
    let attrs = lcObj.attributes
    return commentItem.withMutations((record)=> {
      record.set('author', attrs.author)
      record.set('reply', attrs.reply)
      record.set('content', attrs.content)
      record.set('articleId', attrs.articleId.id)
      record.set('commentId', lcObj.id)
    })
  }
}