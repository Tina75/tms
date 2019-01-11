
import Server from '@/libs/js/server'

export const CHECK_PWD = function (rule, value, cb) {
  let str = value.replace(/(^\s*)|(\s*$)/g, '')
  let repeat = new RegExp('(\\w)\\1{' + (str.length - 1) + '}')
  let series1 = 'abcdefghijklmnopqrstuvwxyz'
  let series2 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let series3 = '0123456789'
  if (!(/^[0-9A-Za-z].{5,16}$/.test(value))) {
    return cb(new Error('请输入6-16位非连续重复的数字、大小写字母'))
  } else if (repeat.test(str)) {
    if (/^[0-9]+[0-9]*]*$/.test(value)) {
      return cb(new Error('密码不可设置为全部重复的数字'))
    } else {
      return cb(new Error('密码不可设置为全部重复的字母'))
    }
  } else if (series1.indexOf(str) >= 0 || series2.indexOf(str) >= 0 || series3.indexOf(str) >= 0) {
    if (/^[0-9]+[0-9]*]*$/.test(value)) {
      return cb(new Error('密码不可设置为连续的数字'))
    } else {
      return cb(new Error('密码不可设置为连续的字母'))
    }
  } else {
    cb()
  }
}
export const CHECK_PWD_SAME = function (rule, value, callback) {
  if (value !== rule.vm.formPwd.password) {
    return callback(new Error('两次密码不一致，请重输'))
  } else {
    callback()
  }
}
export const CHECK_NAME = function (rule, value, callback) {
  if (value.length < 2 || value.length > 10) {
    return callback(new Error('姓名不能小于2个字且不能多于10个字'))
  } else {
    callback()
  }
}
export const CHECK_NAME_COMPANY = function (rule, value, callback) {
  if (value.length > 25) {
    return callback(new Error('公司名不能超过25个字'))
  } else {
    callback()
  }
}
export const CHECK_PHONE = function (rule, value, callback) {
  if (value) {
    if (!(/^1\d{10}$/.test(value) || /^0\d{2,3}-?\d{7,8}$/.test(value))) {
      return callback(new Error('联系方式格式不正确'))
    }
    callback()
  } else {
    callback()
  }
}

export const PSW_RIGHT = function (rule, value, callback) {
  if (value) {
    let params = {}
    params.oldPassword = value
    Server({
      url: 'set/pswRight',
      method: 'get',
      data: params
    }).then(({ data }) => {
      callback()
    }).catch(() => {
      return callback(new Error('原始密码错误，请重输'))
    })
  } else {
    callback()
  }
}
