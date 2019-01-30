import float from '@/libs/js/float'
import NP from 'number-precision'
/**
 * 列表中计费里程格式化
 * @param {*} h
 * @param {*} value
 */
export const renderMileage = (h, value) => {
  return h('span', {}, value ? float.round(value / 1000, 1) : '-')
}
/**
 * 列表中体积格式化
 * @param {*} h
 * @param {*} value
 */
export const renderVolume = (h, value) => {
  return h('span', {}, value ? float.round(value / 100, 2) : '-')
}

/**
 * 列表中重量格式化
 * @param {*} h
 * @param {*} value
 */
export const renderWeight = (h, value) => {
  return h('span', {}, value ? float.round(value / 1000, 3) : '-')
}

/**
 * 重量计算，保留3位小数
 * @param {number} 重量吨
 */
export const roundWeight = (value) => {
  return float.round(value, 3)
}

/**
 * @Description: 详情中展示 重量 / 1000
 * @Date 2019/1/29
 */
export const divideWeight = (fee) => {
  return roundWeight(NP.divide(fee || 0, 1000))
}

/**
 * 体积计算，保留2位小数
 * @param {number} 体积
 */
export const roundVolume = (value) => {
  return float.round(value, 2)
}

/**
 * @Description: 详情中展示 体积 / 100
 * @Date 2019/1/29
 */
export const divideVolume = (fee) => {
  return roundVolume(NP.divide(fee || 0, 100))
}
