import CarConfigs from './carConfigs.json'
import MoneyInput from '../components/moneyInput'
import City from '@/libs/js/City'
import { mapGetters, mapActions } from 'vuex'
import { CAR } from '@/views/client/client'

const carType = CarConfigs.carType
const carLength = CarConfigs.carLength

export default {
  data () {
    return {
      id: this.$route.query.qid,
      loading: false,
      inEditing: false,
      currentBtns: [], // 当前按钮组

      detail: [], // 货物明细

      // 支付方式表格
      tablePayment: [
        {
          title: '付款方式',
          key: 'payType',
          align: 'center',
          width: 100,
          render: (h, p) => {
            let type
            if (p.row.payType === 1) type = '预付'
            if (p.row.payType === 2) type = '到付'
            if (p.row.payType === 3) type = '回付'
            return h('span', {
              style: { fontWeight: 'bolder' }
            }, type)
          }
        },
        {
          title: '现金',
          key: 'cashAmount',
          render: (h, p) => {
            if (!this.inEditing) {
              return h('span', p.row.cashAmount)
            } else {
              return h(MoneyInput, {
                props: {
                  value: p.row.cashAmount,
                  placeholder: '请输入',
                  suffix: false
                },
                style: {
                  width: '60px'
                },
                on: {
                  'on-blur': (money) => {
                    let temp = p.row
                    temp.cashAmount = money
                    this.settlementPayInfo.splice(p.index, 1, temp)
                    this.checkTotalAmount()
                  }
                }
              })
            }
          }
        },
        {
          title: '油卡',
          key: 'fuelCardAmount',
          render: (h, p) => {
            if (!this.inEditing) {
              return h('span', p.row.fuelCardAmount)
            } else {
              return h(MoneyInput, {
                props: {
                  value: p.row.fuelCardAmount,
                  placeholder: '请输入',
                  suffix: false
                },
                style: {
                  width: '60px'
                },
                on: {
                  'on-blur': (money) => {
                    let temp = p.row
                    temp.fuelCardAmount = money
                    this.settlementPayInfo.splice(p.index, 1, temp)
                    this.checkTotalAmount()
                  }
                }
              })
            }
          }
        }
      ],

      showLog: false,
      logList: [],

      carType,
      carLength
    }
  },

  created () {
    this.fetchData()
    this.getCarriers()
  },

  computed: {
    // 根据日志收起展开动态计算高度
    logListHeight () {
      return { height: this.showLog ? 41 * this.logList.length + 'px' : '15px' }
    },
    // 支付总额
    paymentTotal () {
      return Number(this.payment.freightFee) +
      Number(this.payment.loadFee) +
      Number(this.payment.unloadFee) +
      Number(this.payment.insuranceFee ? this.payment.insuranceFee : 0) +
      Number(this.payment.otherFee)
    },
    // 货物总计
    orderTotal () {
      return this.detail.reduce((last, item) => {
        return {
          cargoCost: last.cargoCost + item.cargoCost,
          quantity: last.quantity + item.quantity,
          weight: last.weight + item.weight,
          volume: last.volume + item.volume
        }
      }, {
        cargoCost: 0,
        quantity: 0,
        weight: 0,
        volume: 0
      })
    },

    ...mapGetters([
      'carriers',
      'carrierCars',
      'carrierDrivers'
    ])
  },

  filters: {
    formatTime (timestamp) {
      if (!timestamp) return ''
      return new Date(timestamp).Format('yyyy-MM-dd hh:mm:ss')
    },

    formatCity (code) {
      if (!code) return ''
      return City.codeToFullName(code, 3)
    },

    carTypeFilter (value) {
      for (let i = 0; i < carType.length; i++) {
        if (value === carType[i].value) {
          return carType[i].label
        }
      }
    },
    carLengthFilter (value) {
      for (let i = 0; i < carLength.length; i++) {
        if (value === carLength[i].value) {
          return carLength[i].label
        }
      }
    }
  },

  watch: {
    startCodes () {
      if (!(this.startCodes instanceof Array)) return
      this.info.start = this.startCodes.length
        ? this.startCodes[this.startCodes.length - 1]
        : ''
    },
    endCodes () {
      if (!(this.endCodes instanceof Array)) return
      this.info.end = this.endCodes.length && (this.endCodes instanceof Array)
        ? this.endCodes[this.endCodes.length - 1]
        : ''
    },
    inEditing (val) {
      if (!this.tableCanEdit) return
      if (val) {
        this.tableColumns.unshift({
          title: '操作',
          key: 'action',
          width: 60,
          render: (h, p) => {
            return h('a', {
              on: {
                click: () => {
                  this.detail.splice(p.index, 1)
                }
              }
            }, '移出')
          }
        })
      } else {
        this.tableColumns.shift()
      }
    }
  },

  methods: {
    ...mapActions([
      'getCarriers'
    ]),

    handleSelectCarrier (name, row) {
      console.log(name, row)
      this.$store.dispatch('getCarrierCars', row.id)
      this.$store.dispatch('getCarrierDrivers', row.id)
    },

    // 根据状态设置按钮
    setBtnsWithStatus () {
      for (let i = 0; i < this.btnList.length; i++) {
        if (this.btnList[i].status === this.status) {
          this.currentBtns = this.btnList[i].btns
          return
        }
      }
    },

    // 取消编辑
    cancelEdit () {
      this.inEditing = false
      this.fetchData()
    },

    // 计费规则
    showChargeRules () {
      this.openDialog({
        name: 'order/create/CounterDialog.vue',
        data: {
          value: 0
        },
        methods: {
          ok (charge) {
            this.payment.freightFee = charge || 0
          }
        }
      })
    },

    // 校验结算方式输入金额
    checkTotalAmount () {
      let total = 0
      this.settlementPayInfo.forEach(item => {
        total = total + Number(item.cashAmount) + Number(item.fuelCardAmount)
      })
      console.log(total, Number(this.paymentTotal))
      if (total > Number(this.paymentTotal)) {
        this.$Message.error('结算总额不能超过费用合计')
        return false
      }
      return true
    },

    // 添加订单
    addOrder () {
      this.openDialog({
        name: 'transport/dialog/addOrder',
        data: {},
        methods: {
          add (orders) {
            console.log(orders)
          }
        }
      })
    },

    // 设置金额单位为元
    setMoneyUnit2Yuan (money) {
      return money ? money / 100 : 0
    },

    // 格式化金额单位为分
    formatMoney () {
      let temp = Object.assign({}, this.payment)
      for (let key in temp) {
        temp[key] = Number(temp[key]) * 100
      }
      return temp
    },
    // 格式化计费方式金额单位为分
    formatPayInfo () {
      // if (this.settlementType !== '1') return
      return this.settlementPayInfo.map(item => {
        return {
          payType: item.payType,
          fuelCardAmount: Number(item.fuelCardAmount) * 100,
          cashAmount: Number(item.cashAmount) * 100
        }
      })
    },
    // 校验
    validate () {
      if (this.info.start && !this.info.start) {
        this.$Message.error('请输入始发地')
        return false
      }
      if (this.info.end && !this.info.end) {
        this.$Message.error('请输入目的地')
        return false
      }
      if (!this.info.carrierName) {
        this.$Message.error('请输入承运商')
        return false
      }
      if (!this.info.driverName) {
        this.$Message.error('请输入司机')
        return false
      }
      if (!this.info.carNo) {
        this.$Message.error('请输入车牌号')
        return false
      }
      if (!CAR.test(this.info.carNo)) {
        this.$Message.error('请输入正确的车牌号')
        return false
      }
      if (!this.payment.freightFee) {
        this.$Message.error('请输入运输费')
        return false
      }
      if (!this.settlementType) {
        this.$Message.error('请选择结算方式')
        return false
      }
      if (this.settlementType === '1' && !this.checkTotalAmount()) return false

      return true
    }
  }
}
