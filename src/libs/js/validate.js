const validator = {
  /**
   * 校验手机号
   * @param {string} value
   */
  phone (value) {
    return /^1[0-9]{10}$/.test(value)
  }
}

export default validator
