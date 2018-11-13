const validator = {
  /**
   * 校验手机号
   * @param {string} value
   */
  phone (value) {
    return /^1[0-9]{10}$/.test(value)
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

export default validator
