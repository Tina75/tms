/**
 * 精度全局配置
 * 目前精度涉及到
 * 体积，体重，公里数，费用等
 * * 上游订单的体积仍然保留2位
 * @Author: mayousheng:Y010220
 * @Date: 2018-12-26 14:10:46
 * @Last Modified by: Y010220
 * @Last Modified time: 2018-12-26 14:44:46
 */
import float from './float'
export const PrecesionConfig = {
  weight: 3, // 重量精确3位小数
  volume: 6, // 体积精确6位小数
  mileage: 1, // 公里精确到1位小数
  fee: 2 // 费用精确到2位小数
}

/**
 * 费用计算，保留2位小数
 * @param {number} fee
 */
export const roundFee = (fee) => {
  return float.round(fee, PrecesionConfig.fee)
}

/**
 * 列表中费用格式化
 * * 除以 100
 * @param {*} h
 * @param {*} value
 */
export const renderFee = (h, value) => {
  return h('span', {}, value ? (value / 100).toFixed(PrecesionConfig.fee) : '0.00')
}
/**
 * 公里数计算，保留1位小数
 * @param {number} 公里数
 */
export const roundMileage = (value) => {
  return float.round(value, PrecesionConfig.mileage)
}
/**
 * 列表中计费里程格式化
 * * 除以 1000
 * @param {*} h
 * @param {*} value
 */
export const renderMileage = (h, value) => {
  return h('span', {}, value ? (value / 1000).toFixed(PrecesionConfig.mileage) : '-')
}
/**
 * 体积计算，保留6位小数
 * @param {number} 公里数
 */
export const roundVolume = (value) => {
  return float.round(value, PrecesionConfig.volume)
}
/**
 * 列表中体积格式化
 * @param {*} h
 * @param {*} value
 */
export const renderVolume = (h, value) => {
  return h('span', {}, value ? float.round(value, PrecesionConfig.volume) : '-')
}

/**
 * 重量计算，保留3位小数
 * @param {number} 公里数
 */
export const roundWeight = (value) => {
  return float.round(value, PrecesionConfig.weight)
}
/**
 * 列表中重量格式化
 * @param {*} h
 * @param {*} value
 */
export const renderWeight = (h, value) => {
  return h('span', {}, value ? float.round(value, PrecesionConfig.weight) : '-')
}
