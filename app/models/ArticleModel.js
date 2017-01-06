/**
 * Created by lilu on 2016/12/24.
 */
import {Map, List, Record} from 'immutable'
import {hidePhoneNumberDetail} from '../util/numberUtils'
import * as numberUtils from '../util/numberUtils'

export const ArticleItemConfig = Record({
  articleId: undefined,     // 唯一识别码
  title: undefined,         // 标题
  content: undefined,       // 文章内容
  categoryId: undefined,    // (ArticleCategory.type)  分类
  abstract: undefined,      // 简介
  images: undefined,        // 展示图片
  nickname: undefined,      // 作者名称
  avatar: undefined,        //作者头像
  author: undefined,         //作者ID
  createdAt: undefined,     //创建时间
  //likers: List(),           //点赞数
 // comments: List(),         //评论
}, 'ArticleItemConfig')

export const LikersItemConfig = Record({
  avatar: undefined,
  authorId: undefined,
  nickname: undefined,
  username: undefined
}, 'LikersItemConfig')

export class LikersItem extends LikersItemConfig {
  static fromLeancloudObject(lcObj) {
    //  console.log('lcObj====>',lcObj)
    let likerItem = new LikersItemConfig()
    // let attrs = lcObj.attributes
    return likerItem.withMutations((record)=> {
      //    console.log('zhelishurule',lcObj.avatar)
      record.set('avatar', lcObj.avatar)
      record.set('authorId', lcObj.objectId)
      record.set('nickname', lcObj.nickname)
      record.set('username', lcObj.username)
    })
  }
}


export class ArticleItem extends ArticleItemConfig {
  static fromLeancloudObject(lcObj) {
    let articleItem = new ArticleItemConfig()
    let attrs = lcObj.attributes
    let user = lcObj.attributes.user.attributes
    let nickname = "吾爱用户"
    let avatar = undefined
    if (user) {
      avatar = user.avatar
      nickname = user.nickname
      if (!nickname) {
        let phoneNumber = user.username
        nickname = hidePhoneNumberDetail(phoneNumber)
      }
    }
    return articleItem.withMutations((record)=> {

      record.set('title', attrs.title)
      record.set('content', attrs.content)
      record.set('categoryId', attrs.Category.id)
      record.set('abstract', attrs.abstract)
      record.set('images', attrs.images)
      record.set('nickname', nickname)
      record.set('avatar', avatar)
      record.set('articleId', lcObj.id)
      record.set('createdAt', lcObj.createdAt)
      record.set('author', attrs.user.id)
      //record.set('likers',likerList)
      // record.set('comments',commentLIst)
      //    console.log('articleItem====>',record)
    })
  }
}

export const ArticleCommentItem = Record({
  commentId: undefined,   //评论识别码
  articleId: undefined,   //评论的文章引用 为POINTER
  content: undefined,     //评论内容
  replyId: undefined,       //回复评论引用  为POINTER
  author: undefined,      //作者
  avatar: undefined,
  nickname: undefined,
  createAt: undefined,
})

export class ArticleComment extends ArticleCommentItem {
  static fromLeancloudObject(lcObj) {
    let commentItem = new ArticleCommentItem()
    let attrs = lcObj.attributes
    let user = attrs.author.attributes
    console.log('user====>',user)
    console.log('attrs====>',attrs)


    let nickname = "吾爱用户"
    let avatar = undefined
    if (user) {
      avatar = user.avatar
      nickname = user.nickname
      if (!nickname) {
        let phoneNumber = user.username
        nickname = hidePhoneNumberDetail(phoneNumber)
      }
    }
    let parentUserPoint = undefined
    let parentCommentUser = "吾爱用户"

    //有父评论的情况下
    // if (attrs.replyId) {
    //   parentUserPoint = attrs.replyId.attributes.user
    //   //父用户昵称解析
    //   if (parentUserPoint) {
    //     parentCommentUser = parentUserPoint.get('nickname')
    //     if (!parentCommentUser) {
    //       let phoneNumber = parentUserPoint.getMobilePhoneNumber()
    //       parentCommentUser = hidePhoneNumberDetail(phoneNumber)
    //     }
    //   }
    // }
    return commentItem.withMutations((record)=> {
      record.set('author', attrs.author.id)
    //  console.log('author====>',record)
    //  console.log('author====>',record)
      record.set('content', attrs.content)
      record.set('articleId', attrs.articleId.id)
      record.set('commentId', lcObj.id)
      record.set('nickname', nickname)
      record.set('avatar', avatar)
      record.set('replyId', attrs.replyId?attrs.replyId:undefined)
      // record.set('createdAt', lcObj.createdAt)
     //     console.log('articleItem====>',record)
    })
  }
}


export const UpRecord = Record({
  id: undefined, // 点赞id
  upType: '', //点赞类型: enum('shop', 'shopComment', 'article', 'articleComment', 'topic', 'topicComment')
  targetId: '', //点赞类型对应的对象id
  status: false, //是否点赞
  createdDate: '', //格式化后的创建时间
  user: {},
  createdAt: undefined, //创建时间戳
  updatedAt: undefined,  //更新时间戳
})

export class Up extends UpRecord {
  static fromLeancloudObject(lcObj) {
    let up = new UpRecord()
    let attrs = lcObj.attributes
    return up.withMutations((record) => {
      record.set('id', lcObj.id)
      record.set('upType', attrs.upType)
      record.set('targetId', attrs.targetId)
      record.set('status', attrs.status)
      let userAttrs = attrs.user.attributes
      let user = {}
      user.id = attrs.user.id
      user.nickname = userAttrs.nickname
      record.set('user', user)
      record.set('createdDate', numberUtils.formatLeancloudTime(lcObj.createdAt, 'YYYY-MM-DD'))
      record.set('createdAt', lcObj.createdAt.valueOf())
      record.set('updatedAt', lcObj.updatedAt.valueOf())
    })
  }
}

export const FavoriteRecord = Record({
  id: undefined, // 收藏ID
  articleId: '', //点赞类型对应的对象id
  status: false, //是否点赞
  createdDate: '', //格式化后的创建时间
  user: {},
  createdAt: undefined, //创建时间戳
  updatedAt: undefined,  //更新时间戳
})

export class Favorite extends FavoriteRecord {
  static fromLeancloudObject(lcObj) {
    let up = new UpRecord()
    let attrs = lcObj.attributes
    return up.withMutations((record) => {
      record.set('id', lcObj.id)
      record.set('articleId', attrs.article.id)
      record.set('status', attrs.status)
      let userAttrs = attrs.user.attributes
      let user = {}
      user.id = attrs.user.id
      user.nickname = userAttrs.nickname
      record.set('user', user)
      record.set('createdDate', numberUtils.formatLeancloudTime(lcObj.createdAt, 'YYYY-MM-DD'))
      record.set('createdAt', lcObj.createdAt.valueOf())
      record.set('updatedAt', lcObj.updatedAt.valueOf())
    })
  }
}


export const Articles = Record({
  articleList: Map(),
 // likerList: Map(),
  commentList: Map(),
  upList: Map(),
  upCount: Map(),
  isUp: Map(),
  commentsCount: Map(),
  isFavorite:Map(),
}, 'Articles')