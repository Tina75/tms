export function getPreMonth () {
  let date = new Date().Format('yyyy-MM-dd')
  let arr = date.split('-')
  let year = arr[0] // 获得当前日期的年份
  let month = arr[1] // 获得当前日期的月份
  let day = arr[2] // 获得当前日期的日
  // let days = new Date(year, month, 0)
  // days = days.getDate() // 获得当前日期中的月的天数
  let year2 = year
  let month2 = parseInt(month) - 1
  if (month2 === 0) {
    year2 = parseInt(year2) - 1
    month2 = 12
  }
  var day2 = day
  var days2 = new Date(year2, month2, 0)
  days2 = days2.getDate()
  if (day2 > days2) { // 如果原来日期大于上一月的日期，则取当月的最大日期。比如3月的30日，在2月中没有30
    day2 = days2
  }
  if (month2 < 10) {
    month2 = '0' + month2// 月份填补成2位。
  }
  // var t2 = year2 + '-' + month2 + '-' + day2
  return new Date(year2, month2 - 1, day2)
}
