/**
 * 精度全局配置
 * 目前精度涉及到
 * 体积，体重，公里数，费用等
 * * 上游订单的体积仍然保留2位
 * @Author: mayousheng:Y010220
 * @Date: 2018-12-26 14:10:46
 * @Last Modified by: Y010220
 * @Last Modified time: 2019-01-15 17:31:22
 */
import float from './float'
import NP from 'number-precision'
/**
 * 全局系统精度控制
 * 组件内可通过: this.$numberPrecesion.weight 访问重量精度
 */
export const NumberPrecesion = {
  rate: 2, // 开票税率
  weight: 3, // 重量精确3位小数
  weightKg: 0, // 重量公斤，保留整数
  volume: 6, // 体积精确6位小数
  mileage: 1, // 公里精确到1位小数
  fee: 4, // 费用精确到4位小数，v1.10开始保留4位小数
  dimension: 1 // 包装尺寸1位小数
}
/**
 * 全局系统添加长度控制
 * 组件内可通过: this.$fieldLength.mileage 访问公里数长度限制
 */
export const FieldLength = {
  mileage: 6, // 公里数整数位长：6
  company: 20, // 公司名称：20
  orderNo: 30, // 订单号，30
  billNo: 30, // 运单号 30
  name: 15, // 联系人人名称：20
  phone: 11, // 手机号长度
  telephone: 20, // 手机固话长度，1-20
  extraAddress: 50, // 补充地址,门派楼,收货人单位,长度：50
  remark: 100, // 备注长度100
  cargoNo: 200 // 货物编号，200位
}
export const isNumber = (fee) => {
  return /^-?\d+(\.\d+)?$/.test(fee)
}
/**
 * 费用计算，保留4位小数
 * v1.10保留4位小数
 * @param {number} fee
 */
export const roundFee = (fee) => {
  return float.round(fee, NumberPrecesion.fee)
}
/**
 * 接口返回的费用需乘以100
 * * 如果没有，自动转换0，返回，通常计算的时候使用
 * @param {number} fee 接口返回的值
 */
export const multiplyFee = (fee) => {
  return float.round(NP.times(fee || 0, 100))
}
/**
 * 提交的值乘以100
 * * 如果没有，返回原值，通常在提交表单相关费用值时候用到
 * @param {*} fee
 */
export const multiplyFeeOrNull = (fee) => {
  return isNumber(fee) ? multiplyFee(fee) : ''
}
/**
 * 接口返回的计费里程需乘以1000
 * @param {number} fee 通常在提交表单计费里程时候用到
 */
export const multiplyMileageOrNull = (fee) => {
  return isNumber(fee) ? multiplyMileage(fee) : ''
}
/**
 * 提交的值除以100
 * * 如果没有，自动转换0，通常在计算的时候用到
 * @param {*} fee
 */
export const divideFee = (fee) => {
  return roundFee(NP.divide(fee || 0, 100))
}
/**
 * 提交的值除以100
 * * 如果没有，返回原值，通常在读取接口返回的费用值时候用到
 * @param {*} fee
 */
export const divideFeeOrNull = (fee) => {
  return isNumber(fee) ? divideFee(fee) : ''
}
/**
 * 保留4位小数字符串类型
 * * 表格渲染时用到
 * @param {number} value
 */
export const getFeeText = (value) => {
  return isNumber(value) ? divideFee(value) : '-'
}
/**
 * 税率乘100保留两位小数
 * @param {number} value
 */
export const multiplyRate = (value) => {
  return float.round(NP.times(value, 100), NumberPrecesion.rate)
}
/**
 * 税率
 */
export const getRateText = (value) => {
  return value ? float.round(NP.times(value, 100), NumberPrecesion.rate) : '-'
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
 * 接口返回的计费里程需乘以1000
 * @param {number} fee 接口返回的值
 */
export const multiplyMileage = (fee) => {
  return float.round(NP.times(fee || 0, 1000))
}
/**
 * 计费里程提交的值除以1000
 * @param {*} fee
 */
export const divideMileage = (fee) => {
  return isNumber(fee) ? roundMileage(NP.divide(fee || 0, 1000)) : ''
}
/**
 * 字符串化，保留小数
 * @param {*} value
 */
export const getMileageText = (value) => {
  return isNumber(value) ? divideMileage(value) : '-'
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
  return h('span', {}, isNumber(value) ? roundVolume(value) : '-')
}

/**
 * 列表中数量格式化
 * @param {*} h
 * @param {*} value
 */
export const renderQuantity = (h, value) => {
  return h('span', {}, isNumber(value) ? value : '-')
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
  return h('span', {}, isNumber(value) ? roundWeight(value) : '-')
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
  return h('span', {}, isNumber(value) ? roundWeightKg(value) : '-')
}
/**
 * 数量、重量、体积等数字类型的属性格式化（费用除外）
 * @param {*} value
 */
export const renderNumberAttr = (value) => {
  return isNumber(value) ? value : '-'
}
