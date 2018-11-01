import City from '@/libs/js/city'
import { Message } from 'iview'

/**
 * 城市校验
 * 修改记录：
 * 2018.10.18 - 取消校验始发地和目的地是否是相同城市
 */

// 直辖市与特殊地区：北京 天津 上海 重庆 台湾 香港 澳门
const specialCity = ['110000', '120000', '310000', '500000', '710000', '810000', '820000']

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
 * TMS1.1 18.10.18 已废弃
 * 如果需要使用下面的 FORM_VALIDATE_START FORM_VALIDATE_END 两个表单校验方法，需要在组件 created 时调用该方法
 */
export const resetCityValidator = () => {}

/**
 * 校验表单始发地
 * 使用方式 { validator: FORM_VALIDATE_START }
 */
export const FORM_VALIDATE_START = (rule, value, cb) => {
  if (!SPECIAL_CITY_VALIDATE(value)) {
    cb(new Error('请至少选择到市一级城市'))
  } else {
    cb()
  }
}

/**
 * 校验表单目的地
 * 使用方式 { validator: FORM_VALIDATE_START }
 */
export const FORM_VALIDATE_END = (rule, value, cb) => {
  if (!SPECIAL_CITY_VALIDATE(value)) {
    cb(new Error('请至少选择到市一级城市'))
  } else {
    cb()
  }
}

/**
 * 校验非表单始发地与目的地
 * 当 AreaSelect 组件不再表单中，提交数据时需要校验的情况，需要使用该方法
 * @param startCodes 始发地code数组或已选中城市code
 * @param endCodes 目的地code数组或已选中城市code
 */
export const validateCityies = (startCodes, endCodes) => {
  if (!startCodes || !startCodes.length) {
    Message.error('请选择始发地')
    return false
  }
  if (!endCodes || !endCodes.length) {
    Message.error('请选择目的地')
    return false
  }

  if (!(startCodes instanceof Array)) startCodes = City.getPathByCode(startCodes).map((item) => item.code)
  if (!(endCodes instanceof Array)) endCodes = City.getPathByCode(endCodes).map((item) => item.code)

  if (!SPECIAL_CITY_VALIDATE(startCodes)) {
    Message.error('始发地请至少选择到市一级城市')
    return false
  } else if (!SPECIAL_CITY_VALIDATE(endCodes)) {
    Message.error('目的地请至少选择到市一级城市')
    return false
  } else {
    return true
  }
}
