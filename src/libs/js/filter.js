import Vue from 'vue'
import City from './city.js'
import { getMileageText, getFeeText, isNumber } from './config'
const URL_HOST = process.env.VUE_APP_IMG_HOST
/**
 * 时间格式化
 */
Vue.filter('datetime', function (value, format) {
  if (value) { return (new Date(value)).Format(format || 'yyyy-MM-dd hh:mm') } else { return '' }
})

Vue.filter('date', function (value, format) {
  if (value) { return (new Date(value)).Format(format || 'yyyy-MM-dd') } else { return '' }
})
/**
 * 性别格式化
 */
Vue.filter('gender', function (value) {
  return value === 1 ? '男' : (value === 0 ? '' : '女')
})

/**
 * OSS图片url格式化
 */
Vue.filter('imgFormat', function (value) {
  if (value) {
    var reg = new RegExp('^http')
    return reg.test(value) ? value : 'https://yundada56prd.oss-cn-hangzhou.aliyuncs.com/' + value
  } else {
    return ''
  }
})

/**
 * 手机号码格式化
 */
Vue.filter('formatphone', function (value) {
  let tel = (value || '').slice(0, 3) + ' ' + (value || '').slice(3, 7) + ' ' + (value || '').slice(7, 11)
  return tel
})
/**
 * 身份证号格式化
 */
Vue.filter('formatid', function (value) {
  let idnum = (value || '').slice(0, 6) + ' ' + (value || '').slice(6, 14) + ' ' + (value || '').slice(14, 18)
  return idnum
})
/**
 * 根据cityId获取cityName
 */
Vue.filter('codeToName', function (cityId) {
  return City.codeToName(cityId)
})
/**
 * 将元转为分
 */
Vue.filter('toPoint', function (money, yuan = '') {
  if (isNumber(money)) {
    return getFeeText(money) + yuan
  }
  return getFeeText(money)
})

/**
 * 计费里程格式化
 */
Vue.filter('mileage', function (mileage, km = '') {
  if (isNumber(mileage)) {
    return getMileageText(mileage) + km
  }
  return getMileageText(mileage)
})
/**
 * 根据code获取城市全名 格式化城市
 * @param code 城市code
 * @param deep  1：省  2：市  3：区
 */
Vue.filter('cityFormatter', function (code) {
  if (!code) return ''
  return Array.from(new Set(City.codeToFullNameArr(code, 3))).join('')
})

Vue.directive('imgFormat', function (el, binding) {
  if (!binding.value) return
  if (binding.value.indexOf('aliyuncs.com') > 0) return
  el.style.backgroundImage = 'url(' + `${URL_HOST}${binding.value}?x-oss-process=image/resize,m_fill,h_220,w_220` + ')'
})
