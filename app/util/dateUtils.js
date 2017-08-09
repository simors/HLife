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
    var  aDate,  oDate1,  oDate2,  iDays
    // aDate  =  sDate1.split("-")
    oDate1  =  new  Date(sDate1)    //转换为12-18-2006格式

    aDate  =  sDate2.split("-")
    oDate2  =  new  Date(sDate2)
    console.log('oDate==========?',oDate1)
    console.log('oDate==========?',oDate2)

    iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24) //把相差的毫秒数转换为天数
    var ilevel = Math.abs(oDate1  -  oDate2) % (1000*24*3600)
    if(ilevel&&ilevel>0){
      iDays = iDays+1
    }
    return  iDays
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

