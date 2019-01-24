/**
 * 格式化手机号
 * @param {*} value 手机号
 */
export const formatePhone = (value) => {
  // 首字母是1的为手机号
  if (/^1/.test(value)) {
    let reg = /^1(\d{2})/
    let reg1 = /(\d{4})/

    value = value.replace(reg, '1$1 ').replace(reg1, '$1 ')
  }
  return value
}
