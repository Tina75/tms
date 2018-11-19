/**
 * 核销窗口mixin
 * data支付结算类型合并
 * @Author: mayousheng:Y010220
 * @Date: 2018-11-09 18:02:39
 * @Last Modified by: Y010220
 * @Last Modified time: 2018-11-12 19:38:00
 */
export const verifyPayType = {
  1: '现金',
  2: '银行卡',
  3: '微信',
  4: '支付宝'
}
export const verifyAccountType = {
  2: '银行卡号：',
  3: '微信号：',
  4: '支付宝账号：',
  5: '油卡卡号：'
}
export default {
  data () {
    return {
      payTypeMap: verifyPayType,
      accountMap: verifyAccountType,
      writeOffForm: {
        actualFee: undefined,
        payType: '2',
        account: '',
        bankBranch: '',
        remark: ''
      },
      validate: {
        actualFee: [
          { required: true, message: '请填写金额', trigger: 'blur', type: 'number' },
          { pattern: /^(0|([1-9]\d{0,8}))([.]\d{1,2})?$/, message: '必须为不超过9位的正数，最多精确到两位小数', trigger: 'blur' }
        ],
        payType: { required: true, message: '请选择付款方式', trigger: 'change' },
        account: { type: 'string', max: 30, message: '不能超过30个字', trigger: 'blur' },
        bankBranch: { type: 'string', max: 30, message: '不能超过30个字', trigger: 'blur' },
        remark: { type: 'string', max: 100, message: '不能超过100个字', trigger: 'blur' }
      }
    }
  },
  mounted () {
    this.writeOffForm.actualFee = this.needPay
  }
}
