import Server from '@/libs/js/server'
// 基本变量
export const CODE = 10000
export const CAR = /(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$)))|(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$)/

export function formatterCarNo (value) {
  if (value) {
    return value.toUpperCase()
  }
  return value
}

/***
 * 自有车辆列表
 */
// 根据ID删除司机
export function deleteDriverById (params) {
  return Server({
    url: '/ownerCar/deleteDriver',
    method: 'post',
    data: params
  })
}
// 根据ID查询司机
export function queryDriverById (params) {
  return Server({
    url: '/ownerCar/queryDriverDetail',
    method: 'get',
    data: params
  })
}
// 根据ID删除车辆
export function deleteCarById (params) {
  return Server({
    url: '/ownerCar/deleteCar',
    method: 'get',
    data: params
  })
}
// 根据ID查询车辆
export function queryCarById (params) {
  return Server({
    url: '/ownerCar/queryCarDetail',
    method: 'get',
    data: params
  })
}
// 根据ID删除维修记录
export function deleteRepairById (params) {
  return Server({
    url: '/ownerCar/repair/del',
    method: 'post',
    data: params
  })
}
// 根据ID查询维修记录
export function queryRepairById (params) {
  return Server({
    url: '/ownerCar/queryRepairDetail',
    method: 'get',
    data: params
  })
}
