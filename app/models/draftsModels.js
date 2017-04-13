/**
 * Created by lilu on 2017/4/13.
 */


import {Record,Map,List } from 'immutable'
export const Drafts=Record({
  shopPromotions:Map(),                 //店铺活动的草稿记录，id为生成的UID
  topics:Map(),                //话题的草稿记录，id为生成的UID
},'Drafts')