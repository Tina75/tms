/**
 * 列表中计费里程格式化
 * @param {*} h
 * @param {*} value
 */
export const renderMileage = (h, value) => {
  return h('span', {}, value ? (value / 1000).toFixed(1) : '-')
}
/**
 * 列表中体积格式化
 * @param {*} h
 * @param {*} value
 */
export const renderVolume = (h, value) => {
  return h('span', {}, value ? (value / 100).toFixed(2) : '-')
}

/**
 * 列表中重量格式化
 * @param {*} h
 * @param {*} value
 */
export const renderWeight = (h, value) => {
  return h('span', {}, value ? (value / 1000).toFixed(3) : '-')
}
