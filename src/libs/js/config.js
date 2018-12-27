/**
 * 精度全局配置
 * 目前精度涉及到
 * 体积，体重，公里数，费用等
 * * 上游订单的体积仍然保留2位
 * @Author: mayousheng:Y010220
 * @Date: 2018-12-26 14:10:46
 * @Last Modified by: Y010220
 * @Last Modified time: 2018-12-27 17:17:55
 */
import float from './float'
export const NumberPrecesion = {
  weight: 3, // 重量精确3位小数
  weightKg: 0, // 重量公斤，保留整数
  volume: 6, // 体积精确6位小数
  mileage: 1, // 公里精确到1位小数
  fee: 2 // 费用精确到2位小数
}
/**
 * 全局系统添加长度控制
 */
export const FieldLength = {
  company: 20, // 公司名称：20
  orderNo: 30, // 订单号，30
  billNo: 30, // 运单号 30
  name: 15, // 人名称：20
  phone: 20, // 手机固话长度，1-20
  extraAddress: 50, // 补充地址,门派楼
  remark: 100, // 备注长度100
  cargoNo: 200 // 货物编号，200位
}
/**
 * 费用计算，保留2位小数
 * @param {number} fee
 */
export const roundFee = (fee) => {
  return float.round(fee, NumberPrecesion.fee)
}
/**
 * 保留2位小数字符串类型
 * @param {number} value
 */
export const getFeeText = (value) => {
  return value ? (value / 100).toFixed(NumberPrecesion.fee) : '0.00'
}
/**
 * 列表中费用格式化
 * * 除以 100
 * @param {*} h
 * @param {*} value
 */
export const renderFee = (h, value) => {
  return h('span', {}, getFeeText(value))
}
/**
 * 公里数计算，保留1位小数
 * @param {number} 公里数
 */
export const roundMileage = (value) => {
  return float.round(value, NumberPrecesion.mileage)
}
/**
 * 字符串化，保留小数
 * @param {*} value
 */
export const getMileageText = (value) => {
  return value ? (value / 1000).toFixed(NumberPrecesion.mileage) : '-'
}
/**
 * 列表中计费里程格式化
 * * 除以 1000
 * @param {*} h
 * @param {*} value
 */
export const renderMileage = (h, value) => {
  return h('span', {}, getMileageText(value))
}
/**
 * 体积计算，保留6位小数
 * @param {number} 体积
 */
export const roundVolume = (value) => {
  return float.round(value, NumberPrecesion.volume)
}
/**
 * 列表中体积格式化
 * @param {*} h
 * @param {*} value
 */
export const renderVolume = (h, value) => {
  return h('span', {}, value ? roundVolume(value) : '-')
}

/**
 * 重量计算，保留3位小数
 * @param {number} 重量吨
 */
export const roundWeight = (value) => {
  return float.round(value, NumberPrecesion.weight)
}
/**
 * 列表中重量格式化
 * @param {*} h
 * @param {*} value
 */
export const renderWeight = (h, value) => {
  return h('span', {}, value ? roundWeight(value) : '-')
}
/**
 * 重量公斤计算，保留整数
 * @param {number} 重量公斤
 */
export const roundWeightKg = (value) => {
  return float.round(value, NumberPrecesion.weightKg)
}
/**
 * 列表中重量格式化
 * @param {*} h
 * @param {*} value
 */
export const renderWeightKg = (h, value) => {
  return h('span', {}, value ? roundWeightKg(value) : '-')
}
