import _ from 'lodash'
import { Message } from 'iview'

// 北京 天津 上海 重庆 台湾 香港 澳门
const specialCity = ['110000', '120000', '310000', '500000', '710000', '810000', '820000']
let startCodes = []
let endCodes = []

const SPECIAL_CITY_VALIDATE = (codes) => {
  if (codes.length === 1 && !specialCity.includes(codes[0])) return false
  return true
}

export const getCityCode = (codes) => {
  if (!codes.length) return ''
  return specialCity.includes(codes[0]) && codes.length === 2 ? codes[0] : codes[codes.length - 1]
}

// 重置表单校验
export const resetCityValidator = () => {
  startCodes = []
  endCodes = []
}

// 校验表单始发地
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

// 校验表单目的地
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

// 校验非表单始发地与目的地
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
