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

/**
 * 将leancloud createdAt, updateAt时间对象转换成指定格式的日期字符串
 *
 * format:  YYYY-MM-DD HH:mm:SS
 *   YYYY 年
 *   MM   月
 *   DD   日
 *   HH   时
 *   mm   分
 *   SS   秒
 */
export function formatLeancloudTime(lcTime, format) {
  let fullYear = ''
  let month = ''
  let date = ''
  let hours = ''
  let minutes = ''
  let seconds = ''
  format = format || 'YYYY-MM-DD HH:mm:SS'
  if(lcTime) {
    fullYear = lcTime.getFullYear()
    month = lcTime.getMonth() + 1
    month = month < 10 ? '0' + month : month
    date = lcTime.getDate()
    date = date < 10 ? '0' + date : date
    hours = lcTime.getHours()
    hours = hours < 10 ? '0' + hours : hours
    minutes = lcTime.getMinutes()
    minutes = minutes < 10 ? '0' + minutes : minutes
    seconds = lcTime.getSeconds()
    seconds = seconds < 10 ? '0' + seconds : seconds
  }
  const result = format.replace('YYYY', fullYear).replace('MM', month).replace('DD', date)
    .replace('HH', hours).replace('mm', minutes).replace('SS', seconds)
  return result
}

export function formatNum(num) {
  let formatedNum = num
  if(num > 10000) {
    num = Number(num / 10000).toFixed(0)
    formatedNum = num + 'w+'
  }
  return formatedNum
}

export function getLeancloudTimeToMonth(lcTime) {
  let month = ''
  if (lcTime) {
    month = lcTime.getMonth() + 1
    switch (month) {
      case 1:
        return "一月"
      case 2:
        return "二月"
      case 3:
        return "三月"
      case 4:
        return "四月"
      case 5:
        return "五月"
      case 6:
        return "六月"
      case 7:
        return "七月"
      case 8:
        return "八月"
      case 9:
        return "九月"
      case 10:
        return "十月"
      case 11:
        return "十一月"
      case 12:
        return "十二月"
      default:
        return ""
    }
  }
}