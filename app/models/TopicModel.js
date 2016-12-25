/**
 * Created by wuxingyu on 2016/12/24.
 */
import {Record} from 'immutable'

export const TopicsConfig = Record({
  content: undefined, //话题内容
  imgGroup: undefined, //图片
  objectId: undefined,
  categoryId: undefined  //属于的分类
}, 'TopicsConfig')

export class TopicsItem extends TopicsConfig {
  static fromLeancloudObject(lcObj) {
    let topicsConfig = new TopicsConfig()
    let attrs = lcObj.attributes
    return topicsConfig.withMutations((record)=> {
      record.set('content', attrs.content)
      record.set('imgGroup', attrs.imgGroup)
      record.set('categoryId', attrs.category.id)
      record.set('objectId', lcObj.id)
    })
  }
}

