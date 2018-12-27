/**
 * 格式化手机号
 * @param {*} value 手机号
 */
export const formatePhone = (value) => {
  if (/^1/.test(value)) {
    let str = value.replace(/\s/g, '')
    if (value.length > 3 && value.length < 8) {
      value = str.substr(0, 3) + ' ' + str.substr(3, 4)
    } else if (value.length >= 8) {
      value = [str.substr(0, 3), str.substr(3, 4), str.substr(7, 4)].join(' ')
    }
  }
  return value
}
