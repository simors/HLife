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

export function  DateDiff(sDate1,  sDate2){//sDate1和sDate2是2006-12-18格式
  if(sDate1&&sDate2){
    let  aDate,  oDate1,  oDate2,  iDays
    oDate1  =  new Date(sDate1.replace(/-/g,'/')).getTime()    //转换为12-18-2006格式
    console.log('oDate1============>',oDate1)

    oDate2  =  new Date(sDate2.replace(/-/g,'/')).getTime()
    console.log('oDate2============>',oDate2)

    iDays  =  Math.floor((oDate2  -  oDate1)/(1000*3600*24)) //把相差的毫秒数转换为天数

    let subDay = Math.abs((oDate2-oDate1)% (1000*24*3600))
    if(subDay&&subDay>0){
      iDays = iDays+1
    }
    // console.log('iDay============>',iDays)
    return Number(iDays)
  }else{
    return 0
  }

}

export function getCurrentDate() {
  let date = new Date()
  let Y = date.getFullYear() + '年';
  let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '月';
  let D = date.getDate() + '日';
  return Y + M + D
}

