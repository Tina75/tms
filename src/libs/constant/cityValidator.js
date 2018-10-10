import _ from 'lodash'
import { Message } from 'iview'

// 直辖市与特殊地区：北京 天津 上海 重庆 台湾 香港 澳门
const specialCity = ['110000', '120000', '310000', '500000', '710000', '810000', '820000']

// 记录表单校验时输入的始发地与目的地codes
let startCodes = []
let endCodes = []

// 校验是否是直辖市或特殊地区
const SPECIAL_CITY_VALIDATE = (codes) => {
  if (codes.length === 1 && !specialCity.includes(codes[0])) return false
  return true
}

/**
 * 获取城市code
 * @param codes AreaSelect 组件返回的数组
 */
export const getCityCode = (codes) => {
  if (!codes.length) return ''
  return specialCity.includes(codes[0]) && codes.length === 2 ? codes[0] : codes[codes.length - 1]
}

/**
 * 重置表单校验
 * 如果需要使用下面的 FORM_VALIDATE_START FORM_VALIDATE_END 两个表单校验方法，需要在组件 created 时调用该方法
 */
export const resetCityValidator = () => {
  startCodes = []
  endCodes = []
}

/**
 * 校验表单始发地
 * 使用方式 { validator: FORM_VALIDATE_START }
 */
export const FORM_VALIDATE_START = (rule, value, cb) => {
  startCodes = value

  const start = getCityCode(startCodes)
  const end = getCityCode(endCodes)

  if (!SPECIAL_CITY_VALIDATE(value)) {
    cb(new Error('请至少选择到市一级城市'))
  } else if ((endCodes.length > 0 && value.length > 0 && _.isEqual(endCodes, value)) || start === end) {
    cb(new Error('始发城市不能和目的城市相同'))
  } else {
    cb()
  }
}

/**
 * 校验表单目的地
 * 使用方式 { validator: FORM_VALIDATE_START }
 */
export const FORM_VALIDATE_END = (rule, value, cb) => {
  endCodes = value

  const start = getCityCode(startCodes)
  const end = getCityCode(endCodes)

  if (!SPECIAL_CITY_VALIDATE(value)) {
    cb(new Error('请至少选择到市一级城市'))
  } else if ((startCodes.length > 0 && value.length > 0 && _.isEqual(startCodes, value)) || start === end) {
    cb(new Error('始发城市不能和目的城市相同'))
  } else {
    cb()
  }
}

/**
 * 校验非表单始发地与目的地
 * 当 AreaSelect 组件不再表单中，提交数据时需要校验的情况，需要使用该方法
 * @param startCodes 始发地code数组
 * @param endCodes 目的地code数组
 */
export const validateCityies = (startCodes, endCodes) => {
  const start = getCityCode(startCodes)
  const end = getCityCode(endCodes)

  if (!SPECIAL_CITY_VALIDATE(startCodes)) {
    Message.error('始发地请至少选择到市一级城市')
    return false
  } else if (!SPECIAL_CITY_VALIDATE(endCodes)) {
    Message.error('目的地请至少选择到市一级城市')
    return false
  } else if ((startCodes.length > 0 && endCodes.length > 0 && _.isEqual(startCodes, endCodes)) || start === end) {
    Message.error('始发地不能和目的地相同')
    return false
  } else {
    return true
  }
}
