/**
 * Created by wuxingyu on 2016/12/24.
 */
import {List, Record} from 'immutable'

export const TopicArticlesConfig = Record({
  content: undefined, //话题内容
  imgGroup: undefined, //图片
  objectId: undefined,
  categoryId:undefined  //属于的分类
}, 'TopicArticlesConfig')

export class TopicArticlesItem extends TopicArticlesConfig {
  static fromLeancloudObject(lcObj) {
    let topicsItemConfig = new TopicArticlesConfig()
    let attrs = lcObj.attributes
    return topicsItemConfig.withMutations((record)=> {
      record.set('content', attrs.content)
      record.set('imgGroup', attrs.imgGroup)
      record.set('categoryId', attrs.dependent.id)
      record.set('objectId', lcObj.id)
    })
  }
}

