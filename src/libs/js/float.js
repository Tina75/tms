/**
 * 数字的十进制计算
 *
 * @param {String}  type计算类型，例如："round" | "floor" | "ceil"
 * @param {Number}  value数字.
 * @param {Integer} exp基数，保留小数几位
 * @returns {Number}  计算后的值.
 */
function decimalAdjust (type, value = 0, exp = -2) {
  // exp 为null或0
  exp = -Math.abs(exp)
  if (+exp === 0) {
    return Math[type](value)
  }
  // 转换number
  value = +value
  exp = +exp
  // value不是数字类型，或exp不是整数
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN
  }
  // Shift
  value = value.toString().split('e')
  value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)))
  // Shift back
  value = value.toString().split('e')
  return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp))
}

const round = function (v, d) {
  return decimalAdjust('round', v, d)
}

var float = {
  round,
  floor: function (v, d) {
    return decimalAdjust('floor', v, d)
  },
  ceil: function (v, d) {
    return decimalAdjust('ceil', v, d)
  },
  eq: function (a, b, d) {
    return round(a, d) === round(b, d)
  },
  lt: function (a, b, d) {
    return round(a, d) < round(b, d)
  },
  gt: function (a, b, d) {
    return round(a, d) > round(b, d)
  },

  lteq: function (a, b, d) {
    return round(a, d) <= round(b, d)
  },

  gteq: function (a, b, d) {
    return round(a, d) >= round(b, d)
  }
}

export default float
