import Vue from 'vue'
import City from './city.js'
Vue.filter('imgType', function (value) {
  let name = ''
  switch (value) {
    case 'avatarUrl':
      name = '头像'
      break
    case 'idCardFrontUrl':
      name = '身份证正面'
      break
    case 'idCardBackUrl':
      name = '身份证反面'
      break
    case 'storeFrontUrl':
      name = '公司门头照'
      break
    case 'businessLicenceUrl':
      name = '营业执照'
      break
    case 'businessCardUrl':
      name = '个人名片'
      break
  }
  return name
})

/**
 * 时间格式化
 */
Vue.filter('datetime', function (value, format) {
  if (value) { return (new Date(value)).Format(format || 'yyyy-MM-dd hh:mm') } else { return '' }
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
 * 部门类型转化
 */
Vue.filter('departTypeToName', function (value) {
  let name = ''
  switch (value) {
    case 1:
      name = '前线销售'
      break
    case 2:
      name = '中台销售'
      break
    case 3:
      name = '研发部门'
      break
    case 4:
      name = '客服部门'
      break
    case 5:
      name = '综合性部门'
      break
    case 6:
      name = '职能部门'
      break
    default:
      name = ''
      break
  }
  return name
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
Vue.filter('toPoint', function (cityId) {
  return cityId / 100
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
