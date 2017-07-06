/**
 * Created by lilu on 2017/1/12.
 */
import {Record, Map, List} from 'immutable'

export const PromoterRecord = Record({
  id: undefined,
  userId: undefined,              // 对应的用户id
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
  qrcode: undefined,              // 公众号推广二维码
}, 'PromoterRecord')

export const PromoterStatisticsRecord = Record({
  totalInvitedShops: undefined,
  totalTeamMems: undefined,
  totalPerformance: undefined,
  totalPromoters: undefined,
})

export const AreaAgent = Record({
  area: undefined,
  tenant: undefined,
  promoterId: undefined,
  userId: undefined,
})

export const EarnRecord = Record({
  cost: undefined,              // 收益金额
  dealType: undefined,          // 收益的类型，1表示邀请推广员，2表示邀请店铺
  promoterId: undefined,        // 此收益由哪个推广员完成的推广
  shopId: undefined,            // 如果收益类型为邀请店铺，那么这个字段记录被邀请的店铺id
  invitedPromoterId: undefined, // 如果收益类型为邀请推广员，那么这个字段记录被邀请推广员的id
  userId: undefined,            // 如果收益类型为邀请推广员，那么这个字段记录被邀请推广员的用户id
  dealTime: undefined,          // 记录收益时间
})

export const DailyPerformance = Record({
  level: undefined,           // 统计的级别，3为省，2为市，1为区县
  province: undefined,
  city: undefined,
  district: undefined,
  earning: 0,                 // 业绩总金额
  promoterNum: 0,             // 新发展的推广员数
  shopNum: 0,                 // 总店铺数
  statDate: undefined,        // 统计的日期
})

export const MonthlyPerformance = Record({
  level: undefined,           // 统计的级别，3为省，2为市，1为区县
  province: undefined,
  city: undefined,
  district: undefined,
  earning: 0,                 // 业绩总金额
  promoterNum: 0,             // 新发展的推广员数
  shopNum: 0,                 // 总店铺数
  year: undefined,            // 统计的年份
  month: undefined,           // 统计的月份
})

export class PromoterInfo extends PromoterRecord {
  static fromLeancloudObject(lcObj) {
    let promoter = new PromoterInfo()
    promoter = promoter.withMutations((record) => {
      record.set('id', lcObj.objectId)
      record.set('userId', lcObj.user.id)
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
      record.set('qrcode', lcObj.qrcode)
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
      record.set('totalPromoters', lcObj.totalPromoters)
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
  statistics: Map(),                // 统计数据，键为城市名，值为PromoterStatisticsRecord结构
  areaAgents: List(),               // 存储地区代理信息，值为AreaAgent类型
  shopTenant: Map(),                // 保存各地的店铺入驻费用，键为城市名，值为费用
  areaPromoters: List(),            // 某地区的推广员列表，按照业绩排序
  dealRecords: Map(),               // 保存推广员的收益记录，键为推广员id，值为记录列表，类型为EarnRecord
  lastDaysPerformance: Map(),       /* 保存最近几天的业绩统计数据，键为地区名称，如果是省级，则为省份名，
                                       如果为市级则为省份加城市，以此类推，值为DailyPerformance列表 */
  areaLastMonthsPerformance: Map(), /* 保存某地下辖区域最近几个月的业绩统计数据，键为地区名称，如果是省级，则为省份名，
                                       如果为市级则为省份加城市，以此类推，值为一个List，按照月份排序，
                                       为MonthlyPerformance列表 */
}, 'Promoter')

