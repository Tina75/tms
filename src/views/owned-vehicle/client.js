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
// 发货方列表
export function consignerList (data) {
  return server({
    url: '/consigner/page',
    method: 'GET',
    data: data
  })
}

// 发货方的新增
export function consignerAdd (data) {
  return server({
    url: '/consigner/add',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: data
  })
}

// 发货方的修改
export function consignerUpdate (data) {
  return server({
    url: '/consigner/update',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: Object.assign(data, { payType: data.payType || '' })
  })
}

// 发货方的删除
export function consignerDelete (data) {
  console.log(data)
  return server({
    url: '/consigner/delete',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'DELETE',
    params: data
  })
}

// 发货方详情分页
export function consignerDetail (data) {
  return server({
    url: '/consigner/detail/page',
    method: 'GET',
    data: data
  })
}

// 发货方详情 发货地址列表
export function consignerAddressList (data) {
  return server({
    url: '/consigner/address/list',
    method: 'GET',
    data: data
  })
}

// 发货方详情 发货地址新增
export function consignerAddressAdd (data) {
  return server({
    url: '/consigner/address/add',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    data: data
  })
}

// 发货方详情 发货地址删除
export function consignerAddressDelete (data) {
  return server({
    url: '/consigner/address/delete',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'DELETE',
    params: data
  })
}

// 发货方详情 发货地址修改
export function consignerAddressUpdate (data) {
  return server({
    url: '/consigner/address/update',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    data: data
  })
}

// 发货方详情 收货方列表
export function consignerConsigneeList (data) {
  return server({
    url: '/consigner/consignee/list',
    method: 'GET',
    data: data
  })
}

// 发货方详情 收货方的新增
export function consignerConsigneeAdd (data) {
  return server({
    url: '/consigner/consignee/add',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    data: data
  })
}

// 发货方详情 收货方的删除
export function consignerConsigneeDelete (data) {
  return server({
    url: '/consigner/consignee/delete',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'DELETE',
    params: data
  })
}

// 发货方详情 收货方的修改
export function consignerConsigneeUpdate (data) {
  return server({
    url: '/consigner/consignee/update',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    data: data
  })
}

// 发货方详情 常发货物的列表
export function consignerCargoList (data) {
  return server({
    url: '/consigner/cargo/list',
    method: 'GET',
    data: data
  })
}

// 发货方详情 常发货物的新增
export function consignerCargoAdd (data) {
  return server({
    url: '/consigner/cargo/add',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    data: data
  })
}

// 发货方详情 常发货物的删除
export function consignerCargoDelete (data) {
  return server({
    url: '/consigner/cargo/delete',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'DELETE',
    params: data
  })
}

// 发货方详情 常发货物的修改
export function consignerCargoUpdate (data) {
  return server({
    url: '/consigner/cargo/update',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    data: data
  })
}

// 承运商列表
export function carrierList (data) {
  return server({
    url: '/carrier/list',
    method: 'GET',
    data: data
  })
}

// 删除承运商
export function carrierDelete (data) {
  return server({
    url: '/carrier/delete',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'DELETE',
    params: data
  })
}

// 新增承运商类型为个体司机
export function carrierAddForDriver (data) {
  return server({
    url: '/carrier/add/for/driver',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: data
  })
}

// 新增承运商-运输公司
export function carrierAddForCompany (data) {
  return server({
    url: '/carrier/add/for/company',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: data
  })
}

// 修改承运商-个体司机
export function carrierForDriverUpdate (data) {
  return server({
    url: '/carrier/for/driver/update',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: data
  })
}

// 修改承运商-运输公司
export function carrierForCompanyUpdate (data) {
  return server({
    url: '/carrier/for/company/update',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: data
  })
}

// 承运商详情-个体司机
export function carrierDetailsForDriver (data) {
  return server({
    url: '/carrier/details/for/driver',
    method: 'GET',
    data: data
  })
}

// 承运商详情-运输公司
export function carrierDetailsForCompany (data) {
  return server({
    url: '/carrier/details/for/company',
    method: 'GET',
    data: data
  })
}

