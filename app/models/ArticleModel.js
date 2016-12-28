/**
 * Created by lilu on 2016/12/24.
 */
import {Map, List, Record} from 'immutable'
import {hidePhoneNumberDetail} from '../util/numberUtils'

export const ArticleItemConfig = Record({
  articleId: undefined,     // 唯一识别码
  title: undefined,         // 标题
  content: undefined,       // 文章内容
  categoryId: undefined,    // (ArticleCategory.type)  分类
  abstract: undefined,      // 简介
  images: undefined,        // 展示图片
  nickname: undefined,      // 作者名称
  avatar: undefined,        //作者头像
  author:undefined,         //作者ID
  createdAt: undefined,     //创建时间
 // likes: undefined,         //点赞数
}, 'ArticleItemConfig')

export const LikersItemConfig = Record({
  avatar:undefined,
  authorId:undefined,
  nickname:undefined,
},'LikersItemConfig')

export class LikersItem extends LikersItemConfig{
  static fromLeancloudObject(lcObj){
    console.log('lcObj====>',lcObj)
    let likerItem = new LikersItemConfig()
   // let attrs = lcObj.attributes
    return likerItem.withMutations((record)=>{
      console.log('zhelishurule',lcObj.avatar)
      record.set('avatar', lcObj.avatar)
      record.set('authorId', lcObj.objectId)
      record.set('nickname', lcObj.nickname?lcObj.nickname:lcObj.username)
    })
  }
}


export class ArticleItem extends ArticleItemConfig {
  static fromLeancloudObject(lcObj) {
    let articleItem = new ArticleItemConfig()
    let attrs = lcObj.attributes
    let user = lcObj.get('user')
    let nickname = "吾爱用户"
    let avatar = undefined
    if (user) {
      avatar = user.get('avatar')
      nickname = user.get('nickname')
      if (!nickname) {
        let phoneNumber = user.getMobilePhoneNumber()
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
      record.set('avatar',avatar)
      record.set('articleId', lcObj.id)
      record.set('createdAt', lcObj.createdAt)
      record.set('author',attrs.author.id)
    //  record.set('likers',likers)
    })
  }
}

export const Articles = Record({
  aticlrList: List(),
  likesList: Map()
}, 'Articles')