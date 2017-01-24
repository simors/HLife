/**
 * 用户(userId)是否在指定用户的关注列表中,
 * ture: 已关注
 * false: 未关注
 *
 * @param phone
 */
export function userIsFollowedTheUser(userId, userFollowees) {
  if(userFollowees && userFollowees.length) {
    for(let i = 0; i < userFollowees.length; i++) {
      if(userFollowees[i].id == userId) {
        return true
      }
    }
    return false
  }
}
