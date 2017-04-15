/**
 * Created by lilu on 2017/1/12.
 */
import {Record, Map, List} from 'immutable'

export const PromoterRecord = Record({
  id: undefined,
  userId: undefined,              // 对应的用户id
  name: undefined,                // 真实姓名
  phone: undefined,               // 联系手机号码
  upUser: undefined,              // 推荐人
  payment: undefined,             // 是否已完成支付，0表示未支付，1表示已支付
  shopEarnings: undefined,        // 邀请店铺收益
  royaltyEarnings: undefined,     // 团队提成收益
  inviteShopNum: undefined,       // 邀请的店铺数量
  teamMemNum: undefined,          // 团队成员的数量
  level: undefined,               // 推广员的级别，目前总共有5个级别，分别为1，2，3，4，5级，默认为1级
  liveProvince: undefined,        // 推广员生活的省份
  liveCity: undefined,            // 推广员生活的城市
  liveDistrict: undefined,        // 推广员生活的区县
  identity: undefined,            // 推广员身份，普通推广员为0，省级代理、市级代理、区县级代理分别为1，2，3，4
  province: undefined,            // 代理控制的省份
  city: undefined,                // 代理控制的城市
  district: undefined,            // 代理控制的区县
  street: undefined,              // 代理控制的街道或乡镇
  createdAt: undefined,
  updatedAt: undefined,
}, 'PromoterRecord')

export const PromoterStatisticsRecord = Record({
  totalInvitedShops: undefined,
  totalTeamMems: undefined,
  totalPerformance: undefined,
})

export const AreaAgent = Record({
  area: undefined,
  tenant: undefined,
  promoterId: undefined,
  userId: undefined,
})

export class PromoterInfo extends PromoterRecord {
  static fromLeancloudObject(lcObj) {
    let promoter = new PromoterInfo()
    promoter = promoter.withMutations((record) => {
      record.set('id', lcObj.objectId)
      record.set('userId', lcObj.user.id)
      record.set('name', lcObj.name)
      record.set('phone', lcObj.phone)
      record.set('upUser', lcObj.upUser ? lcObj.upUser.id : undefined)
      record.set('payment', lcObj.payment)
      record.set('shopEarnings', lcObj.shopEarnings)
      record.set('royaltyEarnings', lcObj.royaltyEarnings)
      record.set('inviteShopNum', lcObj.inviteShopNum)
      record.set('teamMemNum', lcObj.teamMemNum)
      record.set('level', lcObj.level)
      record.set('liveProvince', lcObj.liveProvince)
      record.set('liveCity', lcObj.liveCity)
      record.set('liveDistrict', lcObj.liveDistrict)
      record.set('identity', lcObj.identity)
      record.set('province', lcObj.province)
      record.set('city', lcObj.city)
      record.set('district', lcObj.district)
      record.set('street', lcObj.street)
      record.set('createdAt', lcObj.createdAt)
      record.set('updatedAt', lcObj.updatedAt)
    })
    return promoter
  }
}

export class PromoterStatistics extends PromoterStatisticsRecord {
  static fromLeancloudObject(lcObj) {
    let statistics = new PromoterStatisticsRecord()
    statistics = statistics.withMutations((record) => {
      record.set('totalInvitedShops', lcObj.totalInvitedShops)
      record.set('totalTeamMems', lcObj.totalTeamMems)
      record.set('totalPerformance', lcObj.totalPerformance)
    })
    return statistics
  }
}

export const Promoter = Record({
  activePromoter: undefined,        // 当前推广员id
  inviteCode: undefined,            // 生成的邀请码
  fee: undefined,                   // 获取到店铺或者推广员的入驻费
  upPromoterId: undefined,          // 记录当前推广员的上级推广员id
  userToPromoter: Map(),            // 记录用户id与推广员id的对应关系
  promoters: Map(),                 // 推广员记录，键为推广员id，值为PromoterInfo
  team: Map(),                      // 记录团队列表信息，键为推广员id，值为其推广团队中所有推广员的id号，此列表按照推广员最后业绩时间排序
  invitedShops: Map(),              // 记录邀请的店铺，键为推广员id，值为店铺的id列表
  statistics: undefined,            // 统计数据，为PromoterStatisticsRecord结构
  areaAgents: List(),               // 存储地区代理信息，值为AreaAgent类型
}, 'Promoter')

