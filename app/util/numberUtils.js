/**
 * 移除字符中空格
 *
 * @param phone
 */
export function removeSpace(phone) {
  return phone.toString().replace(/\s+/g, "");
}

/**
 * 自动分割电话号码
 *
 * @param phone
 * @returns {*}
 */
export function formatPhone(phone) {
  if (!phone) {
    return;
  }

  phone = removeSpace(phone)

  if (phone.length <= 3) {
    return phone
  }
  else if (phone.length <= 7) {
    return phone.toString().substring(0, 3) + " " + phone.toString().substring(3, phone.length)
  } else {
    return phone.toString().substring(0, 3) + " " + phone.toString().substring(3, 7)
      + " " + phone.toString().substring(7, phone.length)
  }
}

/**
 * 隐藏电话号码中间4位
 *
 * @param phone
 * @returns {188****8888}
 */
export function hidePhoneNumberDetail(phone) {
  if (!phone) {
    return;
  }

  phone = removeSpace(phone)

  if (phone.length <= 7) {
    return phone
  }
  else {
    return phone.toString().substring(0, 3) + "****" + phone.toString().substring(7)
  }
}


/**
 * 获取聊天列表界面时间
 *
 * @param timestamp
 */
export function getConversationTime(timestamp) {
  let timeDiffInMS = 0
  if (timestamp) {
    timeDiffInMS = Date.now() - timestamp
  }
  let labelText = "刚刚"
  const timeDiffInSec = Math.floor(timeDiffInMS / 1000.0)
  if (timeDiffInSec > 0) {
    //labelText = timeDiffInSec + "秒前"
    const timeDiffInMin = Math.floor(timeDiffInSec / 60.0)
    if (timeDiffInMin > 0) {
      labelText = timeDiffInMin + "分钟前"
      const timeDiffInHour = Math.floor(timeDiffInMin / 60.0)
      if (timeDiffInHour > 0) {
        labelText = timeDiffInHour + "小时前"
        const timeDiffInDay = Math.floor(timeDiffInHour / 24.0)
        if (timeDiffInDay > 0) {
          labelText = timeDiffInDay + "天前"
          const timeDiffInWeek = Math.floor(timeDiffInDay / 7.0)
          if (timeDiffInWeek > 0) {
            labelText = timeDiffInWeek + "周前"
            const timeDiffInMon = Math.floor(timeDiffInDay / 30.0)
            if (timeDiffInMon > 0) {
              labelText = timeDiffInMon + "月前"
              const timeDiffInYear = Math.floor(timeDiffInDay / 365.0)
              if (timeDiffInYear > 0) {
                labelText = timeDiffInYear + "年前"
              }
            }
          }
        }
      }
    }
  }
  return labelText
}
