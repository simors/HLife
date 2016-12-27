/**
 * Created by wanpeng on 2016/12/17.
 */
import {Record, Map, List} from 'immutable'

export const DoctorInfoRecord = Record({
  name:           undefined, //真实姓名
  IDCardNo:       undefined, //居民身份证号码
  phone:          undefined, //联系手机号码
  organization:   undefined, //执业地点
  department:     undefined, //科室
  certifiedImage: undefined, //认证头像
  certificate:    undefined, //认证凭证
  status:         undefined, //审核状态：0-审核失败 1-审核通过 2-审核中
  desc:           undefined, //备注
  }, 'DoctorInfoRecord')

export class DoctorInfo extends DoctorInfoRecord {

    static fromLeancloudObject(lcObj) {
      let doctorInfo = new DoctorInfo()
      let attrs = lcObj.attributes
      return doctorInfo.withMutations((record) => {
        record.set('name', attrs.name)
        record.set('IDCardNo', attrs.IDCardNo)
        record.set('phone', attrs.phone)
        record.set('organization', attrs.organization)
        record.set('department', attrs.department)
        record.set('certifiedImage', attrs.certifiedImage)
        record.set('certificate', attrs.certificate)
        record.set('status', attrs.status)
        record.set('desc', attrs.desc)
        })
    }

}
