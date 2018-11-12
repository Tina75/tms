// 手机号格式校验
export const VALIDATOR_PHONE = (rule, value, cb) => {
  if (/1[0-9]{10}$/.test(value)) cb()
  else cb(new Error('请输入正确的手机号码'))
}

export const VALIDATOR_PASSWORD = (rule, value, cb) => {
  let str = value.replace(/(^\s*)|(\s*$)/g, '')
  let repeat = new RegExp('(\\w)\\1{' + (str.length - 1) + '}')
  let series1 = 'abcdefghijklmnopqrstuvwxyz'
  let series2 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let series3 = '0123456789'
  if (!(/^[0-9A-Za-z].{5,16}$/.test(value))) {
    return cb(new Error('密码只支持数字、大小写字母，至少为6位，至多为16位'))
  } else if (repeat.test(str)) {
    if (/^[1-9]+[0-9]*]*$/.test(value)) {
      return cb(new Error('密码不可设置为全部重复的数字'))
    } else {
      return cb(new Error('密码不可设置为全部重复的字母'))
    }
  } else if (series1.indexOf(str) >= 0 || series2.indexOf(str) >= 0 || series3.indexOf(str) >= 0) {
    if (/^[1-9]+[0-9]*]*$/.test(value)) {
      return cb(new Error('密码不可设置为连续的数字'))
    } else {
      return cb(new Error('密码不可设置为连续的字母'))
    }
  } else {
    cb()
  }
}

export const VALIDATOR_CONFIRM_PASSWORD = (rule, value, cb) => {
  if (rule.vm.form.password === value) cb()
  else cb(new Error('前后两次密码不一致'))
}
