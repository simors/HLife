/**
 * Created by wanpeng on 2017/1/17.
 */

/**
 * 出生年-月-日获取年龄
 *
 * @param dateString
 * @returns {number}
 */
export function getAgeFromBirthday(dateString) {
  let today = new Date()
  let birthDate = new Date(dateString)
  let age = today.getFullYear() - birthDate.getFullYear()
  let m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age --
  }
  return age
}