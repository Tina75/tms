import server from '../../libs/js/server'
// 基本变量
export const CODE = 10000
export const CAR = /(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$)))|(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$)/

export function formatterCarNo (value) {
  if (value) {
    return value.toUpperCase()
  }
  return value
}

// 自有车辆列表
export function listCar (data) {
  return server({
    url: '/owerCar/listCar',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'get',
    data: data
  })
}
