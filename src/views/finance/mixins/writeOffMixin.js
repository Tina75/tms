import SelectInput from '@/components/SelectInput'
export default {
  components: {
    SelectInput
  },
  data () {
    return {
      diffAcount: [], // 保存的微信号，银行卡号，支付宝号
      diffBankBranch: []
    }
  },
  computed: {
    account () {
      return this.writeOffForm.account
    },
    payType () {
      return this.writeOffForm.payType
    }
  },
  watch: {
    account (nvalue, ovalue) {
      if (this.writeOffForm.payType === '2') { // 银行卡号
        const temp = nvalue.replace(/\s/g, '').split('').map((item, index) => {
          if (index % 4 === 0 && index !== 0) return ' ' + item
          else return item
        })
        this.$nextTick(() => {
          this.writeOffForm.account = temp.join('')
        })
      }
    },
    payType (nvalue, ovalue) {
      this.writeOffForm.account = ''
      this.writeOffForm.bankBranch = ''
      let accountObj = this.getAccount()
      switch (nvalue) {
        case '2':
          this.diffAcount = this.dataHandle(accountObj['card'])
          this.diffBankBranch = this.dataHandle(accountObj['bankBranch'])
          break
        case '3':
          this.diffAcount = this.dataHandle(accountObj['weChat'])
          break
        case '4':
          this.diffAcount = this.dataHandle(accountObj['alipay'])
          break
        default:
          this.diffAcount = []
          break
      }
    }
  },
  mounted () {
    // 初始为银行卡号，先给银行卡号赋初始值
    if (this.writeOffForm.payType === '2') {
      let accountObj = this.getAccount()
      this.diffAcount = this.dataHandle(accountObj['card'])
      this.diffBankBranch = this.dataHandle(accountObj['bankBranch'])
    }
  },
  methods: {
    isExist (key, value) {
      let flag = true
      let accountObj = this.getAccount()
      for (let i = 0; i < accountObj[key].length; i++) {
        if (accountObj[key][i] === value) {
          flag = false
          break
          // return false
        }
      }
      return flag
      // return true
      // return accountObj[key].every((element, index, array) => {
      //   return accountObj === value
      // })
    },
    /* 数据处理成selectinpt需要的格式 */
    dataHandle (arr) {
      return arr.map(item => {
        return { name: item, value: item }
      })
    },
    getAccount () {
      let initAccount = {
        weChat: [],
        bankBranch: [], // 开户行
        card: [], // 银行卡号
        cardWithBank: {}, // 将开户行和银行卡号联系
        alipay: []
      }
      let accountObj = localStorage.getItem('accountObj') ? JSON.parse(localStorage.getItem('accountObj')) : initAccount
      return accountObj
    },
    setAccount (key, value) {
      let accountObj = this.getAccount()
      accountObj[key].length >= 5 && (accountObj[key].length = 4)
      accountObj[key].unshift(value)
      localStorage.setItem('accountObj', JSON.stringify(accountObj))
    },
    /* 银行卡和账号不为空，则将两则联系保存 */
    cardWithBank (account, bankBranch) {
      let accountObj = this.getAccount()
      accountObj.cardWithBank[account] = bankBranch
      localStorage.setItem('accountObj', JSON.stringify(accountObj))
    },
    /* 选择银行卡，带出开户行 */
    cardSetBank (val) {
      // 获得内存数据
      let accountObj = this.getAccount()
      for (let key in accountObj['cardWithBank']) {
        key === val && (this.writeOffForm.bankBranch = accountObj['cardWithBank'][key])
      }
    },
    saveAccount (account, bankBranch) {
      // 1,判断此次存的数据是否已经存在
      // 2，存数据，并且将大于5的剔除
      switch (this.writeOffForm.payType) {
        case '2': // 银行卡号
          account && this.isExist('card', account) && this.setAccount('card', account)
          bankBranch && this.isExist('bankBranch', bankBranch) && this.setAccount('bankBranch', bankBranch)
          account && bankBranch && this.cardWithBank(account, bankBranch)
          break
        case '3': // 微信号
          account && this.isExist('weChat', account) && this.setAccount('weChat', account)
          break
        case '4': // 支付宝账号
          account && this.isExist('alipay', account) && this.setAccount('alipay', account)
          break
        default:
          break
      }
    }
  }
}