// 根据承运商id查询其下属司机
// export function carrierListDriver (data) {
//   return server({
//     url: '/carrier/list/driver',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     method: 'GET',
//     data: data
//   })
// }

// 删除车辆
export function carrierDeleteDriver (data) {
  return server({
    url: '/carrier/delete/vehicle',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'DELETE',
    params: data
  })
}

// 添加车辆
export function carrierAddDriver (data) {
  return server({
    url: '/carrier/add/vehicle',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: data
  })
}

// 修改司机
export function carrierUpdateDriver (data) {
  return server({
    url: '/carrier/update/vehicle',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: data
  })
}

// // 删除司机
// export function carrierDeleteDriver (data) {
//   return server({
//     url: '/carrier/delete/driver',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     method: 'DELETE',
//     params: data
//   })
// }

// // 添加司机
// export function carrierAddDriver (data) {
//   return server({
//     url: '/carrier/add/driver',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     method: 'post',
//     data: data
//   })
// }

// // 修改司机
// export function carrierUpdateDriver (data) {
//   return server({
//     url: '/carrier/update/driver',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     method: 'post',
//     data: data
//   })
// }

// 根据承运商id查询其下属车辆 -车辆列表
export function carrierListCar (data) {
  return server({
    url: '/carrier/list/car',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    data: data
  })
}

// 删除车辆
export function carrierDeleteVehicle (data) {
  return server({
    url: '/carrier/delete/vehicle',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'DELETE',
    params: data
  })
}

// 查询承运商下尚未被绑定车辆的司机
export function listUnbindedDriver (data) {
  return server({
    url: '/carrier/list/unbinded/driver',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'GET',
    data: data
  })
}

// // 添加车辆
// export function carrierAddVehicle (data) {
//   return server({
//     url: '/carrier/add/vehicle',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     method: 'post',
//     data: data
//   })
// }

// // 修改车辆
// export function carrierUpdateVehicle (data) {
//   return server({
//     url: '/carrier/update/vehicle',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     method: 'post',
//     data: data
//   })
// }

// 车辆维修列表
export function carrierListRepairVehicle (data) {
  return server({
    url: '/carrier/repair/list',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: data
  })
}

// 添加维修记录
export function carrierAddVehicle (data) {
  return server({
    url: '/carrier/repair/add',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: data
  })
}

// 修改维修记录
export function carrierUpdateVehicle (data) {
  return server({
    url: '/carrier/repair/update',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: data
  })
}

// 查询操作日制
export function carrierQueryLog (data) {
  return server({
    url: '/carrier/carrierLog/list',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'get',
    data: data
  })
}

// 根据承运商ID查询车牌号
export function carrierQueryCarlist (data) {
  return server({
    url: '/carrier/carNo/list',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: data
  })
}

// 根据手机号查询司机
export function carrierQueryDriverlist (data) {
  return server({
    url: '/carrier/driver/list',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: data
  })
}

// 删除车辆维修及记录
export function carrierDeleteRepairVehicle (data) {
  return server({
    url: '/carrier/repair/del',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: data
  })
}

// 删除车辆维修及记录
export function getCarrierNumberCount (data) {
  return server({
    url: '/carrier/getCarriersCarNumAndRepairNum',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: data
  })
}

// 根据ID查询车辆信息或者微信记录信息
export function queryByIdCarrier (data) {
  return server({
    url: '/carrier/detail/type',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: data
  })
}

// 外转方列表
export function transfereeList (data) {
  return server({
    url: '/transferee/list',
    method: 'GET',
    data: data
  })
}

// 外转方的删除
export function transfereeDelete (data) {
  return server({
    url: '/transferee/delete',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'DELETE',
    params: data
  })
}

// 外转方新增
export function transfereeAdd (data) {
  return server({
    url: '/transferee/add',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: data
  })
}

// 外转方修改
export function transfereeUpdate (data) {
  return server({
    url: '/transferee/update',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: data
  })
}
