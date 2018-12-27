const validator = {
  /**
   * 校验手机号
   * @param {string} value
   */
  phone (value) {
    return /^1[0-9]{10}$/.test(value)
  },
  // 座机号码
  telphone (value) {
    // return /^([0-9]|[-()（）]){1,}$/.test(value) && /^0[0-9]{10,}$/.test(value.replace(/[-()（）]/g, '')) && value.length <= 20
    return /^([^1]+)?((\(|（)?\d{3,4}(\)|）)?)?-?((\d+)?(\(|（)\d{1,14}(\)|）)(\d+)?|\d{1,16})$/.test(value)
  },
  /**
   * 费用一律限制整数位9位，精确2位小数
   * @param {number} value
   */
  fee (value) {
    return /^[0-9]{0,9}(?:\.\d{1,2})?$/.test(value)
  },
  mileage (value) {
    return /^[0-9]{0,6}(?:\.\d{1})?$/.test(value)
  },
  /**
   * 校验密码
   */
  checkPwd (value) {
  }
}
/**
 * 验证手机和固话
 * 1. 输入开头如果是1，说明是手机，只可以输入11位，并格式化344
 * 2. 如果不是1，说明是固话或国外号码，可以输入-，（），等字符，包含支持中英符号, 长度最长20位
 */
export const validatePhone = (rule, value, callback) => {
  value = value.replace(/\s/g, '')
  if (validator.phone(value) || validator.telphone(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的手机号或座机号'))
  }
}

export default validator
