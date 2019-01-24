
/**
 * 正则表达式
 */
export const pattern = {
  phone: /^1[0-9]{10}$/,
  telphone: /^[(（）)\-02-9][(（）)\-0-9]{1,19}$/,
  fee: /^[0-9]{0,9}(?:\.\d{1,4})?$/,
  mileage: /^[0-9]{0,6}(?:\.\d{1})?$/,
  car: /(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[A-Z]$)|([A-Z][A-HJ-NP-Z0-9][0-9]{4}$)))|(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$)/,
  guaCar: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{1}[A-Z]{1}[0-9]{4}$/
}
const validator = {
  /**
   * 校验手机号
   * @param {string} value
   */
  phone (value) {
    return pattern.phone.test(value)
  },
  // 座机号码
  telphone (value) {
    // return /^([0-9]|[-()（）]){1,}$/.test(value) && /^0[0-9]{10,}$/.test(value.replace(/[-()（）]/g, '')) && value.length <= 20
    return pattern.telphone.test(value)
  },
  /**
   * 费用一律限制整数位9位，精确2位小数
   * @param {number} value
   */
  fee (value) {
    return pattern.fee.test(value)
  },
  /**
   * 公里数
   * @param {*} value
   */
  mileage (value) {
    return pattern.mileage.test(value)
  },
  /**
   * 校验密码
   */
  checkPwd (value) {
  },
  /**
   * 车牌号
   * @param {string} value
   */
  car (value) {
    return pattern.car.test(value)
  },
  /**
   * 挂车车牌号
   * @param {string} value
   */
  guaCar (value) {
    return pattern.guaCar.test(value)
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
