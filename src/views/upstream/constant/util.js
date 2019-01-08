import float from '@/libs/js/float'
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
