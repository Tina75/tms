
export const CHECK_NAME_COMPANY = function (rule, value, callback) {
  if (value.length > 25) {
    return callback(new Error('公司名不能超过25个字'))
  } else {
    callback()
  }
}
export const CHECK_NAME = function (rule, value, callback) {
  if (value.length < 2 || value.length > 20) {
    return callback(new Error('姓名不能小于2个字且不能多于20个字'))
  } else {
    callback()
  }
}
export const CHECK_PHONE = function (rule, value, callback) {
  if (value) {
    if (/^1[0-9]{10}$/.test(value) || /^[^1]((\(|（)?\d{2,4}(\)|）)?)?-?((\d+)?(\(|（)\d{1,14}(\)|）)(\d+)?|\d{1,16})$/.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正确的手机号或座机号'))
    }
  } else {
    callback()
  }
}
