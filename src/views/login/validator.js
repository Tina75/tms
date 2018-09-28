// 手机号格式校验
export const VALIDATOR_PHONE = (rule, value, cb) => {
  if (/1[0-9]{10}$/.test(value)) cb()
  else cb(new Error('请输入正确的手机号码'))
}

export const VALIDATOR_PASSWORD = (rule, value, cb) => {
  if (/^([a-z]|[A-Z]|\d){6,16}$/.test(value)) cb()
  else cb(new Error('密码只支持数字、大小写字母，至少为6位，至多为16位'))
}

export const VALIDATOR_CONFIRM_PASSWORD = (rule, value, cb) => {
  if (rule.vm.form.password === value) cb()
  else cb(new Error('前后两次密码不一致'))
}
